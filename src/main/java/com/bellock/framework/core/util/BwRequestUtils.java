package com.bellock.framework.core.util;

import com.bellock.framework.core.domain.BwBrowserKind;
import com.bellock.framework.core.domain.BwPlatformKind;
import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import jakarta.servlet.http.HttpServletRequest;


/**
 * HTTP 요청 객체에서 브라우저와 플랫폼의 종류를 식별하는 유틸리티 메서드를 제공.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwRequestUtils {

	/**
	 * 주어진 HTTP 요청에서 브라우저 종류를 식별하여 반환.
	 * @param request 브라우저 종류를 식별할 HTTP 요청 객체
	 * @return 요청한 브라우저 종류를 나타내는 BwBrowserKind 열거형 값
	 * @see BwBrowserKind
	 */
	public static final BwBrowserKind getBrowserKind(HttpServletRequest request) {
		try {
			BwBrowserKind kind = null;
			if (request == null || request.getHeader("user-agent") == null) {
				kind = BwBrowserKind.ETC;
			} else {
				String userAgent = request.getHeader("user-agent");
				for (BwBrowserKind browser : BwBrowserKind.values()) {
					if (userAgent.toLowerCase().indexOf(browser.getName()) >= 0) {
						kind = browser;
						break;
					}
				}
			}

			if (kind == null) {
				kind = BwBrowserKind.ETC;
			}
			return kind;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * 주어진 HTTP 요청에서 플랫폼 종류를 식별하여 반환.
	 * @param request 플랫폼 종류를 식별할 HTTP 요청 객체 
	 * @return 요청한 플랫폼 종류를 나타내는 BwPlatformKind 열거형 값
	 * @see BwPlatformKind
	 */
	public static final BwPlatformKind getPlatformKind(HttpServletRequest request) {
		try {
			BwPlatformKind kind = null;
			if (request == null || request.getHeader("user-agent") == null) {
				kind = BwPlatformKind.ETC;
			} else {
				String userAgent = request.getHeader("user-agent");
				for (BwPlatformKind platform : BwPlatformKind.values()) {
					if (userAgent.toLowerCase().indexOf(platform.getName()) >= 0) {
						kind = platform;
						break;
					}
				}
			}

			if (kind == null) {
				kind = BwPlatformKind.ETC;
			}
			return kind;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}
	
}
