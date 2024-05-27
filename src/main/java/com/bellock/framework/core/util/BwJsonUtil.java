package com.bellock.framework.core.util;

import java.net.URI;
import java.util.Map;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.TokenBuffer;
import com.fasterxml.jackson.annotation.JsonInclude;


/**
 * JSON 데이터의 마샬링 및 언마샬링을 수행하는 유틸리티 메서드를 제공.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwJsonUtil {

	/**
	 * 주어진 객체를 JSON 형식의 문자열로 마샬링. 
	 * ull 값은 제외하고 직렬화.
	 * @param object JSON으로 마샬링할 객체
	 * @return 마샬링된 JSON 형식의 문자열
	 */
	public static String marshallingJson(Object object) {
	    try {
	        TokenBuffer buffer = new TokenBuffer(null);
	        ObjectMapper objectMapper = new ObjectMapper();
	        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	        objectMapper.writeValue(buffer, object);
	        JsonNode root = objectMapper.readTree(buffer.asParser());
	        String jsonText = objectMapper.writeValueAsString(root);
	        jsonText = jsonText.replaceAll("null", "\"\"");
	        return jsonText;
	    } catch (Exception e) {
	        throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
	    }
	}

	/**
	 * 주어진 JSON 형식의 문자열을 주어진 클래스 형식으로 언마샬링.
	 *
	 * @param jsonText 언마샬링할 JSON 형식의 문자열
	 * @param valueType 언마샬링할 데이터 타입의 클래스
	 * @return 언마샬링된 객체
	 */
	public static <T> T unmarshallingJson(String jsonText, Class<T> valueType) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String data = jsonText.replaceAll("null", "\"\"");
			return (T) objectMapper.readValue(data, valueType);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * RESTful API의 엔드포인트 URL을 생성. 
	 * 주어진 URL 템플릿과 파라미터를 기반으로 URL을 확장하고 반환.
	 * @param invokeURL URL 템플릿으로 사용할 문자열
	 * @param parameter URL 템플릿에 삽입될 파라미터를 담고 있는 맵
	 * @return 확장된 RESTful URL
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static String makeRestFulURL(String invokeURL, Map parameter) {
		try {
			String restURL = "";
			BwUriTemplateBuilder uriTemplate = new BwUriTemplateBuilder(invokeURL);
			URI url = uriTemplate.expand(parameter);
			restURL = url.toString();
			return restURL;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}
	
}


