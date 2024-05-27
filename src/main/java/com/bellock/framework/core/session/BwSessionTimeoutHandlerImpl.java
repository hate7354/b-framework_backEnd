package com.bellock.framework.core.session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.properties.BwPropertiesHandler;
import com.bellock.framework.core.util.BwActiveMode;
import com.bellock.framework.core.util.BwDateTimeUtil;

import jakarta.annotation.PostConstruct;

import static com.bellock.framework.core.constant.BwConstants.Session.Const.*;
import static com.bellock.framework.core.constant.BwConstants.Session.PropKey.Placeholder.TIMEOUT_DEF;
import static com.bellock.framework.core.constant.BwConstants.Const.*;


/**
 * 세션의 유지 시간을 체크해 로그인 화면으로 이동 시키거나
 * 연장화면을 클라이언트가 띄우도록 웹소켓 통신을 진행 시키는 클래스
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Component
@ConditionalOnProperty(name = "bellock.session.timeout.enabled", havingValue = "Y", matchIfMissing = true)
public class BwSessionTimeoutHandlerImpl implements BwSessionTimeoutHandler {
    private static final Logger logger = 
            LoggerFactory.getLogger(BwSessionTimeoutHandlerImpl.class);

    /**
     * 프로퍼티 핸들러
     */
    @Autowired
    BwPropertiesHandler bwph;
    
    /**
     * 설정된 어플케이션 세션타임
     */
    @BwSetField(TIMEOUT_DEF)
    private int sessionTimeout;

    /**
     * 해당 클래스 객체가 빈으로 등록된 후 자동 호출.
     * 해당 메서드에서는 세션타임의 임계점을 설정하고 ms으로 변경한다.
     * 스케줄러에 의해 30초 간격으로 호출된 메서드에서 사용된다.
     */
    @PostConstruct
    public void init() {
        this.sessionTimeout -= SLACK_TIME_INT; // -2분
        this.sessionTimeout *= UNIT_MS_INT; // ms 변경
    }

    /**
     * 해당 메서드는 스케쥴러에 의해 30초마다 호출된다.
     * 해당 함수에서 BellockSessionHandler 클래스의 메서드를 통해 세션들의 
     * 시간을 확인해 자동 종료 시키거나, 연장여부 확인하는 화면을 띄우도록 
     * 클라이언트와 통신하게 한다.
     * 
     * 그리고 Scheduler가 동작하려면 application에 @EnableScheduling
     * 어노테이션이 선언되어 있어야 한다.
     */
    @Scheduled(fixedDelay = DURATION_INT) // 30초마다 실행
    public void checkSessionExpiration() {
        if (BwActiveMode.isDevMode()) {
            logger.info("## Session Timeour check schedul: {}", BwDateTimeUtil.convertNowToString("yyyy/MM/dd HH:mm:ss"));
        }

        BwSessionHandler.checkSessionExpiration(this, System.currentTimeMillis(), this.sessionTimeout);
    }

    /**
     * 세션이 거의 만료된 경우 해당함수가 호출되고, 클라이언트로 웹소켓을 통해 전송하는 
     * 쓰레드를 호출해 메세지와 웹소켓 객체를 전달한다.
     * 
     * @param message 메세지 스트링
     * @param wss 웹소켓 객체
     */
    @Override
    public void sessionTimeoutProc(WebSocketSession wss) {
        if (wss != null) {
            try {
                MessageSendThread mst = new MessageSendThread(TIMEOUT_PACKET_STR, wss);
                mst.start();
            } catch (Exception e) {
                logger.info("{}", e.getMessage(), e);
            }
        }
    }

    /**
     * 사용자가 많아질 경우 웹 소켓을 통한 메세지 전송에 병목현상이 발생할 수 있기 때문에
     * Thread를 통해 병목현상을 해결하기 위한 쓰레드 메세지 전송 클래스
     * 
     * @history: 2024.05, 나인석, 최초작성
     */
    private class MessageSendThread extends Thread {
        /**
         * 클라이언트로 보낼 메세지 스트링
         * 해당 메세지를 받으면 클라이언트는 로그아웃 처리하거나, 세션연장화면을 띄운다
         */
        private String message;

        /**
         * 해당 세션의 WebSocket 객체
         */
        private WebSocketSession wss;

        /**
         * 생성자.
         * 클라이언트로 보낼 메세지와 해당 세션의 웹소켓 객체를 받는다
         * 
         * @param message 메세지 스트링
         * @param wss 웹소켓 객체
         */
        public MessageSendThread(String message, WebSocketSession wss) {
            this.message = message;
            this.wss = wss;
        }

        /**
         * 쓰레드의 해당 메서드에서 메세지 전송을 진행하고 쓰레드는 종료 된다
         */
        @Override
        public void run() {
            try {
                wss.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                logger.info("{}", e.getMessage(), e);
            }
        }
    }

}


