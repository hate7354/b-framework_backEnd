package com.bellock.framework.core.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import static com.bellock.framework.core.constant.BwConstants.Locale.PropKey.Placeholder.RESOURCE_LOCATION;


/**
 * 프레임워크의 Properties 관리하기 위한 환경설정 클래스.
 * <p>
 * 저건에 맞는 프로퍼티 파일 수집 후 정보를 {@link BwConfigurationFactory} 객체에게 넘긴다.
 * <p>{@code BwConfigurationFactory} 객체는 수집된 프로퍼티 파일을 대상으로 통합된 프로퍼티를 생성한다.
 * <p>
 * 해당 클래스는 {@code BwConfigurationFactory}와 {@link BwPropertiesHandler} 두 클래스를 통해, 
 * <p>키-값 쌍으로 이루어진 통합된 프로퍼티를 생성하고, {@code BwPropertiesHandler}를 빈으로 등록해 해당 객체를 통하여,
 * <p>프레임워크의 전반에서 프로퍼티에 접근할 수 있도록 스타터 환경을 제공한다.
 * 
 * @since 2024.04, 나인석, 최초작성
 * @since 2024.05, 나인석, 클래스 구현방식 수정
 */
@Configuration
public class BwPropertiesConfig {

   	/** 모든 config 폴더 아래에 위치한 .properties 파일을 수집 */
	@Value(RESOURCE_LOCATION)
	private Resource[] propertyFiles;

    /**
     * {@link BwPropertiesHandler} 객체를 생성하는 빈 메서드.
     * <p>
     * <p>수집된 모든 .properties 파일의 정보를 {@link BwConfigurationFactory} 객체에게 넘겨 
     * 하나로 통합된 BwPropertiesHandler 객체를 생성하도록 한다.
     * 
     * @return {@link BwPropertiesHandler} 객체
     * @throws Exception
     */
    @Bean
    public BwPropertiesHandler bwPropertiesHandler() throws Exception {
        return new BwConfigurationFactory().propertyBuild(propertyFiles);
    }

}


