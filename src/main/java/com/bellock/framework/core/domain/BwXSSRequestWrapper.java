package com.bellock.framework.core.domain;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;


/**
 * <h3>Anti XSS Request 클래스.</h3>
 * <p>
 * XSS(교차 사이트 스크립팅) 공격을 방어하기 위해 특정한 필터링을 적용하는 래퍼 클래스.
 * <p>입력 파라미터와 헤더 값을 필터링하여 XSS 공격을 방지한다.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public final class BwXSSRequestWrapper extends HttpServletRequestWrapper {

	/**
	 * 생성자.
	 * <p>HttpServletRequest 객체를 받아 super 생성자에게 넘긴다.
	 * @param request HttpServletRequest 객체
	 */
	public BwXSSRequestWrapper(HttpServletRequest request) {
		super(request);
	}

	/**
	 * 파라미터 이름에 해당하는 모든 값을 가져와 XSS 필터링을 적용.
	 * @param parameter a String containing the name of the parameter whose value is requested
	 * @return an array of String objects containing the parameter's values
	 */
	@Override
	public String[] getParameterValues(String parameter) {
		try {
			String[] values = super.getParameterValues(parameter);
			if (values == null || "".equals(values)) {
				return values;
			}

			int count = values.length;
			String[] encodedValues = new String[count];
			for (int i = 0; i < count; i++) {
				encodedValues[i] = cleanXSS(values[i]);
			}
			return encodedValues;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 특정 파라미터 이름에 대한 값을 가져와 XSS 필터링을 적용.
	 * @param parameter a String specifying the name of the parameter
	 * @return a String representing the single value of the parameter
	 */
	@Override
	public String getParameter(String parameter) {
		try {
			String value = super.getParameter(parameter);
			if (value == null || "".equals(value)) {
				return value;
			}
			return cleanXSS(value);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 특정 헤더 이름에 대한 값을 가져와 XSS 필터링을 적용.
	 * @param name a String specifying the header name
	 * @return a String containing the value of the requested header,
	 */
	@Override
	public String getHeader(String name) {
		try {
			String value = super.getHeader(name);
			if (value == null || "".equals(value))
				return null;
			return cleanXSS(value);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 입력 문자열에서 XSS 공격을 방지하기 위한 필터링을 수행.
	 * <pre>
	 * "<" -> "&lt;"
	 * ">" -> "&gt;"
	 * "(" -> "&#40;"
	 * ")" -> "&#41;"
	 * "'" -> "&#39;"
	 * eval( ... ) -> 제거
	 * javascript:로 시작하는 속성 값 -> 빈 문자열
	 * </pre>
	 * @param value 각종 문자열
	 * @return 변환 스트링
	 */
	protected String cleanXSS(String value) {
		try {
			value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
			value = value.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
			value = value.replaceAll("'", "&#39;");
			value = value.replaceAll("eval\\((.*)\\)", "");
			value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
			return value;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}


