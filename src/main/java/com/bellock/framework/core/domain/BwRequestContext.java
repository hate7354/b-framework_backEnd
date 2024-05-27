package com.bellock.framework.core.domain;

import org.springframework.http.client.support.HttpRequestWrapper;

import com.bellock.framework.core.base.BwBaseModel;
import com.bellock.framework.core.util.BwRequestUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import static com.bellock.framework.core.constant.BwConstants.Const.REST_API_PREFIX_STR;


/**
 * 클라이언트 요청에 대한 컨텍스트 정보를 구하는 클래스.<p>
 * 로깅 및 기타 용도로 요청한 클라이언트의 IP, 요청 Paths, 요청 Method 및<p>
 * 클라이언트 플랫폼, 브라우저 정보 등을 조회한다.
 * <p>
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.05, 나인석, 최적화
 */
@SuppressWarnings("serial")
public class BwRequestContext extends BwBaseModel {

	//
	// 로그 맵을 두어, 로깅 처리에 사용
	//
	
	/**
	 * 세션 ID
	 * @see #getSessionId()
	 * @see #setSessionId(String)
	 * @see #BwRequestContext(HttpServletRequest, String)
	 */
	private String sessionId = null;
	/**
	 * 접속 아이피
	 * @see #getRemoteAddr()
	 * @see #setRemoteAddr(String)
	 */
	private String remoteAddr;
	/**
	 * 요청 주소 (End-Point)
	 * @see #BwRequestContext(HttpServletRequest, String)
	 * @see #getRequestShortURI()
	 */
	private String requestShortURI;
	/**
	 * 요청 주소 (전체)
	 * @see #getRequestURI()
	 * @see #setRequestURI(HttpServletRequest)
	 */
	private String requestURI;
	/**
	 * 요청 메소드 <p>
	 * GET/POST/PUT/DELETE
	 * @see #getRequestMethod()
	 * @see #setRequestMethod(String)
	 */
	private String requestMethod;
	/**
	 * 요청 시간(ms)<p>
	 * @see #setRequestTime(long)
	 * @see #getRequestTime()
	 */
	private long requestTime;
	/**
	 * Servlet Request 객체
	 */
	private HttpServletRequest request = null;
	/**
	 * 브라우저 종류
	 * @see #getAgent()
	 * @see #setAgent()
	 */
	private BwBrowserKind agent = null;
	/**
	 * 플랫폼 종류
	 * @see #getPlatform()
	 * @see #setPlatform()
	 */
	private BwPlatformKind platform = null;


	/**
	 * 기본 생성자.<p>
	 * 클라이언트 요청 시간을 설정한다.
	 */
	public BwRequestContext() {
		setRequestTime(System.currentTimeMillis());
	}

	/**
	 * 생성자.<p>
	 * HandlerInterceptor 인터페이스에서 구현된 클래스에서 호출.<p>
	 * 요청한 클라이언트의 IP, 브라우저, 플랫폼 및 URL, 요청 메서드 등의 정보를 조회 한다.
	 * @param request HttpServletRequest 객체
	 * @param requestShortURI End-Point URI
	 */
	public BwRequestContext(HttpServletRequest request, String requestShortURI) {
		this();

		// HttpServletRequest 객체 설정
		this.request = request;

		// 세션 ID 설정
		HttpSession session = request.getSession();
		if (session != null) {
			sessionId = session.getId();
		}

		// URI 설정
		this.requestShortURI = requestShortURI;
		// IP 주소 설정
		setRemoteAddr(request.getRemoteAddr());
		// request paths 설정
		setRequestURI(request);
		// 요청방식 설정
		setRequestMethod(request.getMethod().toUpperCase());
		// 요청 브라우저 종류 설정
		setAgent();
		// 요청 플랫폼 종류 설정
		setPlatform();
	}

	/**
	 * 생성자.
	 * @param request HttpRequestWrapper 객체
	 * @param requestUri End-Point URI
	 */
	public BwRequestContext(HttpRequestWrapper request, String requestUri) {
		this((HttpServletRequest) request, requestUri);
	}

	/**
	 * 세션 ID 반환.
	 * @return 세션 ID
	 */
	public String getSessionId() {
		return sessionId;
	}

	/**
	 * 세션 ID 설정.
	 * @param sessionId 세션 ID
	 */
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	/**
	 * 파라메터 반환.
	 * @param name 파라메터 키
	 * @return 파라메터 스트링 혹은 null
	 */
	public final Object getParameter(String name) {
		return request == null ? null : request.getParameter(name);
	}

	/**
	 * End-Point URI 반환.
	 * @return End-Point URI 스트링
	 */
	public String getRequestShortURI() {
		return requestShortURI;
	}

