package com.bellock.framework.core.domain;


/**
 * 브라우저 enumeration 정의 클래스.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public enum BwBrowserKind {
	/**
	 * 브라우저 Enum
	 */
	CHROME("chrome"),
	SAFARI("safari"),
	FIREFOX("firefox"),
	MSIE_11_0("msie 11.0"),
	MSIE_10_0("msie 10.0"),
	MSIE_9_0("msie 9.0"),
	MSIE_8_0("msie 8.0"),
	MSIE_7_0("msie 7.0"),
	MSIE_6_0("msie 6.0"),
	MSIE_5_5("msie 5.5"),
	MSIE_5_0("msie 5.0"),
	ANDROID("android"),
	MOBILE_SAFARI("mobile safari"),
	ADOBE_AIR("adobeair"),
	OPERA("opera"),
	OPERA_MINI("opera mini"),
	NETSCAPE("x11"),
	ETC("compatible");
	
	/**
	 * 브라우저 이름
	 * @see #BrowserKind(String)
	 */
	private String name;
	
	/**
	 * 브라우저 이름 반환
	 * 
	 * @return String 객체
	 */
	public String getName() {
		return name;
	}

	/**
	 * 브라우저 이름을 설정. 내부 메서드
	 * 
	 * @param name The Browser name
	 */
	private BwBrowserKind(String name) {
		this.name = name;
	}

}


