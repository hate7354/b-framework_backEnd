package com.bellock.framework.core.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.util.BwBeanAutowiringUtils;

import static com.bellock.framework.core.constant.BwConstants.ActiveProfile.PropKey.Placeholder.ACTIVE_DEF;
import static com.bellock.framework.core.constant.BwConstants.ActiveProfile.Const.*;


/**
 * Abstract 베이스 클래스.
 * <p>
 * 해당 클래스는 컨트롤러 및 서비스의 최상위 클래스이며
 * <p>프로파일 및 프로퍼티를 어노테이션({@code @BwValue}, {@code @BwProperty})을
 * <p>사용할 경우 상속 받는 추상 클래스이다.
 * <p>그리고 어플리케이션의 실행 모드({@code development, test, product})를 확인하는
 * 메서드를 제공한다.
 * <p>
 * @since 2024.05, 나인석, 최초작성
 */
public abstract class BwAbstractBase {
	protected Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * 어플리케이션 프로파일 값.
	 * <p>{@code @Value}와 {@code @BwProfile}어노테이션 통해 필드에 값을 주입.
	 * <p>{@code @Value}의 경우, 해당 클래스를 상속 받은 객체가 빈으로 등록되는 경우이고,
	 * <p>{@code @BwProfile}의 경우는 해당 클래스를 상속 받은 객체가 new로 생성되는 경우이다.
	 * @see #getProfileActive()
	 */
	@BwSetField(ACTIVE_DEF)
	private String activeProfile;

	
	/**
	 * 생성자.
	 * 
	 * <p>어노테이션({@code @BwValue}, {@code @BwProperty})가 선언된 필드에
	 * <p>키 값과 일치하는 데이터 값을 각 필드에 주입하는 처리를 한다.
	 */
	public BwAbstractBase() {
		BwBeanAutowiringUtils.processBwSetField(this);
	}

	/**
	 * {@code spring.profiles.active} 키에 해당하는 값을 반환.<p>
	 * 반환되는 값은 어플리케이션의 실행 모드를 설정한 값이다. 
	 * {@code dev, test, prod}로 구분된다.<p>
	 * 만약 .properties에 
	 *
	 * @return spring active Profile string
	 */
	public String getProfileActive() {
		return activeProfile;
	}
	
	/**
	 * Application 실행이 테스트 모드인지 체크.
	 *
	 * @return boolean. If spring profile is test
	 */
	protected boolean isTestMode() {
		return getProfileActive().endsWith(TEST_STR);
	}
	
	/**
	 * Application 실행이 개발 모드인지 체크.
	 *
	 * @return boolean. If spring profile is development
	 */
	protected boolean isDevMode() {
		return getProfileActive().endsWith(DEV_STR);
	}

	/**
	 * Application 실행이 운영 모드인지 체크.
	 * 
	 * @return boolean. If spring profile is product
	 */
	protected boolean isProdMode() {
		return getProfileActive().endsWith(PROD_STR);
	}
	
}