	/**
	 * 전체 URL 스트링 반환.
	 * @return 전체 URL 스트링
	 */
	public String getRequestURI() {
		return requestURI;
	}

	/**
	 * 전체 URL을 설정.
	 * @param request HttpServletRequest 객체
	 */
	public void setRequestURI(HttpServletRequest request) {
		StringBuilder url = new StringBuilder();

		url.append(request.getScheme())
		   .append("://")
		   .append(request.getServerName());

		// 포트 번호 추가 (80 또는 443이 아닌 경우)
		if ((request.getScheme().equals("http") && request.getServerPort() != 80) ||
			(request.getScheme().equals("https") && request.getServerPort() != 443)) {
			url.append(":").append(request.getServerPort());
		}
		// URI 추가
		url.append(request.getRequestURI());

		// 쿼리 문자열 추가 (있을 경우)
		if (request.getQueryString() != null) {
			url.append("?").append(request.getQueryString());
		}
		this.requestURI = url.toString();
	}

	/**
	 * 호출 방식 반환.
	 * @return 방식(GET/POST/PUT/DELETE)
	 */
	public String getRequestMethod() {
		return requestMethod;
	}

	/**
	 * 호출방식 설정.
	 * @param requestMethod 호출방식(UpperCase)
	 */
	public void setRequestMethod(String requestMethod) {
		this.requestMethod = requestMethod;
	}

	/**
	 * IP 주소 반환.
	 * @return IP 주소 스트링
	 */
	public String getRemoteAddr() {
		return remoteAddr;
	}

	/**
	 * IP 주소 설정.
	 * @param remoteAddr IP 주소 스트링
	 */
	public void setRemoteAddr(String remoteAddr) {
		this.remoteAddr = remoteAddr;
	}

	/**
	 * 접속 시간 반환.
	 * @return 접속시간(Long)
	 */
	public long getRequestTime() {
		return requestTime;
	}

	/**
	 * 접속 시간 설정.
	 * @param requestTime 접속시간(Long)
	 */
	public void setRequestTime(long requestTime) {
		this.requestTime = requestTime;
	}

	/**
	 * 브라우저 정보 및 문자열 리턴.
	 * @return 브라우저 정보
	 * @see #getBrowserKind(HttpServletRequest)
	 */
	public final BwBrowserKind getAgent() {
		if (agent == null) {
			agent = getBrowserKind(request);
		}
		return agent;
	}

	/**
	 * 요청한 클라이언트의 브라우저의 종류를 설정.
	 * @see #getBrowserKind(HttpServletRequest)
	 */
	private void setAgent() {
		this.agent = getBrowserKind(request);
	}

	/**
	 * 요청한 클라이언트의 플랫폼 정보를 반환.
	 * @return 플랫폼 정보
	 */
	public BwPlatformKind getPlatform() {
		if (platform == null) {
			platform = getPlatformKind(request);
		}
		return platform;
	}

	/**
	 * 요청한 클라이언트의 플랫폼 정보를 설정.
	 * @see #getPlatformKind(HttpServletRequest)
	 */
	private void setPlatform() {
		this.platform = getPlatformKind(request);;
	}
	
	/**
	 * 해당 요청이 모바일 브라우저를 통해 접속한 정보인지 체크.
	 * @return 모바일 브라우저라면 true
	 * @see #getPlatformKind(HttpServletRequest)
	 */
	public boolean isMobileBrowser() {
		if (platform == null) {
			platform = getPlatformKind(request);
		}
		return platform.isMobile();
	}

	/**
	 * 브라우저 정보를 반환.
	 * @param request HttpServletRequest 객체
	 * @return BrowserKind enum
	 */
	public final BwBrowserKind getBrowserKind(HttpServletRequest request) {
		return BwRequestUtils.getBrowserKind(request);
	}

	/**
	 * 플랫폼의 정보를 반환.
	 * @param request HttpServletRequest 객체
	 * @return PlatformKind enum
	 */
	public final BwPlatformKind getPlatformKind(HttpServletRequest request) {
		return BwRequestUtils.getPlatformKind(request);
	}

	/**
	 * REST API 요청인지 아닌지 체크.
	 * 사전에 REST API 엔드포인트의 prefix를 예약해야지만 작동됨.
	 * @return boolean. if request is rest.
	 */
	public final boolean isRestApi() {
		return getRequestURI().startsWith(REST_API_PREFIX_STR);
	}

	/**
	 * 클라이언트의 애플리케이션 정보 반환.
	 * @return the agent of the browser
	 */
	public String getUserAgent() {
		return request.getHeader("user-agent");
	}

}


