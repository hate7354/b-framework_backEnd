package com.bellock.framework.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.bellock.framework.core.util.BwBeanAutowiringUtils;


/**
 * <h4>객체의 필드에 프로파일에 설정된 값을 주입하는 어노테이션.</h4>
 * <p>
 * 대상 객체는 빈으로 등록되지 않은 객체를 대상으로 한다.<p>
 * {@code @Value}어노테이션은 빈으로 등록되는 객체에 한 해 데이터가
 * 주입되기 때문에 <p>빈 객체가 아닌 경우 정상 동작되지 않는다.
 * <p>
 * 해당 어노테이션은 필드에 선언하고 인스턴스를 생성한 후 생성자에서
 * <p>{@link BwBeanAutowiringUtils#processBwProfile(Object)}메서드를
 * 호출해야만 필드로 데이터가 주입된다.
 * <p>그리고 해당 어노테이션은 {@code application.properties}에 설정된 데이터에 한해 동작된다.
 * 
 * @since 2024.05, 나인석, 최초작성
 * @see BwBeanAutowiringUtils
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface BwProfile {
    String value();
}


