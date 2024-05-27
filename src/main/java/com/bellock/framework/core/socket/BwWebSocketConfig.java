package com.bellock.framework.core.socket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import static com.bellock.framework.core.constant.BwConstants.Session.Const.SOCKET_PATH_NAME_STR;


/**
 * 웹소켓 핸들러 등록
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Configuration
@EnableWebSocket
public class BwWebSocketConfig implements WebSocketConfigurer {

    /**
     * 웹소켓 핸들러를 등록하고 엔드포인트를 설정
     * 
     * @param registry WebSocketHandlerRegistry 객체
     */
    @Override
    @SuppressWarnings("null")
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(bellockWebSocketHandler(), SOCKET_PATH_NAME_STR);
    }

    /**
     * 웹소켓 객체 빈으로 등록
     * 텍스트 기반 웹소켓 객체를 빈으로 등록 시킨다
     * 
     * @return BellockWebSocketHandler 객체
     */
    @Bean
    public WebSocketHandler bellockWebSocketHandler() {
        return new BwWebSocketHandler();
    }

}


