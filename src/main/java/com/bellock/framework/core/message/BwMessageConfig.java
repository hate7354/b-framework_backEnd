package com.bellock.framework.core.message;

import java.util.Locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import com.bellock.framework.core.annotation.BwSetField;

import static com.bellock.framework.core.constant.BwConstants.Locale.PropKey.Placeholder.*;


/**
 * 다국어 CookieLocaleResolver 객체를 빈에 등록으로 등록하는 환경설정
 * 
 * @history: 2024.04, 박준노/나인석, 최초작성
 */
@Configuration
public class BwMessageConfig {
	/**
	 * 디폴트 쿠키 저장된 locale 유지 기간
	 */
	@BwSetField(COOKIE_MAXAGE_DEF)
	private int maxAge;

	/**
	 * 디폴트 언어
	 */
	@BwSetField(LANGUAGE_DEF)	
	private String defaultLanguage;

	/**
	 * 디폴트 국가
	 */
	@BwSetField(COUNTRY_DEF)
	private String defaultCountry;

	
	/**
	 * CookieLocaleResolver 객체를 빈으로 등록한다.
	 * 초기 디폴트 언어는 한국어로 설정.
	 * 
	 * @return CookieLocaleResolver 객체
	 */
	@Bean
	@SuppressWarnings("deprecation")
	public LocaleResolver localeResolver() {
		CookieLocaleResolver localeResolver = new CookieLocaleResolver();
		localeResolver.setCookieName("lang");
		localeResolver.setDefaultLocale(Locale.of(defaultLanguage, defaultCountry));
		localeResolver.setCookieMaxAge(maxAge);
		localeResolver.setCookieHttpOnly(true);
		return localeResolver;
	}
    
}


