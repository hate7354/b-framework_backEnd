package com.bellock.framework.core.message;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;


/**
 * 다국어 메세지를 처리하는 핸들러.
 * 설정된 Locale에 맞는 키와 매핑된 메세지를 읽을 수 있도록 기능 제공
 * 
 * @history: 2024.04, 박준노/나인석, 최초작성
 *           2024.05, 나인석, default message 적용 method 추가
 */
@Component
public class BwMessageResolver {
    
    /**
     * 메세지 번들(<essage Bundle)을 이용 다국어 메세지를
     * 관리하는 객체
     */
    private MessageSource messageSource;


    /**
     * 생성자, 스프링 프레임워크에 의해 호출.
     * MessageHandler 객페 생성시 프레임워크에 의해 MessageSource 객체 주입
     * 
     * @param messageSource MessageSource 객체
     */
    public BwMessageResolver(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 다국어 메세지를 Getter.
     * 키와 매핑된 다국어 메세지를 읽는다. 만약 없는 경우 ""가 반환.
     * 
     * @param key properties에 기술된 키 스트링
     * @return 다국어 메세지 String
     */
    public String getMessage(String key) {
        return getMessage(key, "");
    }

    /**
     * 다국어 메세지 Getter.
     * 키와 매핑된 다국어 메세지를 읽는다. 만약 없는 경우 default message가 반환.
     * 
     * @param key properties에 기술된 키 스트링
     * @param defaultMessage default message
     * @return 다국어 메세지 String
     */
    public String getMessage(String key, String defaultMessage) {
        return messageSource.getMessage(key, null, defaultMessage, LocaleContextHolder.getLocale());
    }

    /**
     * 다국어 메세지를 Getter.
     * 키와 매핑된 다국어 메세지를 읽는다. 만약 없는 경우 ""가 반환.
     * 
     * 파라메터로 입력된 동적 데이터와 결합된 문자 스트링이 반환된다.
     * 동적데이터(args)는 메세지에 포함된 파라메터("{0}", "{1,date}", "{2,time}")를 대체 한다.
     * 
     * @param key properties에 기술된 키 스트링
     * @param args 메세지에 삽입되는 동적 데이터
     * @return 동적 데이터와 결합된 다국어 메세지 String
     */
    public String getMessage(String key, @Nullable Object[] args) {
        return getMessage(key, args, "");
    }

    /**
     * 다국어 메세지를 Getter.
     * 키와 매핑된 다국어 메세지를 읽는다. 만약 없는 경우 default message가 반환.
     * 
     * 파라메터로 입력된 동적 데이터와 결합된 문자 스트링이 반환된다.
     * 동적데이터(args)는 메세지에 포함된 파라메터("{0}", "{1,date}", "{2,time}")를 대체 한다.
     * 
     * @param key properties에 기술된 키 스트링
     * @param args 메세지에 삽입되는 동적 데이터
     * @param defaultMessage default message
     * @return 동적 데이터와 결합된 다국어 메세지 String
     */
    public String getMessage(String key, @Nullable Object[] args, String defaultMessage) {
        return messageSource.getMessage(key, args, defaultMessage, LocaleContextHolder.getLocale());
    }

}


