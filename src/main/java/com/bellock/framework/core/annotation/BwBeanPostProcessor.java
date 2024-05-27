package com.bellock.framework.core.annotation;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import com.bellock.framework.core.util.BwBeanAutowiringUtils;


/**
 * <h4>BeanPostProcessor 구현 클래스.</h4>
 * <p>
 * 빈으로 등록되는 객체에서 {@code @BwSetField}어노테이션이 있는 필드에
 * <p>프로파일 및 프로퍼티의 데이터를 자동적으로 주입하는 클래스.
 * <p>
 * 해당 클래스의 {@link #postProcessAfterInitialization(Object, String)} 메서드는
 * <p>빈에 객체들이 등록되고 초기화 된 후 호출 된다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Component
public class BwBeanPostProcessor implements BeanPostProcessor {
	
    /**
     * <h4>빈 인스턴스에 대해 초기화 콜백</h4>
     * <p>
     * <p>빈이 초기화된 후 {@code @BwSetField}어노테이션이 있는 필드에
     * 프로퍼티 값을 주입한다.
     * <p>
     * {@link #postProcessBeforeInitialization(Object, String)} 함수를 override 해야 한다. 
     * <p>{@link #postProcessAfterInitialization(Object, String)} 함수를  override 하게되면 
     * {@code @PostConstruct} 어노테이션을 사용한 메서드가 있을 경우 해당 메서드가 먼저 호출되기 
     * <p>때문에 의도하지 않은 결과가 나올 수 있다.
     * 
     * @param bean the new bean instance
     * @param beanName the name of the bean
     * @return the bean instance to use, either the original or a wrapped one
     */
    @SuppressWarnings("null")
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean == null || beanName == null) {
            return bean;
        }
    	
        // property 관련 객체가 순환 참조 발생되는 것을 방지
        if (beanName.equals("bwPropertiesConfig")       || 
                beanName.equals("bwPropertiesHandler")  || 
                beanName.equals("bwConfigurationFactory")) {
            return bean;
        }
        BwBeanAutowiringUtils.processBwSetField(bean);
        return bean;
    }

}


