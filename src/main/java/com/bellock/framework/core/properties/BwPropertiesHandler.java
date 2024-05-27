package com.bellock.framework.core.properties;

import java.util.Iterator;

import org.apache.commons.configuration2.PropertiesConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;


/**
 * 프로퍼티를 하나로 통합한 객체.
 * 
 * 조건에 맞는 모든 프로퍼티 파일의 설정된 값을 읽어와 Properties 객체 하나로 관리.
 * 모든 config 폴더 아래에 위치한 .properties 파일을 읽어 키-값 쌍으로 관리하도록 
 * 기능을 제공한다.
 * 
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.04, 나인석, 최적화
 */
public class BwPropertiesHandler extends PropertiesConfiguration {
	private static final Logger logger = 
			LoggerFactory.getLogger(BwPropertiesHandler.class);

    @Profile("dev")
    public void propertiesLog() {
        StringBuffer elements = new StringBuffer();
        Iterator<String> keys = getKeys();

        while (keys.hasNext()) {
            String key = keys.next();
            String value = getString(key);
            elements.append("\n[").append(key).append("] : ").append(value);
        }
        logger.info(elements.toString());
        elements = null;
    }

}

