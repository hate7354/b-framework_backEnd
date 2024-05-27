package com.bellock.framework.core.util;

import java.util.Enumeration;
import java.util.HashMap;

import com.bellock.framework.core.constant.BwConstants.MapKey.Attribute;
import com.bellock.framework.core.constant.BwConstants.MapKey.Parameter;
import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


/**
 * HTTP 요청에서 파라미터를 추출하는 유틸리티 메서드를 제공.
 * 
 * @since 2024/03, 나인석, 최초작성
 */
public class BwParamUtil {
	
	/**
	 * 클라이언트가 application/x-www-form-urlencoded 또는 multipart/form-data 
	 * 형식으로 <p>보낸 요청의 파라미터를 추출하여 해시맵으로 반환. 
	 * <p>또한, 세션에서 기본적인 사용자 정보를 가져와 파라미터에 추가
	 * 
	 * @param request 파라미터를 추출할 HTTP 요청 객체
	 * @return 추출된 파라미터를 담고 있는 해시맵 객체
	 */
	public HashMap<String, Object> getParamMap(HttpServletRequest request) {
		try {
			Enumeration<?> parameterNames = request.getParameterNames();
			HashMap<String, Object> paramMap = new HashMap<String, Object>();

			while (parameterNames.hasMoreElements()) {
				String key = parameterNames.nextElement().toString();
				String[] values = request.getParameterValues(key);
				String value = "";

				if (values.length > 0) {
					value = values[0];
				}

				for (int i = 1; i < values.length; i ++) {
					value += "," + values[i];
				}
				paramMap.put(key, BwXSSUtil.sanitize(BwXSSUtil.unescapeHTML(value)));
			}
			
			// 파라메터에 디폴트로 관리할 것들을 담는다.
			HttpSession session = request.getSession();

			if (!Parameter.USER_ID.trim().isEmpty() && !Attribute.USER_ID.trim().isEmpty()) {
				paramMap.put(Parameter.USER_ID, session.getAttribute(Attribute.USER_ID));
			}
			if (!Parameter.USER_NM.trim().isEmpty() && !Attribute.USER_NM.trim().isEmpty()) {
				paramMap.put(Parameter.USER_NM, session.getAttribute(Attribute.USER_NM));
			}
			if (!Parameter.DPT_ID.trim().isEmpty() && !Attribute.DPT_ID.trim().isEmpty()) {
				paramMap.put(Parameter.DPT_ID, session.getAttribute(Attribute.DPT_ID));
			}
			if (!Parameter.DPT_NM.trim().isEmpty() && !Attribute.DPT_NM.trim().isEmpty()) {
				paramMap.put(Parameter.DPT_NM, session.getAttribute(Attribute.DPT_NM));
			}
			if (!Parameter.EMPL_ID.trim().isEmpty() && !Attribute.EMPL_ID.trim().isEmpty()) {
				paramMap.put(Parameter.EMPL_ID, session.getAttribute(Attribute.EMPL_ID));
			}
			if (!Parameter.AUTH_ID.trim().isEmpty() && !Attribute.AUTH_ID.trim().isEmpty()) {
				paramMap.put(Parameter.AUTH_ID, session.getAttribute(Attribute.AUTH_ID));
			}
			if (!Parameter.AUTH_CD.trim().isEmpty() && !Attribute.AUTH_CD.trim().isEmpty()) {
				paramMap.put(Parameter.AUTH_CD, session.getAttribute(Attribute.AUTH_CD));
			}
			if (!Parameter.AUTH_NM.trim().isEmpty() && !Attribute.AUTH_NM.trim().isEmpty()) {
				paramMap.put(Parameter.AUTH_NM, session.getAttribute(Attribute.AUTH_NM));
			}
			if (!Parameter.REGIST_ID.trim().isEmpty() && !Attribute.REGIST_ID.trim().isEmpty()) {
				paramMap.put(Parameter.REGIST_ID, session.getAttribute(Attribute.REGIST_ID));
			}
			if (!Parameter.UPDATE_ID.trim().isEmpty() && !Attribute.UPDATE_ID.trim().isEmpty()) {
				paramMap.put(Parameter.UPDATE_ID, session.getAttribute(Attribute.UPDATE_ID));
			}

			String accessIp = request.getHeader("X-Forwarded-For");
		    if (accessIp == null) accessIp = request.getRemoteAddr();
		    if (accessIp == null) accessIp = "";

			if (!Parameter.ACCESS_IP.trim().isEmpty()) {
				paramMap.put(Parameter.UPDATE_ID, accessIp);
			}
			if (!Parameter.REQUEST_URL.trim().isEmpty()) {
				paramMap.put(Parameter.REQUEST_URL, request.getRequestURI());
			}
			return paramMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * 파라미터가 JSON 형식으로 올 경우와 기존의 HTTP 요청에서 파라미터를 추출하여 해시맵으로 반환. 
	 * <p>이 메서드는 이전 메서드를 확장하여 JSON 파라미터를 기존 파라미터와 병합하여 반환
	 * 
	 * @param request 파라미터를 추출할 HTTP 요청 객체
	 * @param jsonParams SON 형식의 파라미터를 담고 있는 해시맵 객체
	 * @return  추출된 파라미터를 담고 있는 해시맵 객체
	 */
	public HashMap<String, Object> getParamMap(HttpServletRequest request, HashMap<String, Object> jsonParams) {
		try {
			HashMap<String, Object> paramMap = getParamMap(request);
			
			if (jsonParams != null) {
				paramMap.putAll(jsonParams);

			}
			return paramMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

}


