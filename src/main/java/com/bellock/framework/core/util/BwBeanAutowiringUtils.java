package com.bellock.framework.core.util;

import java.lang.reflect.Field;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.core.env.Environment;

import com.bellock.framework.core.annotation.BwProperty;
import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.annotation.BwProfile;
import com.bellock.framework.core.context.BwApplicationContextAware;
import com.bellock.framework.core.properties.BwPropertiesHandler;

import static com.bellock.framework.core.constant.BwConstants.Const.ANNO_PATTERN_STR;


/**
 * <h4>어노테이션 처리 Utils 클래스.</h4>
 * <p>
 * 빈으로 등록되지 않은 객체의 프로파일의 키와 매핑된 값을 필드에 주입하고, 
 * <p>모든 객체에 프로퍼티의 키와 매핑된 값을 필드에 주입하는 기능을 
 * 제공하는 유틸리티 클래스.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
public class BwBeanAutowiringUtils {
    /**
     * 프로파일 키와 디폴트 값을 구하는 패턴
     * <h3>예제코드</h3>
     * <prev>@BwProperty("${com.bellock.active:prod}")<p>String runtimeMode;</prev>
     * @see #injectBwProfileFields(Object, Class, Environment)
     * @see #injectBwPropertyFields(Object, Class, BwPropertiesHandler)
     */
    private static final Pattern PATTERN = Pattern.compile(ANNO_PATTERN_STR);

    /**
     * 타입 간의 변환을 처리하는 데 사용되는 인터페이스 객체
     * @see #injectBwProfileFields(Object, Class, Environment)
     * @see #injectBwPropertyFields(Object, Class, BwPropertiesHandler)
     */
    private static final ConversionService conversionService = new DefaultConversionService();


    /**
     * 어노테이션 {@code @BwValue}이 선언된 필드에 데이터를 주입하기 위한 처리.
     * <p>해당 메서드는 빈으로 등록되지 않은 객체가 필드에 데이터를 주입하기 위해
     * <p>기본 생성자에서 호출되며, 프로파일에 설정된 키 값을 필드에 주입한다.
     * 
     * @param bean 클래스 객체
     */
    public static void processBwProfile(Object bean) {
        // 빈으로 등록되지 않은 객체만 적용
        if (!BwApplicationContextAware.isBeanObject(bean)) {
            if (BwApplicationContextAware.getApplicationContext() == null) { return; }
            Environment env = BwApplicationContextAware.getApplicationContext().getEnvironment();
            injectBwProfileFields(bean, bean.getClass(), env);
        }
    }

    /**
     * 프로파일에 설정된 키 값을 필드에 주입하는 처리.
     * 
     * <p>어노테이션 {@code @BwProfile}이 선언된 필드에 데이터를 주입하는 처리를 한다.
     * <p>해당 메서드는 필드에 어노테이션 {@code @BwProfile}을 선언하면 모든 객체의 
     * <p>필드에 프로파일 키와 매핑된 값을 주입한다.
     * 
     * @param bean 빈 객체
     * @param clazz 클래스 타입
     * @param env Environment 객체
     */
    private static void injectBwProfileFields(Object bean, Class<?> clazz, Environment env) {
        if (clazz == null || clazz == Object.class) {
            return;
        }
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(BwProfile.class)) {
                BwProfile BwProfile = field.getAnnotation(BwProfile.class);
                String valueWithDefault = BwProfile.value();
                Matcher matcher = PATTERN.matcher(valueWithDefault);

                if (matcher.matches()) {
                    String key = matcher.group(1);
                    String defaultValue = matcher.group(2);
                    String value = env.getProperty(key, defaultValue);
                    field.setAccessible(true);
                    try {
                        Object obj = conversionService.convert(value, field.getType());
                        field.set(bean, obj);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        // 재귀적으로 상위 클래스의 필드 처리
        injectBwProfileFields(bean, clazz.getSuperclass(), env);
    }

    /**
     * 어노테이션 {@code @BwProperty}이 선언된 필드에 데이터를 주입하기 위한 처리.
     * <p>해당 메서드는 모든 객체가 필드에 프로퍼티 데이터를 주입하기 위해
     * <p>기본 생성자에서 호출되며, 프로퍼티에 설정된 키 값을 필드에 주입한다.
     * 
     * @param bean 클래스 객체
     */
    public static void processBwProperty(Object bean) {
        BwPropertiesHandler inst = BwApplicationContextAware.getBean(BwPropertiesHandler.class);
        Class<?> clazz = bean.getClass();
        injectBwPropertyFields(bean, clazz, inst);
    }

    /**
     * 프로퍼티에 설정된 키 값을 필드에 주입하는 처리.
     * 
     * <p>어노테이션 {@code @BwProperty}이 선언된 필드에 데이터를 주입하는 처리를 한다.
     * <p>해당 메서드는 필드에 어노테이션 {@code @BwProperty}을 선언하면 모든 객체의 
     * <p>필드에 프로퍼티 키와 매핑된 값을 주입한다.
     * 
     * @param bean 클래스 객체
     * @param clazz 클래스 타입
     * @param inst BwPropertiesHandler 객체
     */
    private static void injectBwPropertyFields(Object bean, Class<?> clazz, BwPropertiesHandler inst) {
        if (clazz == null || clazz == Object.class) {
            return;
        }
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(BwProperty.class)) {
                BwProperty bwProperty = field.getAnnotation(BwProperty.class);
                String valueWithDefault = bwProperty.value();
                Matcher matcher = PATTERN.matcher(valueWithDefault);

                if (matcher.matches()) {
                    String key = matcher.group(1);
                    String defaultValue = matcher.group(2);
                    String value = inst.getString(key, defaultValue);
                    field.setAccessible(true);
                    try {
                        Object obj = conversionService.convert(value, field.getType());
                        field.set(bean, obj);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        // 재귀적으로 상위 클래스의 필드 처리
        injectBwPropertyFields(bean, clazz.getSuperclass(), inst);
    }

    /**
     * 어노테이션 {@code @BwSetField}이 선언된 필드에 데이터를 주입하기 위한 처리.
     * <p>해당 메서드는 모든 객체를 대상으로하며, 객체에 프로파일과 프로퍼티에 <p>
     * 설정된 키값과 매핑된 데이터를 주입한다.
     * 
     * @param bean 클래스 객체
     */
    public static void processBwSetField(Object bean) {
        if (BwApplicationContextAware.getApplicationContext() == null) { return; }
        Environment env = BwApplicationContextAware.getApplicationContext().getEnvironment();
        BwPropertiesHandler inst = BwApplicationContextAware.getBean(BwPropertiesHandler.class);
        if (env == null || inst == null) {
            return;
        }
        injectBwSetFields(bean, bean.getClass(), env, inst);
    }

    /**
     * <h4>프로파일 및 프로퍼티 키와 매핑된 값을 필드에 주입.</h4>
     * 단, 두 파일에 같은 키가 있을 경우, 프로파일을 우선시 한다.
     * <p>해당 메서드는 {@code @Value}어노테이션에 대한 빈의 기본 처리 후
     * <p>다시 처리되므로 런타임 비용이 발생한다.
     * 
     * @param bean 클래스 객체
     * @param clazz 클래스 타입
     * @param env Environment 객체
     * @param inst BwPropertiesHandler 객체
     */
    private static void injectBwSetFields(Object bean, Class<?> clazz, Environment env, BwPropertiesHandler inst) {
        if (clazz == null || clazz == Object.class) {
            return;
        }
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(BwSetField.class)) {
                BwSetField bwSetField = field.getAnnotation(BwSetField.class);
                String valueWithDefault = bwSetField.value();
                Matcher matcher = PATTERN.matcher(valueWithDefault);

                if (matcher.matches()) {
                    String key = matcher.group(1);
                    String defaultValue = matcher.group(2);

                    String value = null;
                    String envValue = env.getProperty(key);
                    String propValue = inst.getString(key);

                    // application.properties 설정을 우선시 한다
                    if (propValue != null && envValue == null) {
                        value = inst.getString(key, defaultValue);
                    } else {
                        value = env.getProperty(key, defaultValue);
                    }
                    field.setAccessible(true);
                    try {
                        Object obj = conversionService.convert(value, field.getType());
                        field.set(bean, obj);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        injectBwSetFields(bean, clazz.getSuperclass(), env, inst);
    }

}

