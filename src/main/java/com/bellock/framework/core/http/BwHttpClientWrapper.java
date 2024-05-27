package com.bellock.framework.core.http;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.CookieStore;

import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.commons.lang3.time.StopWatch;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.springframework.lang.Nullable;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.map.BwStringMap;
import com.bellock.framework.core.util.BwJsonUtil;
import com.bellock.framework.core.util.BwUriTemplateBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import static com.bellock.framework.core.constant.BwConstants.HttpConnect.Const.*;
import static com.bellock.framework.core.constant.BwConstants.MimeType.Const.*;


/**
 * 외부 서버와의 통신을 위해 HTTP 클라이언트 기능을 추상화한 인터페이스
 * 구현 클래스를 지원하는 default 메서드를 포함하고 있다.
 * 
 * @history : 2024.03, 나인석, 최초작성
 * 			  2024.04, 나인석, 최적화
 */
@SuppressWarnings("deprecation")
public interface BwHttpClientWrapper {
	/**
	 * HTTP 통신 방식 정의.
	 */
	public static enum HTTP_METHOD {
		GET,
		POST,
		MULTIPART,
		PUT,
		DELETE,
		POST_TEXT,		// POST 방식, entity에 텍스트 적용 시
		POST_JSON,		// POST 방식, entity에 JSON 타입 어브젝트 적용 시
		POST_BINARY,	// POST 방식, entity에 바이너리 적용 시
		PUT_TEXT,		// PUT 방식, entity에 텍스트 적용 시
		PUT_JSON,		// PUT 방식, entity에 JSON 타입 어브젝트 적용 시
		POST_COOKIE,
		DOWNLOAD
	};
	/**
	 * HTTP response 처리 타입 정의.
	 */
	public static enum HANDLER_TYPE {
		EMPTY,
		STRING,
		MAP
	};

	/**
	 * HttpClient가 동시에 생성할 수 있는 커넥션 최대수 반환.
	 */
	public int getMaxTotal();

	/**
	 * 동일한 호스트(라우트)에 허용되는 최대 연결수 반환.
	 */
	public int getMaxPerRoute();


	/**
	 * 외부 서버와 통신 메서드
	 * 응답을 JSON 타입으로 받으며 GET, POST, PUT, DELETE 방식별 메서드 추상화.
	 * 내부적으로는 executeAsJSON를 통해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 해당 메서드를 사용할 경우 executeAsJSON 메서드의 pathMap, headerMap, entities,
	 * cookies 파라메터는 null로 설정된다.
	 * null로 설정되는 파라메터들의 세부설정을 통한 HTTP 통신이 필요한 경우 executeAsJSON
	 * 메서드를 이용해 외부서버와의 통신을 실행해야 한다.
	 *
	 * @param url 외부 접속 URL
	 * @param paramMap 파라메터
	 * @return ObjectMap이 타입 캐스팅된 Object 개체
	 * @throws Exception
	 */
	public Object execGetJSON(String url, @Nullable BwStringMap paramMap) throws Exception;
	public Object execPostJSON(String url, @Nullable BwStringMap paramMap) throws Exception;
	public Object execPutJSON(String url, @Nullable BwStringMap paramMap) throws Exception;
	public Object execDeleteJSON(String url, @Nullable BwStringMap paramMap) throws Exception;

	/**
	 * HTTP 요청을 보내고, 해당 요청의 응답을 JSON 형식으로 받는 메서드
	 * 내부적으로 execute 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 
	 * @param method 접속 방식 (HTTP_METHOD 타입)
	 * @param url 접속 URL
	 * @param paramMap 전송 파라메터
	 * @param pathMap URL 확장 맵
	 * @param headerMap 사죵자 정의 헤더정보 맵
	 * @param entities 바디에 담아 전송하게 될 데이터 맵
	 * @param cookies 사용할 쿠키 스토어
	 * @return ObjectMap 타입의 응답 결과
	 * @throws Exception
	 */
	public BwObjectMap executeAsJSON(
			HTTP_METHOD method, 
			String url, 
			@Nullable BwStringMap paramMap, 
			@Nullable BwStringMap pathMap, 
			@Nullable BwStringMap headerMap, 
			@Nullable BwObjectMap entities, 
			@Nullable CookieStore cookies
		) throws Exception;

