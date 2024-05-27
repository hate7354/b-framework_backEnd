package com.bellock.framework.core.session;

import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.http.HttpSessionListener;


/**
 * 세션 환경 설정 정보 클래스.
 * 세션이 생성되거나 해제될 때 콜백 이벤트를 받을 수 있도록 설정하는 클래스.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Configuration
public class BwSessionConfig {

    /**
     * 세션 생성 및 해제시 이벤트 콜백을 받을 수 있도록 Listener 객체를 생성한다
     * 
     * @return ServletListenerRegistrationBean 타입의 객체
     */
    @Bean
    public ServletListenerRegistrationBean<HttpSessionListener> sessionListener() {
        ServletListenerRegistrationBean<HttpSessionListener> listenerBean = new ServletListenerRegistrationBean<>();
        listenerBean.setListener(new BwSessionListener());
        return listenerBean;
    }

}


