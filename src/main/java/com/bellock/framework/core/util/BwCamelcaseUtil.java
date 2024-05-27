package com.bellock.framework.core.util;


/**
 * 입력 문자열에 대하여 Camel 표기법으로 변환을 지원하는 Utility 클래스.
 * <p>
 * '_' 가 나타나지 않으면 이미 camel case 로 가정함.
 * <p>단 첫째문자가 대문자이면 camel case 변환 처리(전체를 소문자로)가 필요하다고 가정함.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public final class BwCamelcaseUtil {
	
	/**
	 * camel case 로 변환하는 메서드.
	 * @param underScore 변경할 스트링
	 * @return 변경된 스트링
	 */
	public static String toSnakeCase(String underScore) {
		if (underScore.indexOf('_') < 0 && Character.isLowerCase(underScore.charAt(0))) {
			return underScore;
		}
		
		StringBuilder result = new StringBuilder();
		boolean nextUpper = false;
		int len = underScore.length();

		for (int i = 0; i < len; i++) {
			char currentChar = underScore.charAt(i);
			if (currentChar == '_') {
				nextUpper = true;
			} else {
				if (nextUpper) {
					result.append(Character.toUpperCase(currentChar));
					nextUpper = false;
				} else {
					result.append(Character.toLowerCase(currentChar));
				}
			}
		}
		return result.toString();
	}

}


