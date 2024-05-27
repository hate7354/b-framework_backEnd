package com.bellock.framework.core.http;

import java.io.File;
import java.io.InputStream;
import java.net.CookieStore;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.params.HttpParams;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.util.BwStringUtils;
import com.bellock.framework.core.util.BwJsonUtil;


@SuppressWarnings("deprecation")
public class BwHttpAdapter {
	@SuppressWarnings("unused")
	private static final Logger logger = LoggerFactory.getLogger(BwHttpAdapter.class);
	
	/**
	 * 기본 요청 타임아웃 값.
	 */
	private static final int DEFAULT_REQUEST_TIMEOUT = 30000;
	/**
	 * 요청/응답 기본 인코딩 값.
	 */
	public static final String DEFAULT_CHARACTER_SET = "UTF-8";
	/**
	 * The Constant HTTPS_PREFIX.
	 */
	public static final String HTTPS_PREFIX = "HTTPS";
	/**
	 * HTML Mine Type.
	 */
	public static final String DEFAULT_HTTP_CONTENT_TYPE = "text/html";
	/**
	 * TXT Mine Type.
	 */
	public static final String DEFAULT_HTTP_TXT_TYPE = "text/plain";
	/**
	 * XML Mine Type.
	 */
	public static final String DEFAULT_HTTP_XML_TYPE = "application/xml";
	/**
	 * JSON Mine Type.
	 */
	public static final String DEFAULT_HTTP_JSON_TYPE = "application/json";
	/**
	 * The Constant HTTP_SUCCESS_CODE.
	 */
	public static final int DEFAULT_SSL_PORT = 443;
	/**
	 * 성공시 HTTP 성공 코드값.
	 */
	public static final int HTTP_SUCCESS_CODE = 200;
	/**
	 * The Constant GET.
	 */
	public static final String GET = "GET";
	/**
	 * The Constant POST.
	 */
	public static final String POST = "POST";
	/**
	 * The Constant PUT.
	 */
	public static final String PUT = "PUT";
	/**
	 * The Constant DELETE.
	 */
	public static final String DELETE = "DELETE";
	/**
	 * 요청 URL.
	 */
	private String url;
	/**
	 * Rest 파라미터.
	 */
	private Map<String, String> pathMap = new HashMap<String, String>();
	/**
	 * Http 파라미터.
	 */
	private Map<String, String> requestParamMap = new HashMap<String, String>();
	/**
	 * 파일 첨부.
	 */
	private Map<String, File> fileMap = new HashMap<String, File>();
	/**
	 * http 헤더 파라미터.
	 */
	private Map<String, String> headerMap = new HashMap<String, String>();
	/**
	 * 요청 Timeout.
	 */
	private int timeout = DEFAULT_REQUEST_TIMEOUT;
	/**
	 * 전송 컨텐츠 Type.
	 */
	private String contentType = DEFAULT_HTTP_CONTENT_TYPE;
	/**
	 * The character set.
	 */
	private String characterSet = DEFAULT_CHARACTER_SET;
	/**
	 * The ssl port.
	 */
	private int sslPort = DEFAULT_SSL_PORT;
	/**
	 * The cookie store.
	 */
	private CookieStore cookieStore;
	/**
	 * 요청 json 데이터.
	 */
	private Object requestJsonData;
	/**
	 * 요청 body 텍스트 데이터.
	 */
	private String requestBodyText;
	/**
	 * 파일 전송시 필요한 InputStream.
	 */
	private InputStream banaryInputStream;

    
	/**
	 * Instantiates a new http adapter.
	 *
	 * @param url the url
	 */
	public BwHttpAdapter(String url) {
		this.url = url;
	}

	/**
	 * HTTP GET.
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executeGet() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			// 파라미터가 존재 한다면
			if (requestParamMap != null && requestParamMap.size() > 0) {
				int loopCount = 0;

				Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
				while (it.hasNext()) {
					Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
					String key = (String) pairs.getKey();
					String value = (String) pairs.getValue();
					if (loopCount == 0) {
						invokeURL += "?" + key + "=" + value;
					} else {
						invokeURL += "&" + key + "=" + value;
					}
					loopCount++;
				}
			}
			HttpGet httpget = new HttpGet(invokeURL);

			// header 초기화
			HttpContext localContext = initHeader(httpget);

			// Cookie 값이 존재 하면 설정
			if (cookieStore != null && cookieStore.getCookies().size() > 0) {
				localContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);
			}

			// HTTP client invoke
			HttpResponse response = httpclient.execute(httpget, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (파라미터 방식으로 호출).
	 *
	 * @return the HTTP response
	 * @throws Exception the exception
	 */
	public HttpResponse executePost() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPost httpPost = new HttpPost(invokeURL);
			HttpContext localContext = initHeader(httpPost);