	/**
	 * 외부 서버와 통신 메서드
	 * 응답을 전달한 객체 타입으로 받으며 GET, POST, PUT, DELETE 방식별 메서드 추상화.
	 * 내부적으로는 executeAsObject 통해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 해당 메서드를 사용할 경우 executeAsObject 메서드의 pathMap, headerMap, entities,
	 * cookies 파라메터는 null로 설정된다.
	 * null로 설정되는 파라메터들의 세부설정을 통한 HTTP 통신이 필요한 경우 executeAsObject
	 * 메서드를 이용해 외부서버와의 통신을 실행해야 한다.
	 *
	 * @param url 외부 접속 URL
	 * @param paramMap 파라메터
	 * @param clazz XML 데이터를 역직렬화하기 위한 클래스
	 * @param key 역직렬화 클래스와 매핑할 매핑명
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
	public <T> T execGet(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception;
	public <T> T execPost(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception;
	public <T> T execPut(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception;
	public <T> T execDelete(String url, @Nullable BwStringMap paramMap, Class<T> clazz, String key) throws Exception;

	/**
	 * HTTP 요청을 보내고, 해당 요청의 응답을 지정한 클래스 객체로 받는 메서드
	 * 내부적으로 execute 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 *
	 * @param method 접속 방식 (HTTP_METHOD 타입)
	 * @param url 접속 URL
	 * @param paramMap 전송 파라메터
	 * @param pathMap URL 확장 맵
	 * @param headerMap사죵자 정의 헤더정보 맵
	 * @param entities 바디에 담아 전송하게 될 데이터 맵
	 * @param cookies 사용할 쿠키 스토어
	 * @return 지정한 클래스 객체
	 * @throws Exception
	 */
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
		) throws Exception;

	/**
	 * 외부 서버와 통신 메서드
	 * 응답을 전달한 객체 타입으로 받으며 GET, POST, PUT, DELETE 방식별 메서드 추상화.
	 * 내부적으로 execute 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 해당 메서드들을 사용할 경우 execute 메서드의 pathMap, headerMap, entities,
	 * cookies 파라메터는 null로 설정된다.
	 * 
	 * @param url 접속 URL
	 * @param paramMap 전송 파라메터
	 * @return 스트링 객체
	 * @throws Exception
	 */
	public String execGetString(String url, @Nullable BwStringMap paramMap) throws Exception;
	public String execPostString(String url, @Nullable BwStringMap paramMap) throws Exception;
	public String execPutString(String url, @Nullable BwStringMap paramMap) throws Exception;
	public String execDeleteString(String url, @Nullable BwStringMap paramMap) throws Exception;

	/**
	 * HTTP 요청을 보내고 결과를 스트링으로 받는 메서드.
	 * 요청 방식(GET, POST, PUT, DELETE)을 설정해야하며, 내부적으로 execute 
	 * 메서드를 호출해 HTTP 통신 및 요청에 대한 결과 값을 받는다.
	 * 
	 * @param method  HTTP 메서드(GET, POST, PUT, DELETE 등)
	 * @param url 요청할 URL
	 * @param parameters 쿼리 문자열 매개변수를 나타내는 맵
	 * @param path URL에 동적 경로 매개변수를 적용하기 위한 맵
	 * @param headerMap 요청 헤더를 나타내는 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @param cookies 요청에 사용할 쿠키를 포함하는 CookieStore 객체
	 * @return 스트링 객체
	 * @throws Exception
	 */
	public String executeAsString(
			HTTP_METHOD method,
			String url,
			@Nullable BwStringMap paramMap, 
			@Nullable BwStringMap pathMap, 
			@Nullable BwStringMap headerMap, 
			@Nullable BwObjectMap entities, 
			@Nullable CookieStore cookies
		)  throws Exception;

	/**
	 * 콘텐츠 타입 Getter
	 * default content type is "text/html"
	 * 
	 * @return 콘텐츠 타입 스트링
	 */
	public String getContentType();

	/**
	 * 콘텐츠 타입 Setter
	 * 
	 * @param contentType 콘텐츠 타입 스트링
	 */
	public void setContentType(String contentType);

	/**
	 * character set Getter
	 * default CharacterSet is "UTF-8"
	 * 
	 * @return character set
	 */
	public String getCharSet();

	/**
	 * character set Setter
	 * 
	 * @param charSet CharacterSet 스트링
	 */
	public void setCharSet(String charSet);

	/**
	 * request timeout Getter
	 * default timeout is 30s
	 * 
	 * @return timeout second
	 */
	public int getTimeout();

	/**
	 * request timeout Setter
	 * 
	 * @param timeout timeout second
	 */
	public void setTimeout(int timeout);

	/**
	 * debug mode Getter
	 * 
	 * @return debug mode flag(true or false)
	 */
	public boolean isDebug();

	/**
	 * debug mode Setter
	 * 
	 * @param debug true or false
	 */
	public void setDebug(boolean debug);

	/**
	 * logger Getter
	 * 
	 * @return Logger 객체
	 */
	public Logger getLogger();

	
	/**
	 * Apache HttpClient 라이브러리를 사용해 HTTP 클라이언트를 생성하고,
	 * 연결 관리를 설정한다. 이전 버전은 SingleClientConnManager를 사용했으나 
	 * 현재 권장되는 PoolingHttpClientConnectionManager로 변경했음.
	 */
	default	 HttpClientConnectionManager createConnectionManager() {
		try {
			SSLContext sslcontext = SSLContext.getInstance("TLS");
			TrustManager trustManager = new X509TrustManager() {
				public X509Certificate[] getAcceptedIssuers() { return null; }
				public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
				public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {}
			};
			sslcontext.init(null, new TrustManager[] { trustManager }, null);

			SSLConnectionSocketFactory scsf = new SSLConnectionSocketFactory(
					sslcontext,
					SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER
				);

			Registry<ConnectionSocketFactory> registry = 
					RegistryBuilder.<ConnectionSocketFactory>create()
						.register("http", PlainConnectionSocketFactory.getSocketFactory())
						.register("https", scsf)
						.build();

			PoolingHttpClientConnectionManager cm = 
					new PoolingHttpClientConnectionManager(registry);

			cm.setMaxTotal(getMaxTotal()); // 동시에 생성할 수 있는 커넥션 최대 수
			cm.setDefaultMaxPerRoute(getMaxPerRoute()); // 호스트(라우트)에 허용되는 최대 연결 수
			return cm;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * URL에 확장 파라메터(중괄호{})로 된 파라메터가 있는 경우
	 * 파라메터 맵을 통해 확장 URL를 만든 후 URL 스트링을 반환한다
	 * 
	 * @param url URL 스트링
	 * @param pathMap URL 확장을 하기 위한 Map 파라메터
	 * @return 확장 URL
	 */
	default String makeRestFulURL(String url, BwStringMap pathMap) {
		try {
			if (pathMap != null && pathMap.size() > 0) {
				BwUriTemplateBuilder builder = new BwUriTemplateBuilder(url);
				url = builder.expand(pathMap).toString();
			}
			return url;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * 외부서버와의 통신을 위해 HttpUriRequest 객체를 생성한다 
	 * 각종 방식(GET,POST,PUT,DELETE ...)별 파라메터 등을 설정한 후 request 객체 생성 후 반환한다
	 * 
	 * 텍스트나 파일 데이터 등 Body에 담을 Content 데이터가 entities 객체에 설정된 경우에 대한 처리.
	 * MULTIPART, POST_TEXT, POST_JSON, PUT_TEXT, PUT_JSON, POST_BINARY 가 이 부분에 해당한다.
	 *
	 * @param method HTTP 메서드(GET, POST, PUT, DELETE ... 등)
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 매개변수 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @return the http uri request
	 * @throws Exception
	 */
	default HttpUriRequest makeRequest(
			HTTP_METHOD method, String url, @Nullable BwStringMap paramMap, @Nullable BwObjectMap entities) throws Exception {
		try {
			HttpUriRequest request = null;

			if (HTTP_METHOD.GET == method) {
				String getUrl = makeGetQuery(paramMap, url);
				request = new HttpGet(getUrl);
			} else if (HTTP_METHOD.POST == method) {
				List<NameValuePair> nameValuePairs = makePostQuery(paramMap);
				UrlEncodedFormEntity entity = new UrlEncodedFormEntity(nameValuePairs, getCharSet());
				request = new HttpPost(url);
				((HttpPost) request).setEntity(entity); // Body에 파라메터를 담는다
			} else if (HTTP_METHOD.PUT == method) {
				List<NameValuePair> nameValuePairs = makePostQuery(paramMap);
				UrlEncodedFormEntity entity = new UrlEncodedFormEntity(nameValuePairs, getCharSet());
				request = new HttpPut(url);
				((HttpPut) request).setEntity(entity);
			} else if (HTTP_METHOD.DELETE == method) {
				String getUrl = makeGetQuery(paramMap, url);
				request = new HttpDelete(getUrl);
			} else if (HTTP_METHOD.MULTIPART == method) {
				if (entities == null) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				request = new HttpPost(url);
				MultipartEntity entity = makeMultipart(paramMap, entities);
				((HttpPost) request).setEntity(entity);
			} else if (HTTP_METHOD.POST_TEXT == method) {
				if (entities == null || !entities.containsKey(ENTITY_TEXT_STR)) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				String body = (String) entities.get(ENTITY_TEXT_STR);
				StringEntity entity = new StringEntity(body, getContentType(), getCharSet());
				request = new HttpPost(url);
				((HttpPost) request).setEntity(entity);
			} else if (HTTP_METHOD.POST_JSON == method) {
				if (entities == null || !entities.containsKey(ENTITY_JSON_STR)) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				Object json = entities.get(ENTITY_JSON_STR);
				StringEntity entity = new StringEntity(BwJsonUtil.marshallingJson(json), JSON_STR, getCharSet());
				request = new HttpPost(url);
				((HttpPost) request).setEntity(entity);
			} else if (HTTP_METHOD.PUT_TEXT == method) {
				if (entities == null || !entities.containsKey(ENTITY_TEXT_STR)) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				String body = (String) entities.get(ENTITY_TEXT_STR);
				StringEntity entity = new StringEntity(body, getContentType(), getCharSet());
				request = new HttpPut(url);
				((HttpPut) request).setEntity(entity);
			} else if (HTTP_METHOD.PUT_JSON == method) {
				if (entities == null || !entities.containsKey(ENTITY_JSON_STR)) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				Object json = entities.get(ENTITY_JSON_STR);
				StringEntity entity = new StringEntity(BwJsonUtil.marshallingJson(json), JSON_STR, getCharSet());
				request = new HttpPut(url);
				((HttpPut) request).setEntity(entity);
			} else if (HTTP_METHOD.DOWNLOAD == method) {
				String getUrl = makeGetQuery(paramMap, url);
				request = new HttpGet(getUrl);
			} else if (HTTP_METHOD.POST_BINARY == method) {
				if (entities == null || !entities.containsKey(ENTITY_INPUT_STREAM_STR)) {
					throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION);
				}
				InputStream input = (InputStream) entities.get(ENTITY_INPUT_STREAM_STR);
				InputStreamEntity entity = new InputStreamEntity(input, -1);
				entity.setContentType(OCTET_STREAM_STR);
				entity.setChunked(true);
				request = new HttpPost(url);
				((HttpPost) request).setEntity(entity);
				setTimeout(getTimeout() * 1800);
			}

			return request;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}
	
	/**
	 * GET방식에서 파라메터를 받아 URL을 완성한 후 반환한다
	 *
	 * @param paramMap the param map
	 * @param url the url
	 * @return the URL string
	 */
	default String makeGetQuery(@Nullable BwStringMap paramMap, String url) {
		try {
			if (paramMap == null) {
				return url;
			}

			Iterator<Entry<String, String>> iter = paramMap.entrySet().iterator();
			StringBuilder query = new StringBuilder();
			for (; iter.hasNext();) {
				Entry<String, String> entry = iter.next();
				query.append("&" + entry.getKey() + "=" + (String) entry.getValue());
			}
			if (url.indexOf('?') > 0) {
				if (url.endsWith("&") || url.endsWith("&amp;")) {
					url = url + query.toString().substring(1);
				} else {
					url = url + query.toString();
				}
			} else {
				if (query.length() > 1)
					url = url + "?" + query.toString().substring(1);
			}
			return url;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION, e);
		}
	}
	
	/**
	 * POST방식에서 Map으로 넘어온 파라메터를 키-값 쌍의 객체 리스트로 반환
	 *
	 * @param paramMap the param map
	 * @return NameValuePair 객체 리스트
	 */
	default List<NameValuePair> makePostQuery(@Nullable BwStringMap paramMap) {
		try {
			List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
			if (paramMap != null) {
				Iterator<Entry<String, String>> iter = paramMap.entrySet().iterator();
				for (; iter.hasNext();) {
					Entry<String, String> entry = iter.next();
					if (entry.getValue() instanceof String) {
						nameValuePairs.add(new BasicNameValuePair(entry.getKey(), (String) entry.getValue()));
					}
				}
			}
			return nameValuePairs;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION, e);
		}
	}
	
	/**
	 * 멀티파트 요청을 생성.
	 * 한번의 HTTP 요청으로 여러 종류의 데이터 전송에 사용된다
	 * 주로 파일 업로드 및 폼 전송시에 사용된다.
	 *
	 * @param paramMap 쿼리 문자열 또는 매개변수 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @return the multipart entity
	 * @throws UnsupportedEncodingException the unsupported encoding exception
	 */
	default MultipartEntity makeMultipart(BwStringMap paramMap, BwObjectMap entities) throws UnsupportedEncodingException {
		try {
			MultipartEntity entity = new MultipartEntity();
			Iterator<Entry<String, String>> iterParam = paramMap.entrySet().iterator();
			for (; iterParam.hasNext();) {
				Entry<String, String> entry = iterParam.next();
				Object v = entry.getValue();
				if (v instanceof String) {
					entity.addPart(entry.getKey(), new StringBody((String) v));
				}
			}
			Iterator<Entry<String, Object>> iterEntity = entities.entrySet().iterator();
			for (; iterEntity.hasNext();) {
				Entry<String, Object> entry = iterEntity.next();
				Object v = entry.getValue();
				if (v instanceof String) {
					entity.addPart(entry.getKey(), new StringBody((String) v));
				} else if (v instanceof File) {
					entity.addPart(entry.getKey(), new FileBody((File) v));
				}
			}
			return entity;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.PARAMETER_EXCEPTION, e);
		}
	}
	
	/**
	 * HTTP 요청 및 응답 컨텍스트 정보를 관리하기 위한 객체를 생성 및 반환
	 * 사용자 정의 헤더 정보를 추가하고, 쿠키저장소를 설정한다
	 *
	 * @param request the request
	 * @param cookies the cookies
	 * @param headerMap the header map
	 * @return the http context 객체
	 */
	default HttpContext makeContext(HttpRequest request, @Nullable CookieStore cookies, @Nullable BwStringMap headerMap) {
		try {
			if (headerMap != null && headerMap.size() >= 0) {
				Iterator<Map.Entry<String, String>> it = headerMap.entrySet().iterator();
				while (it.hasNext()) {
					Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
					request.addHeader(pairs.getKey(), pairs.getValue());
				}
			}

			HttpContext context = new BasicHttpContext();
			if (cookies != null && cookies.getCookies().size() > 0) {
				context.setAttribute(ClientContext.COOKIE_STORE, cookies);
			}
			return context;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP 요청을 보내는 메서드.
	 * 주어진 매개변수를 사용하여 요청할 URL을 만들고, HTTP 요청 객체를 생성
	 * 연결 관리자를 생성하고, 이를 사용하여 CloseableHttpClient를 생성
	 * 만약 핸들러가 지정되어 있다면, 해당 핸들러를 사용하여 요청을 실행, 그렇지 않으면 일반적인 방식으로 요청을 실행
	 * 요청 결과를 반환
	 * 
	 * @param flag 핸들러 사용 여부를 결정하는 boolean 값
	 * @param handlerType 사용할 핸들러의 타입
	 * @param method HTTP 메서드(GET, POST, PUT, DELETE 등)
	 * @param url 요청할 URL
	 * @param paramMap 쿼리 문자열 또는 요청 본문에 포함될 매개변수를 나타내는 맵
	 * @param pathMap URL에 동적 경로 매개변수를 적용하기 위한 맵
	 * @param headerMap 요청 헤더를 나타내는 맵
	 * @param entities 요청 본문에 포함될 객체들을 나타내는 맵
	 * @param cookies 요청에 사용할 쿠키를 포함하는 CookieStore 객체
	 */
	default Object execute(
			boolean flag, HANDLER_TYPE handlerType, HTTP_METHOD method, String url,
			@Nullable BwStringMap paramMap, @Nullable BwStringMap pathMap, @Nullable BwStringMap headerMap,
			@Nullable BwObjectMap entities, @Nullable CookieStore cookies) throws Exception {

		try {
			Object responseBody = null;
			StopWatch watch = new StopWatch();

			try {
				url = makeRestFulURL(url, pathMap);
				HttpUriRequest request = makeRequest(method, url, paramMap, entities);
				HttpContext context = makeContext(request, cookies, headerMap);

				if (isDebug()) {
					setTimeout(getTimeout() * 10);
					getLogger().debug("{}:{} parameters <{}>, path <{}>, header <{}>", new Object[] { method, url, paramMap, pathMap, headerMap });
				}

				RequestConfig requestConfig = RequestConfig.custom()
						.setConnectTimeout(getTimeout())
						.setSocketTimeout(getTimeout())
						.build();

				HttpClientConnectionManager connManager = createConnectionManager();
				CloseableHttpClient client = HttpClients.custom()
						.setConnectionManager(connManager)
						.setDefaultRequestConfig(requestConfig)
						.build();

				watch.start();
				if (handlerType == HANDLER_TYPE.EMPTY) {
					responseBody = client.execute(request, context);
				} else {
					if (handlerType == HANDLER_TYPE.STRING) {
						responseBody = client.execute(request, new ResponseHandler<String>() {
							@Override
							public String handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
								int status = response.getStatusLine().getStatusCode();
								if (status >= 200 && status < 300) {
									return EntityUtils.toString(response.getEntity(), getCharSet());
								} else {
									throw new ClientProtocolException("Unexpected response status: " + status);
								}
							}
						}, context);
					} else if (handlerType == HANDLER_TYPE.MAP) {
						responseBody = client.execute(request, new ResponseHandler<BwObjectMap>() {
							@Override
							public BwObjectMap handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
								int status = response.getStatusLine().getStatusCode();
								if (status >= 200 && status < 300) {
									String responseBody = EntityUtils.toString(response.getEntity(), getCharSet());
									ObjectMapper mapper = new ObjectMapper();
									return mapper.readValue(responseBody, BwObjectMap.class);
								} else {
									throw new ClientProtocolException("Unexpected response status: " + status);
								}
							}
						}, context);
					}
					if (connManager != null) {
						connManager.shutdown();
					}
				}
				watch.stop();
			} catch (Exception e) {
				if (isDebug()) {
					getLogger().error("{}", e.getMessage(), e);
					throw e;
				} else {
					throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
				}
			} finally {
				if (isDebug()) {
					getLogger().info("{}:{} Elapsed time {} ms", new Object[] { method, url, watch.getTime() });
				}
			}
			return responseBody;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

}


