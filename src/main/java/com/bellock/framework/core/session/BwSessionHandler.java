package com.bellock.framework.core.session;

import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import jakarta.servlet.http.HttpSession;

import static com.bellock.framework.core.constant.BwConstants.Session.Const.*;


/**
 * 세션 중복 및 타임아웃 체크하는 클래스.
 * 해당 클래스는 유지 관리되는 세션 정보를 이용해 특정 기능을
 * 재공하는 클래스이다.
 * 
 * 세션중복을 허락하지 않을 경우 로그인 컨트롤러 및 서비스에서
 * 해당 클래스의 static 메서드를 호출하면 된다.
 * 
 * 단, 세션에서 유지 관리되는 중복되지 않는 값(예: user ID)의
 * 키와 값을 이용해 중복되는 세션이 있는지 확인한다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
public class BwSessionHandler {
    private static final Logger logger = 
            LoggerFactory.getLogger(BwSessionHandler.class);
            
    /**
     * 세션의 중복을 확인해 신규로 로그인한 사용자와 동일한 계정의 사용자가
     * 있을 경우 이전에 로그인된 세션을 해제하는 기능을 제공한다.
     * 
     * 중복 여부를 체크하는 방법은 세션에서 관리하는 계정을 파악할 수 있는
     * 유일한 값을 이용해 중복 여부를 확인한다.
     * 
     * 신규로 로그인된 세션은 유일한 계정 정보 값을 세션에 저장하기 전에 해당
     * 함수를 호출해야 한다.
     * 
     * 세션은 invalidate해도 브라우져가 살아있거나, 세션 타임이 완료되기전에 
     * destroyed 되지 않기 때문에 강제적으로 BellockSessionManager 클래스의
     * removeSession 메서드를 호출해서는 않된다.
     * 
     * @param key 체크해야할 세션 속성의 키
     * @param value 체크해야할 세션 속성의 값
     */
    public static void sessionPreventDuplication(String name, String value) {
        String sessionId = BwSessionManager.getSessionId(name, value);
        if (sessionId != null) {
            HttpSession session = BwSessionManager.getSession(sessionId);
            WebSocketSession wss = (WebSocketSession) session.getAttribute(KEY_SOCKET_STR);
            try {
                if (wss != null) {
                    // 종료 메세지를 보내 초기(로그인)화면으로 이동하게 유도한다.
                    wss.sendMessage(new TextMessage(TIMEOUT_PACKET_STR));
                }
            } catch (Exception e) {
                logger.error("{}", e.getMessage(), e);
            }
        }
    }

    /**
     * 세션 정보를 확인해 세션타임아웃에 해당하는 경우 종료 및 연장 처리를 진행하는 메서드.
     * 현재시간 - 최종 접근시간 + 2분 >= 세션유지 시간인 세션에 대해 클라이언트로 
     * 웹소켓 통신 (메세지 전송)을 한다.
     * 
     * 프로퍼티에 세션 유지 시간을 설정할 경우 Spring Framework에 설정하는 세션 
     * 타임 설정값 보다 최소 2분 이상을 설정하도록 해야 한다. 
     * 아니면 세션 유지 시간을 어플리케이션 로드시 동적으로 프로퍼티에 설정된 시간 
     * 보다 2분 이상 더 설정해 준다.
     * 
     * @param st SessionTimeoutHandler의 구현 클래스 객체
     * @param currentTimeMillis 현재시간
     * @param toExpierTime Expier Time 
     */
    public static void checkSessionExpiration(BwSessionTimeoutHandler st, final long currentTimeMillis, final int toExpierTime) {
        // 세션을 관리하는 맵의 Iterator를 가져온다
        Iterator<Map.Entry<String, HttpSession>> iterator = BwSessionManager.getIterator();

        // 맵에 저장된 세션 정보를 확인해 해제할 대상을 찾아 후처리 작업을 할 수 있도록 
        // SessionTimeoutHandler 수현 객체로 넘긴다
        while (iterator.hasNext()) {
            Map.Entry<String, HttpSession> entry = iterator.next();
            HttpSession hs = entry.getValue();

            long lastAccessedTime = hs.getLastAccessedTime();
            long sessionDurationMillis = currentTimeMillis - lastAccessedTime;

            if (sessionDurationMillis > toExpierTime) {
                WebSocketSession wss = (WebSocketSession) hs.getAttribute(KEY_SOCKET_STR);
                if (wss == null) { continue; }

                logger.info(
                    "session timeout, user: {}", 
                    hs.getAttribute(KEY_SESSION_UNIQ_STR) != null ? hs.getAttribute(KEY_SESSION_UNIQ_STR).toString() : "");
                if (wss != null) {
                    st.sessionTimeoutProc(wss);
                }
            }
        }
    }

}


