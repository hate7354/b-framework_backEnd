package com.bellock.framework.core.http.impl;

import java.net.CookieStore;

import org.slf4j.Logger;
import org.springframework.lang.Nullable;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.base.BwAbstractBase;
import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.http.BwHttpClientWrapper;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.map.BwStringMap;
import com.thoughtworks.xstream.XStream;

import static com.bellock.framework.core.constant.BwConstants.HttpConnect.PropKey.Placeholder.*;


/**
 * 외부 서버와의 통신을 위해 HTTP 클라이언트 기능을 구현한 클래스.
 * 
 * @history: 2024.03, 나인석, 최초작성
 * 			 2024.04, 나인석, 최적화
 */
public class BwHttpClientWrapperImpl extends BwAbstractBase implements BwHttpClientWrapper {
	/**
	 * 콘텐츠 타입. default:text/html
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 */
	@BwSetField(CONTENT_TYPE_DEF)
	String contentType;
	/**
	 * character set. default:UTF-8
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 */
	@BwSetField(CHARACTER_SET_DEF)
	String charSet;
	/**
	 * request timeout. default:30초
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 */
	@BwSetField(REQUEST_TIMEOUT_DEF)
	int timeout;
	/**
	 * debug mode flag
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 */
	@BwSetField(DEBUG_DEF)
	boolean debug;
	/**
	 * HttpClient가 동시에 생성할 수 있는 커넥션 최대수.<p>
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 * @see #createConnectionManager()
	 */
	@BwSetField(MAX_TOTAL_DEF)
	public int maxTotal;
	/**
	 * 동일한 호스트(라우트)에 허용되는 최대 연결수.<p>
	 * execute함수에서 사용되기 때문에 반드시 정의되어야 함.
	 * @see #createConnectionManager()
	 */
	@BwSetField(MAX_PER_ROUTER_DEF)
	public int maxPerRoute;


	/**
	 * 콘텐츠 타입 반환
	 * @return 콘텐츠 타입 스트링
	 */
	public String getContentType() {
		return contentType;
	}

	/**
	 * character set 반환
	 * @return character set 스트링
	 */
	public String getCharSet() {
		return charSet;
	}

	/**
	 * request timeout 반환
	 * @return request timeout 반환(ms)
	 */
	public int getTimeout() {
		return timeout;
	}

	/**
	 * debug mode flag 반환
	 * @return boolean
	 */
	public boolean isDebug() {
		return debug;
	}

	/**
	 * 동시에 생성할 수 있는 커넥션 최대수 반환
	 * @return 커넥션 수 반환(int)
	 */
	public int getMaxTotal() {
		return maxTotal;
	}

	/**
	 * 동일한 호스트(라우트)에 허용되는 최대 연결수 반환
	 * @return 최대 연결수(int)
	 */
	public int getMaxPerRoute() {
		return maxPerRoute;
	}

	/**
	 * 콘텐츠 타입 설정
	 * @param contentType 콘텐츠 타입
	 */
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	/**
	 * character set 설정
	 * @param charSet character set
	 */
	public void setCharSet(String charSet) {
		this.charSet = charSet;
	}

	/**
	 * request timeout 설정
	 * @param timeout request timeout
	 */
	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	/**
	 * debug mode flag 설정
	 * @param debug debug mode flag
	 */
	public void setDebug(boolean debug) {
		this.debug = debug;
	}

	/**
	 * 동시에 생성할 수 있는 커넥션 최대수 설정
	 * @param maxTotal 커넥션 최대수
	 */
	public void setMaxTotal(int maxTotal) {
		this.maxTotal = maxTotal;
	}

	/**
	 * 동일한 호스트(라우트)에 허용되는 최대 연결수 설정
	 * @param maxPerRoute 최대 연결수
	 */
	public void setMaxPerRoute(int maxPerRoute) {
		this.maxPerRoute = maxPerRoute;
	}
	
	/**
	 * 로깅 인스턴스 반환
	 */
	@Override
	public Logger getLogger() {
		return logger;
	}

