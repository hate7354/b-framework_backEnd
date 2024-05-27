package com.bellock.framework.core.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UrlPathHelper;

import com.bellock.framework.core.constant.BwConstants;
import com.bellock.framework.core.domain.BwRequestContext;
import com.bellock.framework.core.domain.BwXSSRequestWrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import static com.bellock.framework.core.constant.BwConstants.Const.CONTEXT_STR;
import static com.bellock.framework.core.constant.BwConstants.Session.Const.KEY_SESSION_NULL_CHK_STR;
import static com.bellock.framework.core.constant.BwConstants.EndPoint.Commons.Get.*;
import static com.bellock.framework.core.constant.BwConstants.EndPoint.Login.Get.VERIFY;


/**
 * 컨트롤러의 전반적인 전후 처리를 위한 인터셉터 클래스
 * 
 * @history: 2024.03, 최초작성
 */
public class LoginInterceptor implements HandlerInterceptor  {
	static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
	private boolean xssRequest = true;
	private boolean debug = true;
	private UrlPathHelper urlPathHelper = new UrlPathHelper();


	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
 		logger.info("Pre-handle method is called");

		if (isXssRequest()) {
			request = new BwXSSRequestWrapper(request);
		}
		
		HttpSession session = request.getSession(false);
		String requestUri = urlPathHelper.getLookupPathForRequest(request);
		
		// 세션이 null이거나 usrId가 없는 경우 로그인 페이지로 Redirect
    	if ((session == null || session.getAttribute(KEY_SESSION_NULL_CHK_STR) == null) &&
    			!requestUri.equals(ROOT) && !requestUri.equals(INDEX) &&
    			!requestUri.equals(BwConstants.EndPoint.Rsa.Get.RSAKEY) && !requestUri.equals(VERIFY)) {
    		response.sendRedirect("/");
    		return false;
    	}

    	BwRequestContext context = new BwRequestContext(request, requestUri);
    	request.setAttribute(CONTEXT_STR, context);
    	
    	boolean isRestApi = context.isRestApi();
		if (debug) {
			logger.info("RestAPI:" + isRestApi + ", URL:" + requestUri);
		}

		return true;
	 }
	 
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		int status = response.getStatus();
		Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
		String errorMessage = "";
		if (throwable != null) throwable.getMessage();
		logger.info("Post-handle method is called: " + status + ", " + errorMessage);
	    
	}	
    
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			 throws Exception {
		int status = response.getStatus();
		Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
		String errorMessage = "";
		if (throwable != null) throwable.getMessage();
		logger.info("After-completion method is called: " + status + ", " + errorMessage);
	    
	}
	
	private boolean isXssRequest() {
		return xssRequest;
	}
	


}
