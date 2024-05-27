package com.bellock.framework.core.properties;

import java.io.File;
import java.io.IOException;
import java.net.URL;

import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.PropertiesConfiguration;
import org.apache.commons.configuration2.SystemConfiguration;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.apache.commons.configuration2.io.FileHandler;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;

import com.bellock.framework.core.context.BwApplicationContextAware;

import static com.bellock.framework.core.constant.BwConstants.ActiveProfile.PropKey.ACTIVE;
import static com.bellock.framework.core.constant.BwConstants.ActiveProfile.Const.PROD_STR;


/**
 * 프로퍼티 팩토리 클래스.
 * 해당 클래스는 /config 폴더 아래에 있는 모든 .properties 파일을 로드하고 관리 한다.
 * 
 * @history: 2024.03, 나인석, 최초작성
 * 			 2024.04, 나인석, 클래스 최적화
 */
public class BwConfigurationFactory {
	
    /** BwPropertiesConfiguration 객체 참조 */
    private final BwPropertiesHandler bwPropertiesHandler;

    /**
     * 생성자, 빈으로 등록된 BwPropertiesConfiguration 객체를 주입받는다.
     */
    public BwConfigurationFactory() {
        this.bwPropertiesHandler = new BwPropertiesHandler();
    }

    /**
     * 수집된 프로퍼티 파일들을 로드한 후 BwPropertiesConfiguration 객체로 병합.
	 * 
     * @return BwPropertiesConfiguration 객체
     * @throws IOException
     * @throws ConfigurationException
     */
    public BwPropertiesHandler propertyBuild(Resource[] propertyFiles) throws Exception {
        // system configuration
        Configuration[] configurations = 
                new Configuration[] { new SystemConfiguration() };

        if (configurations != null) {
            for (int i=0; i<configurations.length; i++) {
                bwPropertiesHandler.append(configurations[i]);
            }
        }

        for (Resource propertyFile : propertyFiles) {
            URL url = propertyFile.getURL();
            File file = new File(url.getPath());

            PropertiesConfiguration config = new PropertiesConfiguration();
            FileHandler fileHandler = new FileHandler(config);
            fileHandler.load(file);

            bwPropertiesHandler.append(config);
        }

        Environment env = BwApplicationContextAware.getApplicationContext().getEnvironment();
        String mode = env.getProperty(ACTIVE, PROD_STR);
        if (!mode.equals(PROD_STR)) {
            bwPropertiesHandler.propertiesLog();
        }
		
		return bwPropertiesHandler;
    }

}

