package com.bellock.framework.core.context;

import java.lang.annotation.Annotation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.NoUniqueBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;


/**
 * 어플리케이션 컨텍스트를 관리하는 클래스.<p>
 * 
 * 해당 클래스는 컨트롤러나 서비스 외 기타 등등의 클래스에서 {@code @Autowired} 어노테이션을<p>
 * 사용하지 않고 빈에 등록된 클래스의 인스턴스를 구하기 위해 정의된 클래스이다.
 * <p>
 * 빈에 등록되어 있는 객체의 인스턴스를 얻기 위해서는 static 메서드인 {@link #getBean(Class)}
 * 메서드를 사용하면 된다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Component
public class BwApplicationContextAware implements ApplicationContextAware {
    private static Logger logger = 
            LoggerFactory.getLogger(BwApplicationContextAware.class);

    /**
     * 빈으로 등록하는 어노테이션 리스트.
     * @see #isBeanObject(Object)
     */
    @SuppressWarnings("unchecked")
    private static Class<? extends Annotation>[] beanAnnotations = new Class[] {
        Component.class,
        Service.class,
        Repository.class,
        Controller.class,
        RestController.class,
        Configuration.class,
        Bean.class
    };

   /**
     * 어플리케이션 컨텍스트 객체.
     * @see #setApplicationContext(ApplicationContext)
     * @see #getApplicationContext()
     * @see #getBean(Class)
     */
    private static ApplicationContext context;


	/**
	 * 이 객체가 실행되는 ApplicationContext를 설정한다.<p>
	 * 보통 이 호출은 객체를 초기화하는 데 사용된다.<p>
	 * <p>Invoked after population of normal bean properties but before an init callback such
	 * as {@link org.springframework.beans.factory.InitializingBean#afterPropertiesSet()}<P>
	 * or a custom init-method. Invoked after {@link ResourceLoaderAware#setResourceLoader},<p>
	 * {@link ApplicationEventPublisherAware#setApplicationEventPublisher} and
	 * {@link MessageSourceAware}, if applicable.
     * 
	 * @param applicationContext 객체에서 사용할 ApplicationContext 객체
	 * @throws ApplicationContextException in case of context initialization errors
	 * @throws BeansException if thrown by application context methods
	 * @see org.springframework.beans.factory.BeanInitializationException
	 */
    @SuppressWarnings("null")
    @Override
    public void setApplicationContext(
            ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    /**
     * 어플리케이션의 컨텍스트 객체를 반환한다.
     *
     * @return ApplicationContext 객체
     */
    public static ApplicationContext getApplicationContext() {
        return context;
    }

    /**
	 * 빈에 등록된 객체를 반환한다.<p>
     * 해당 메서드는 빈으로 등록된 객체 중 아규먼트의 클래스 타입과 일치하는 객체를 반환한다.
     * <p>
	 * <p>This method goes into {@link ListableBeanFactory} by-type lookup territory
	 * but may also be translated into a conventional by-name lookup based on the name
	 * of the given type. For more extensive retrieval operations across sets of beans,
	 * use {@link ListableBeanFactory} and/or {@link BeanFactoryUtils}.
     * 
     * @param requiredType type the bean must match; can be an interface or superclass
     * @return an instance of the single bean matching the required type
	 * @throws NoSuchBeanDefinitionException if no bean of the given type was found
	 * @throws NoUniqueBeanDefinitionException if more than one bean of the given type was found
	 * @throws BeansException if the bean could not be created
     */
    public static <T> T getBean(Class<T> requiredType) {
        try {
            if (context == null) { return null; }
            return context.getBean(requiredType);
        } catch (BeansException e) {
            logger.info("{}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 빈으로 등록되어 있는 객체인지 확인.
     * 
     * @param bean 빈 객체
     * @return 빈으로 등록된 객체인 경우 {@code true}반환, 그렇지 않으면 {@code false}
     */
    public static boolean isBeanObject(Object bean) {
        boolean isBean = false;
        Class<?> clazz = bean.getClass();

        for (Class<? extends Annotation> annotation : beanAnnotations) {
            if (clazz.isAnnotationPresent(annotation)) {
                isBean = true;
                break;
            }
        }
        return isBean;
    }

}


