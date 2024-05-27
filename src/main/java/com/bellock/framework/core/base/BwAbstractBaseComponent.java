package com.bellock.framework.core.base;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.message.BwMessageResolver;
import com.bellock.framework.core.properties.BwPropertiesHandler;


/**
 * 콤포넌트(컨트롤러, 서비스) 클래스의 Abstracted Base 클래스.<p>
 * 
 * 프로퍼티, 다국어 메세지, 파라메터 검사 등 컨트롤러와 서비스에서 사용할<P>
 * 기본적인 메서드를 제공해 준다.
 * <p>
 * 그리고 실행 모드(debug 모드, perf 모드)가 어떤 모드인지 체크하는 메서드를 제공.
 * 
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.05, 나인석, 클래스 변경. BwAbstractProfile 생성 후 상속.
 * 						   스프링 프로파일 관련 메서드 세분화.
 */

 public abstract class BwAbstractBaseComponent extends BwAbstractBase {

	/**
	 * 프로퍼티 처리 객체.
	 * @see #getProperty(String, String)
	 */
	@Autowired
	private BwPropertiesHandler config;

	/**
	 * 다국어 메세지 핸들러 객체.
	 * @see #getMessage(String)
	 * @see #getMessage(String, Object[])
	 */
	@Autowired
	private BwMessageResolver messageResolver;

	/**
	 * 프로퍼티 처리 객체 반환
	 * 
	 * @return BwPropertiesHandler 객체
	 */
	public BwPropertiesHandler getConfig() {
		return config;
	}

	/**
	 * 다국어 메세지 핸들러 객체 반환
	 * 
	 * @return BwMessageResolver 객체
	 */
	public BwMessageResolver getMessageResolver() {
		return messageResolver;
	}


	/**
	 * 파라미터를 검사한다.<p>
	 * 파라메터에 오류가 발생되면 상세 메세지와 함께 {@code REQUIRED_EXCEPTION} 예외를 던진다.
	 *
	 * @param map 검사할 해시 맵
	 * @throws BwException
	 */
	public void validateParameters(BwObjectMap map) {
		try {
			String message = this.getRequiredExceptionMsg(map);
			if (message != null) {
				throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION, message);
			}
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION, e);
		}
	}
	
	/**
	 * Component에서 사용하는 파라메터 오류를 검사.<p>
	 * 만약 파라메터의 값이 {@code null}이거나 공백인 경우 예외 메세지를 생성 후 반환.
	 *
	 * @param map 파라메터 해시 맵
	 * @return 오류가 없는 경우 {@code null}, 그렇지 않으면 상세 오류 메세지를 반환
	 */
	private String getRequiredExceptionMsg(BwObjectMap map) throws Exception {
		String message = null;
		List<String> errorField = new ArrayList<String>();

		Set<String> keySet = map.keySet();
		for (String key : keySet) {
			Object obj = map.get(key);

			if (obj == null || (obj instanceof String && StringUtils.isEmpty(obj.toString()))) {
				errorField.add(key);
			}
		}

		if (errorField.size() > 0) {
			message = "Required Error Field : " + StringUtils.join(errorField, ", ");
		}

		return message;
	}
	
	/**
	 * 프로퍼티 파일에서 값을 가져오기.<p>
	 * 해당하는 키 값이 없을 경우 공백 값이 반환. 
	 * 내부적으로 {@link #getProperty(String, String)} 메서드를 호출.
	 *
	 * @param key 프러퍼티의 키
	 * @return 프로퍼티에 저장된 값
	 */
	public String getProperty(String key) {
		return getProperty(key, "");
	}

	/**
	 * 프로퍼티 파일에서 값을 가져오기.<p>
	 * 해당하는 키 값이 없을 경우 사용자가 설정한 기본 값이 반환.
	 * <p>
	 * 만약 예외가 발생된 경우, 로그를 출력하고 공백을 반환한다.
	 *
	 * @param key 프러퍼티의 키
	 * @param def 기본 값
	 * @return 프로퍼티에 저장된 값
	 */
	public String getProperty(String key, String def) {
		try {
			return config.getString(key, def);
		} catch (Exception e) {
			logger.error("{}", e.getMessage(), e);
			return "";
		}
	}
	
	/**
	 * 키와 일치하는 다국어 메세지를 반환.<p>
	 * 해당 키가 없는 경우 공백을 반환한다.
	 * 
	 * @param key 다국어 프로퍼티 키
	 * @return 다국어 메세지 스트링
	 * @see BwMessageResolver#getMessage(String)
	 */
	public String getMessage(String key) {
		return messageResolver.getMessage(key);
	}

	/**
	 * 키와 일치하는 다국어 메세지를 반환.<p>
	 * 동적 데이터와 바인딩되어 다국어 메세지를 반환한다. 
	 * 해당 키가 없는 경우 공백을 반환한다.
	 * 
	 * @param key 다국어 프로퍼티 키
	 * @param args 동적으로 바인딩되는 배열 객체
	 * @return 다국어 메세지 스트링
	 * @see BwMessageResolver#getMessage(String, Object[])
	 */
	public String getMessage(String key, @Nullable Object[] args) {
		return messageResolver.getMessage(key, args);
	}

}


