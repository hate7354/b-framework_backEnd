package com.bellock.framework.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.bellock.framework.core.util.BwBeanAutowiringUtils;


/**
 * <h4>객체의 필드에 프로퍼티에 설정된 값을 주입하는 어노테이션.</h4>
 * <P>
 * 대상 객체는 빈으로 등록되지 않은 객체를 대상으로 한다.<p>
 * 해당 어노테이션은 필드에 선언하고 인스턴스를 생성한 후 생성자에서
 * <p>{@link BwBeanAutowiringUtils#processBwProperty(Object)}메서드를
 * 호출해야만 필드로 데이터가 주입된다.
 * 
 * <p>그리고 해당 어노테이션은 {@code config/*.properties}에 설정된 데이터에 한해 동작된다.
 * 
 * @since 2024.04, 나인석, 최초작성
 * @see BwBeanAutowiringUtils
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface BwProperty {
    String value();
}


