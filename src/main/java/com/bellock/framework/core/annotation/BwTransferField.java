package com.bellock.framework.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * VO 객체와 DTO 객체간의 매핑처리를 위한 어노테이션.<p>
 * 해당 어노테이션을 클래스 타입에서 선언하면 VO 클래스의 필드 전체를 
 * DTO 클래스에 선언된 일치하는 필드와 매핑하고,<P> 필드 레벨에서 선언하면
 * 해당 필드만 매핑 처리한다.
 * 
 * @since 2024.04, 나인석, 최초작성
 */
@Target({ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface BwTransferField {
}


