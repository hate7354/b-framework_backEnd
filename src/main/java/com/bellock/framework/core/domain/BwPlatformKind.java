package com.bellock.framework.core.domain;


/**
 * 플랫폼 enumeration 정의 클래스.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public enum BwPlatformKind {
	/**
	 * 플랫폼 Enum
	 */
	ANDROID("android", true),
	IPHONE("iphone", true),
	IPAD("ipad", true),
	IPOD("ipod", true),
	OPERA_MINI("opera mini", true),
	KINDLE("kindle", true),
	BLACK_BERRY("blackberry", true),
	WEB_OS("webos", true),
	PALM("palm", true),
	TREO("treo", true),
	WINDOWS("windows", false),
	LINUX("linux", false),
	UNIX_BSD("bsd", false),
	ETC("*", false);
	
	/**
	 * 플랫폼 이름
	 * @see #PlatformKind(String, boolean)
	 */
	private String name;
	
	/**
	 * 모바일 유무
	 * @see #PlatformKind(String, boolean)
	 */
	private boolean mobile;


	/**
	 * 플랫폼 이름 반환
	 * 
	 * @return String 객체
	 */
	public String getName() {
		return name;
	}

	/**
	 * 모바일 유무 반환
	 * 
	 * @return boolean
	 */
	public boolean isMobile() {
		return mobile;
	}
	
	/**
	 * 플랫폼 이름을 설정. 내부 메서드.
	 * 
	 * @param name 플랫폼 이름
	 * @param mobile 모바일 유무
	 */
	private BwPlatformKind(String name, boolean mobile) {
		this.name = name;
		this.mobile = mobile;
	}
	
}


