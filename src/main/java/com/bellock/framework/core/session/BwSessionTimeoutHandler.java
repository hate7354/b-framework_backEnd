package com.bellock.framework.core.session;

import org.springframework.web.socket.WebSocketSession;


/**
 * 세션 타임아웃 처리 인터페이스.
 * 
 * 30초 간격으로 해당 인터페이스의 sessionTimeoutProc 메서드가 
 * 스케줄러에 의해 호출 된다
 * 
 * @since 2024.05, 나인석, 최초작성
 */
public interface BwSessionTimeoutHandler {

    /**
     * 세션의 타임아웃이 처리하는 Procedure.
     * 기본 처리방식은 세션이 타임아웃된 경우 클라이언트로 웹소켓을 통해 메세지를 전송해, 
     * 이후의 처리(logout)를 클라이언트에게 위임한다.
     * 
     * @param message 전송할 메세지
     * @param wss 웹소켓 객체 
     */
    void sessionTimeoutProc(WebSocketSession wss);

}