	/**
	 * HTTP 요청(GET)을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return ObjectMap이 타입 캐스팅된 Object 개체
	 * @throws Exception
	 */
	@Override
	public Object execGetJSON(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsJSON(
						HTTP_METHOD.GET, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(POST)을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return ObjectMap이 타입 캐스팅된 Object 개체
	 * @throws Exception
	 */
	@Override
	public Object execPostJSON(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsJSON(
						HTTP_METHOD.POST, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(PUT)을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return ObjectMap이 타입 캐스팅된 Object 개체
	 * @throws Exception
	 */
	@Override
	public Object execPutJSON(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsJSON(
						HTTP_METHOD.PUT, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(DELETE)을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return ObjectMap이 타입 캐스팅된 Object 개체
	 * @throws Exception
	 */
	@Override
	public Object execDeleteJSON(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsJSON(
						HTTP_METHOD.DELETE, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 통신방식(GET, POST, PUT, DELETE)을 설정해야하며, 내부적으로 execute 
	 * 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 
	 * @param method HTTP 메서드(GET, POST, PUT, DELETE 등)
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param pathMap URL에 동적 경로 매개변수를 적용하기 위한 맵
	 * @param headerMap 요청 헤더를 나타내는 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @param cookies 요청에 사용할 쿠키를 포함하는 CookieStore 객체
	 * @return ObjectMap 객체
	 * @throws Exception
	 */
	@Override
	public BwObjectMap executeAsJSON(
				HTTP_METHOD method, 
				String url, 
				@Nullable BwStringMap paramMap,
				@Nullable BwStringMap pathMap, 
				@Nullable BwStringMap headerMap, 
				@Nullable BwObjectMap entities, 
				@Nullable CookieStore cookies
			) throws Exception {
		try {
			return (BwObjectMap) execute(
						true, 
						HANDLER_TYPE.MAP, 
						method, 
						url, 
						paramMap, 
						pathMap, 
						headerMap, 
						entities, 
						cookies
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(GET)을 보내고, 해당 요청의 응답을 XML 형식으로 받아서 지정된 클래스 형식의 객체로 변환하는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param clazz XML 응답을 변환할 클래스
	 * @param key XML에서 변환할 객체의 루트 요소의 이름을 나타내는 문자열
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	@Override
	public <T> T execGet(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception {
		try {
			return executeAsObject(
						HTTP_METHOD.GET, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null, 
						clazz, 
						key
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(POST)을 보내고, 해당 요청의 응답을 XML 형식으로 받아서 지정된 클래스 형식의 객체로 변환하는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param clazz XML 응답을 변환할 클래스
	 * @param key XML에서 변환할 객체의 루트 요소의 이름을 나타내는 문자열
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	@Override
	public <T> T execPost(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception {
		try {
			return executeAsObject(
						HTTP_METHOD.POST, 
						url, paramMap, 
						null, 
						null, 
						null, 
						null, 
						clazz, 
						key
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(PUT)을 보내고, 해당 요청의 응답을 XML 형식으로 받아서 지정된 클래스 형식의 객체로 변환하는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param clazz XML 응답을 변환할 클래스
	 * @param key XML에서 변환할 객체의 루트 요소의 이름을 나타내는 문자열
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	@Override
	public <T> T execPut(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception {
		try {
			return executeAsObject(
						HTTP_METHOD.PUT, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null, 
						clazz, 
						key
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(DELETE)을 보내고, 해당 요청의 응답을 XML 형식으로 받아서 지정된 클래스 형식의 객체로 변환하는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param clazz XML 응답을 변환할 클래스
	 * @param key XML에서 변환할 객체의 루트 요소의 이름을 나타내는 문자열
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	@Override
	public <T> T execDelete(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception {
		try {
			return executeAsObject(
						HTTP_METHOD.DELETE, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null, 
						clazz, 
						key
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청을 보내고, 해당 요청의 응답을 XML 형식으로 받아서 
	 * 지정된 클래스 형식의 객체로 변환하는 메서드.
	 * 서버측과 사전 협의하에 특정 클래스 객체를 XML로 직렬화하고 통신을 통해 받은 데이터를
	 * XStream 객체를 통해 정해진 클래스 객체로 역직렬화 한 후 반환한다
	 * 
	 * @param method  HTTP 메서드(GET, POST, PUT, DELETE 등)
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 매개변수를 나타내는 맵
	 * @param pathMap URL에 동적 경로 매개변수를 적용하기 위한 맵
	 * @param headerMap 요청 헤더를 나타내는 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @param cookies 요청에 사용할 쿠키를 포함하는 CookieStore 객체
	 * @param clazz XML 데이터를 역직렬화하기 위한 클래스
	 * @param key 역직렬화 클래스와 매핑할 매핑명
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> T executeAsObject(
				HTTP_METHOD method, 
				String url, 
				@Nullable BwStringMap paramMap,
				@Nullable BwStringMap pathMap, 
				@Nullable BwStringMap headerMap, 
				@Nullable BwObjectMap entities,
				@Nullable CookieStore cookies, 
				Class<T> clazz, 
				String key
			) throws Exception {
		try {
			String responseBody = (String) execute(
						false, 
						HANDLER_TYPE.STRING, 
						method, 
						url, 
						paramMap, 
						pathMap, 
						headerMap, 
						entities, 
						cookies
					);

			if (key == null || "".equals(key)) {
				key = "base";
			}

			// HTTP 통신을 통해 XML로 직렬화된 데이터를 받아 다시 해당 객체로 역직렬화 한다
			XStream xStream = new XStream();
			xStream.alias(key, clazz);
			xStream.processAnnotations(clazz);

			return (T) xStream.fromXML(responseBody);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(GET)을 보내고 결과를 스트링으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return 스트링 객체
	 * @throws Exception
	 */
	@Override
	public String execGetString(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsString(
						HTTP_METHOD.GET, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(POST)을 보내고 결과를 스트링으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return 스트링 객체
	 * @throws Exception
	 */
	@Override
	public String execPostString(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsString(
						HTTP_METHOD.POST, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(PUT)을 보내고 결과를 스트링으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return 스트링 객체
	 * @throws Exception
	 */
	@Override
	public String execPutString(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsString(
						HTTP_METHOD.PUT, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청(DELETE)을 보내고 결과를 스트링으로 받는 메서드
	 * 
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @return 스트링 객체
	 * @throws Exception
	 */
	@Override
	public String execDeleteString(String url, @Nullable BwStringMap paramMap) throws Exception {
		try {
			return executeAsString(
						HTTP_METHOD.DELETE, 
						url, 
						paramMap, 
						null, 
						null, 
						null, 
						null
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청을 보내고 결과를 스트링으로 받는 메서드.
	 * 요청 방식(GET, POST, PUT, DELETE)을 설정해야하며, 내부적으로 execute 
	 * 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 
	 * @param method  HTTP 메서드(GET, POST, PUT, DELETE 등)
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 매개변수를 나타내는 맵
	 * @param pathMap URL에 동적 경로 매개변수를 적용하기 위한 맵
	 * @param headerMap 요청 헤더를 나타내는 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @param cookies 요청에 사용할 쿠키를 포함하는 CookieStore 객체
	 * @return 스트링 객체
	 * @throws Exception
	 */
	@Override
	public String executeAsString(
				HTTP_METHOD method,
				String url,
				@Nullable BwStringMap paramMap,
				@Nullable BwStringMap pathMap,
				@Nullable BwStringMap headerMap,
				@Nullable BwObjectMap entities,
				@Nullable CookieStore cookies
			) throws Exception {
		try {
			return (String) execute(
						false, 
						HANDLER_TYPE.STRING, 
						method, 
						url, 
						paramMap, 
						pathMap, 
						headerMap, 
						entities, 
						cookies
					);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

}