			List<NameValuePair> formparams = new ArrayList<NameValuePair>();

			// HTTP parameter setting
			Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
				String key = (String) pairs.getKey();
				String value = (String) pairs.getValue();

				formparams.add(new BasicNameValuePair(key, value));
			}

			UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, characterSet);
			httpPost.setEntity(entity);
			HttpResponse response = httpclient.execute(httpPost, localContext);

			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (Multipart 호출).
	 *
	 * @return the HTTP response
	 * @throws Exception the exception
	 */
	public HttpResponse executePostMulipart() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			HttpPost httpPost = new HttpPost(BwJsonUtil.makeRestFulURL(url, pathMap));
			HttpContext localContext = initHeader(httpPost);

			// http parameter setting
			MultipartEntity entity = new MultipartEntity();
			Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
				String key = (String) pairs.getKey();
				String value = (String) pairs.getValue();
				entity.addPart(key, new StringBody(value));
			}

			Iterator<Entry<String, File>> it2 = fileMap.entrySet().iterator();
			while (it2.hasNext()) {
				Map.Entry<String, File> pairs = (Map.Entry<String, File>) it2.next();
				String key = (String) pairs.getKey();
				File value = (File) pairs.getValue();
				entity.addPart(key, new FileBody(value));
			}

			httpPost.setEntity(entity);
			HttpResponse response = httpclient.execute(httpPost, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (JSON DATA를 BODY로 호출).
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePostJSON() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			HttpPost httpPost = new HttpPost(BwJsonUtil.makeRestFulURL(url, pathMap));
			HttpContext localContext = initHeader(httpPost);

			// 오브젝트 to marshalling
			StringEntity stringEntity = 
					new StringEntity(BwJsonUtil.marshallingJson(requestJsonData), "application/json", DEFAULT_CHARACTER_SET);
			httpPost.setEntity(stringEntity);
			HttpResponse response = httpclient.execute(httpPost, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (TEXT DATA를 BODY로 호출).
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePostText() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPost httpPost = new HttpPost(invokeURL);
			HttpContext localContext = initHeader(httpPost);

			// 오브젝트 to marshalling
			StringEntity stringEntity = new StringEntity(requestBodyText, contentType, DEFAULT_CHARACTER_SET);
			httpPost.setEntity(stringEntity);

			HttpResponse response = httpclient.execute(httpPost, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (바이너리 파일 전송)
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePostBinary() {
		try {
			// Binary를 전송할 경우는 Timeout을 30분으로 설정한다.
			timeout = DEFAULT_REQUEST_TIMEOUT * 60;

			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPost httpPost = new HttpPost(invokeURL);
			HttpContext localContext = initHeader(httpPost);

			// Input Stream Setting
			InputStream is = this.getBanaryInputStream();
			InputStreamEntity isEntity = new InputStreamEntity(is, -1);
			isEntity.setContentType("binary/octet-stream");
			isEntity.setChunked(true);

			httpPost.setEntity(isEntity);

			HttpResponse response = httpclient.execute(httpPost, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (파라미터 방식으로 호출).
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePut() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPut httpPut = new HttpPut(invokeURL);
			HttpContext localContext = initHeader(httpPut);

			List<NameValuePair> formparams = new ArrayList<NameValuePair>();

			// http parameter setting
			Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
				String key = (String) pairs.getKey();
				String value = (String) pairs.getValue();
				formparams.add(new BasicNameValuePair(key, value));
			}

			UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, characterSet);
			httpPut.setEntity(entity);
			HttpResponse response = httpclient.execute(httpPut, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HTTP POST (multipart 호출).
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePutMulipart() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPut httpPut = new HttpPut(invokeURL);
			HttpContext localContext = initHeader(httpPut);

			// http parameter setting
			MultipartEntity entity = new MultipartEntity();
			Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
				String key = (String) pairs.getKey();
				String value = (String) pairs.getValue();
				entity.addPart(key, new StringBody(value));
			}

			Iterator<Entry<String, File>> it2 = fileMap.entrySet().iterator();
			while (it2.hasNext()) {
				Map.Entry<String, File> pairs = (Map.Entry<String, File>) it2.next();
				String key = (String) pairs.getKey();
				File value = (File) pairs.getValue();
				entity.addPart(key, new FileBody(value));
			}

			httpPut.setEntity(entity);
			HttpResponse response = httpclient.execute(httpPut, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Execute post json.
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePutJSON() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			HttpPut httpPut = new HttpPut(BwJsonUtil.makeRestFulURL(url, pathMap));
			HttpContext localContext = initHeader(httpPut);

			// 오브젝트 to marshalling
			StringEntity stringEntity = new StringEntity(BwJsonUtil.marshallingJson(requestJsonData), "application/json",
					DEFAULT_CHARACTER_SET);
			httpPut.setEntity(stringEntity);
			HttpResponse response = httpclient.execute(httpPut, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Execute put text.
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executePutText() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);
			HttpPut httpPut = new HttpPut(invokeURL);
			HttpContext localContext = initHeader(httpPut);

			// 오브젝트 to marshalling
			StringEntity stringEntity = new StringEntity(requestBodyText, contentType, DEFAULT_CHARACTER_SET);
			httpPut.setEntity(stringEntity);

			HttpResponse response = httpclient.execute(httpPut, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Execute delete.
	 *
	 * @return the http response
	 * @throws Exception the exception
	 */
	public HttpResponse executeDelete() {
		try {
			// HttpClient 객체를 생성 한다.
			HttpClient httpclient = getHttpClient() ;

			// 파라미터가 존재 한다면
			String invokeURL = BwJsonUtil.makeRestFulURL(url, pathMap);

			// 파라미터가 존재 한다면
			if (requestParamMap != null && requestParamMap.size() > 0) {
				int loopCount = 0;

				Iterator<Entry<String, String>> it = requestParamMap.entrySet().iterator();
				while (it.hasNext()) {
					Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
					String key = (String) pairs.getKey();
					String value = (String) pairs.getValue();
					if (loopCount == 0) {
						invokeURL += "?" + key + "=" + value;
					} else {
						invokeURL += "&" + key + "=" + value;
					}
					loopCount++;
				}
			}
			HttpDelete httpDelete = new HttpDelete(invokeURL);

			// header 초기화
			HttpContext localContext = initHeader(httpDelete);

			// Cookie 값이 존재 하면 설정
			if (cookieStore != null && cookieStore.getCookies().size() > 0) {
				localContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);
			}

			// httpclient invoke
			HttpResponse response = httpclient.execute(httpDelete, localContext);
			return response;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Inits the header.
	 *
	 * @param request the request
	 * @return the http context
	 */
	private HttpContext initHeader(HttpRequest request) {
		try {
			// 헤더 값이 존재 하면
			if (headerMap.size() >= 0) {
				Iterator<Entry<String, String>> it = headerMap.entrySet().iterator();
				while (it.hasNext()) {
					Map.Entry<String, String> pairs = (Map.Entry<String, String>) it.next();
					request.addHeader((String) pairs.getKey(), (String) pairs.getValue());
				}
			}

			HttpContext localContext = new BasicHttpContext();

			// Cookie 값이 존재 하면 설정
			if (cookieStore != null && cookieStore.getCookies().size() > 0) {
				localContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);
			}
			return localContext;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HttpClient 객체를 생성 한다.
	 *
	 * @return the http client
	 * @throws Exception the exception
	 */
	private HttpClient getHttpClient() {
		try {
			HttpParams httpParams = new BasicHttpParams();
			HttpConnectionParams.setConnectionTimeout(httpParams, timeout);
			HttpConnectionParams.setSoTimeout(httpParams, timeout);
			HttpClient httpclient = new DefaultHttpClient(httpParams);

			TrustManager easyTrustManager = new X509TrustManager() {
				public X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkServerTrusted(X509Certificate[] chain,
						String authType) throws CertificateException {
				}

				public void checkClientTrusted(X509Certificate[] chain,
						String authType) throws CertificateException {
				}
			};

			// 설정이 https일 경우
			if (BwStringUtils.contains(url.toUpperCase(), HTTPS_PREFIX)) {
				SSLContext sslcontext = SSLContext.getInstance("TLS");
				sslcontext.init(null, new TrustManager[] { easyTrustManager }, null);

				// ###self
				SSLSocketFactory socketFactory = new SSLSocketFactory(sslcontext,
						SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
				Scheme sch = new Scheme("https", this.sslPort, socketFactory);
				httpclient.getConnectionManager().getSchemeRegistry().register(sch);
			}

			return httpclient;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the url.
	 *
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * Gets the request body text.
	 *
	 * @return the request body text
	 */
	public String getRequestBodyText() {
		return requestBodyText;
	}

	/**
	 * Sets the request body text.
	 *
	 * @param requestBodyText the new request body text
	 */
	public void setRequestBodyText(String requestBodyText) {
		try {
			this.requestBodyText = requestBodyText;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Sets the url.
	 *
	 * @param url the new url
	 */
	public void setUrl(String url) {
		try {
			this.url = url;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the header map.
	 *
	 * @return the header map
	 */
	public Map<String, String> getHeaderMap() {
		return headerMap;
	}

	/**
	 * Sets the header map.
	 *
	 * @param headerMap the header map
	 */
	public void setHeaderMap(Map<String, String> headerMap) {
		try {
			this.headerMap = headerMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the timeout.
	 *
	 * @return the timeout
	 */
	public int getTimeout() {
		return timeout;
	}

	/**
	 * Sets the timeout.
	 *
	 * @param timeout the new timeout
	 */
	public void setTimeout(int timeout) {
		try {
			this.timeout = timeout;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the cookie store.
	 *
	 * @return the cookie store
	 */
	public CookieStore getCookieStore() {
		return cookieStore;
	}

	/**
	 * Sets the cookie store.
	 *
	 * @param cookieStore the new cookie store
	 */
	public void setCookieStore(CookieStore cookieStore) {
		try {
			this.cookieStore = cookieStore;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the content type.
	 *
	 * @return the content type
	 */
	public String getContentType() {
		return contentType;
	}

	/**
	 * Sets the content type.
	 *
	 * @param contentType the new content type
	 */
	public void setContentType(String contentType) {
		try {
			this.contentType = contentType;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the character set.
	 *
	 * @return the character set
	 */
	public String getCharacterSet() {
		return characterSet;
	}

	/**
	 * Sets the character set.
	 *
	 * @param characterSet the new character set
	 */
	public void setCharacterSet(String characterSet) {
		try {
			this.characterSet = characterSet;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the request json data.
	 *
	 * @return the request json data
	 */
	public Object getRequestJsonData() {
		return requestJsonData;
	}

	/**
	 * Sets the request json data.
	 *
	 * @param requestJsonData the new request json data
	 */
	public void setRequestJsonData(Object requestJsonData) {
		try {
			this.requestJsonData = requestJsonData;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the path map.
	 *
	 * @return the path map
	 */
	public Map<String, String> getPathMap() {
		return pathMap;
	}

	/**
	 * Sets the path map.
	 *
	 * @param pathMap the path map
	 */
	public void setPathMap(Map<String, String> pathMap) {
		try {
			this.pathMap = pathMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the request param map.
	 *
	 * @return the request param map
	 */
	public Map<String, String> getRequestParamMap() {
		return requestParamMap;
	}

	/**
	 * Sets the request param map.
	 *
	 * @param requestParamMap the request param map
	 */
	public void setRequestParamMap(Map<String, String> requestParamMap) {
		try {
			this.requestParamMap = requestParamMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the file map.
	 *
	 * @return the file map
	 */
	public Map<String, File> getFileMap() {
		return fileMap;
	}

	/**
	 * Sets the file map.
	 *
	 * @param fileMap the file map
	 */
	public void setFileMap(Map<String, File> fileMap) {
		try {
			this.fileMap = fileMap;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the ssl port.
	 *
	 * @return the ssl port
	 */
	public int getSslPort() {
		return sslPort;
	}

	/**
	 * Sets the ssl port.
	 *
	 * @param sslPort the new ssl port
	 */
	public void setSslPort(int sslPort) {
		try {
			this.sslPort = sslPort;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * Gets the banary input stream.
	 *
	 * @return the banary input stream
	 */
	public InputStream getBanaryInputStream() {
		return banaryInputStream;
	}

	/**
	 * Sets the banary input stream.
	 *
	 * @param banaryInputStream the new banary input stream
	 */
	public void setBanaryInputStream(InputStream banaryInputStream) {
		try {
			this.banaryInputStream = banaryInputStream;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

}


