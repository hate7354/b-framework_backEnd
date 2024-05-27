package com.bellock.framework.core.mybatis;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;


/**
 * MyBatis와 Spring 통합을 위한 설정을 구성하는 클래스.
 * <p>
 * MyBatis의 {@link SqlSessionFactory}와 {@link SqlSessionTemplate}을 설정하고 Spring의 빈으로 등록,<p>
 * 이를 통해 MyBatis와 데이터베이스 간의 연결을 관리하고, SQL 세션을 처리하는 데 필요한 모든 메서드를 제공한다.
 * 
 * @since 2024.04, 나인석, 최초작성
 */
@Configuration
public class BwMyBatisConfig {

    /** MyBatis 환경설정 정보 파일 */
    @Value(value = "classpath:/config/mybatis-config.xml")
    private Resource myBatisConfig;

    /** 모든 클래스 패스에 위치한 /mappers 디렉터리 아래에 있는 XML파일을 검색 */
    @Value(value = "classpath*:/mappers/**/*.xml")
    private Resource[] mapperLocations;


    /**
     * MyBatis를 사용하여 {@link SqlSessionFactory}를 구성하고 반환.
     * <p>데이터 소스 및 환경파일, 매퍼파일의 위치를 설정.
     * <p>{@link SqlSessionFactoryBean}객체를 통해 SqlSessionFactory 인스턴스 반환.
     * <P>
     * SqlSessionFactory 클래스는 MyBatis와 데이터베이스 간의 연결을 관리하는 역할을 한다.
     * 
     * @param dataSource 데이터 소스 객체(RL, 사용자이름, 비밀번호 등의 세부 정보)
     * @return SqlSessionFactory 인스턴스
     * @throws Exception
     */
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setConfigLocation(myBatisConfig);
        factoryBean.setMapperLocations(mapperLocations);
        return factoryBean.getObject();
    }

    /**
     * {@link SqlSessionTemplate}을 구성하고 반환.<p>
     * SqlSessionTemplate은 MyBatis와 Spring 통합하는 클래스이며,
     * 트랜잭션 관리와 세션 생성을 처리한다.
     * <P>
     * SqlSessionTemplate 클래스는  MyBatis의 SqlSession을 구현하는 Spring 클래스이며,<p>
     * MyBatis의 SQL 세션을 다루는 데 필요한 모든 메서드를 제공한다.
     * 
     * @param sqlSessionFactory {@link SqlSessionFactory} 객체
     * @return {@link SqlSessionTemplate} 객체
     */
    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}


