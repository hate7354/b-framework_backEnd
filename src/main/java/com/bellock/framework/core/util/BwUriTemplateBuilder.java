package com.bellock.framework.core.util;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;


/**
 * URI 템플릿을 처리하고 변수 치환을 통해 URI를 확장하는 기능을 제공하는 클래스.
 * <p>
 * URI 템플릿에서 변수 이름을 추출하고, 주어진 값을 사용하여 해당 변수를 치환하여 최종 URI를 생성.
 * <p>주어진 URI가 템플릿과 일치하는지 확인하는 기능도 제공
 * 
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.04, 나인석, 최적화
 */
public class BwUriTemplateBuilder {
	/** 
	 * URI 템플릿에서 변수 이름을 캡처하는 정규 표현식 패턴
	 */
	private static final Pattern NAMES_PATTERN = Pattern.compile("\\{([^/]+?)\\}");
	/** 
	 * 템플릿 변수와 일치하는 값을 대체하는 정규 표현식
	 */
	private static final String VALUE_REGEX = "(.*)";
	/**
	 * URI 템플릿에서 추출한 변수 이름들의 리스트
	 */
	private final List<String> variableNames;
	/**
	 * URI 템플릿을 매칭하기 위한 패턴
	 */
	private final Pattern matchPattern;
	/**
	 * URI 템플릿 문자열
	 */
	private final String uriTemplate;


	/**
	 * 주어진 URI 템플릿 문자열을 파싱하여 변수 이름과 매칭 패턴을 초기화.
	 *
	 * @param uriTemplate URI 템플릿 문자열
	 */
	public BwUriTemplateBuilder(String uriTemplate) {
		Parser parser = new Parser(uriTemplate);
		this.uriTemplate = uriTemplate;
		this.variableNames = parser.getVariableNames();
		this.matchPattern = parser.getMatchPattern();
	}

	/**
	 *  URI 템플릿에서 추출된 변수 이름들의 리스트를 반환
	 *
	 * @return 변수 이름들의 리스트
	 */
	public List<String> getVariableNames() {
		return this.variableNames;
	}

	/**
	 * 주어진 맵에서 변수 값을 찾아 URI 템플릿을 확장하여 반환.
	 *
	 * @param uriVariables 변수 이름과 치환할 값들이 포함된 맵
	 * @return 확장된 URI
	 */
	public URI expand(Map<String, ?> uriVariables) {
		try {
			Object[] values = new String[this.variableNames.size()];
			for (int i = 0; i < this.variableNames.size(); i++) {
				String name = this.variableNames.get(i);
				if (!uriVariables.containsKey(name)) {
					throw new IllegalArgumentException("'uriVariables' Map has no value for '" + name + "'");
				}
				values[i] = uriVariables.get(name);
			}
			return expand(values);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * 주어진 값들을 사용하여 URI 템플릿을 확장하여 반환.
	 *
	 * @param uriVariableValues 변수 이름에 매핑된 값들의 배열
	 * @return 확장된 URI
	 */
	public URI expand(Object... uriVariableValues) {
		try {
			if (uriVariableValues.length != this.variableNames.size()) {
				throw new IllegalArgumentException("Invalid amount of variables values in [" + this.uriTemplate + "]: expected "
						+ this.variableNames.size() + "; got " + uriVariableValues.length);
			}

			Matcher matcher = NAMES_PATTERN.matcher(this.uriTemplate);
			StringBuffer buffer = new StringBuffer();
			int i = 0;
			while (matcher.find()) {
				String uriVariable = uriVariableValues[i++].toString();
				matcher.appendReplacement(buffer, Matcher.quoteReplacement(uriVariable));
			}
			matcher.appendTail(buffer);
			return encodeUri(buffer.toString());
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * 주어진 URI가 템플릿과 일치하는지 확인
	 *
	 * @param uri 매칭할 URI 문자열
	 * @return 일치하면 true, 그렇지 않으면 false
	 */
	public boolean matches(String uri) {
		try {
			if (uri == null) {
				return false;
			}
			Matcher matcher = this.matchPattern.matcher(uri);
			return matcher.matches();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * URI 템플릿 문자열을 반환.
	 * 
	 * @return URI 템플릿 문자열
	 */
	@Override
	public String toString() {
		return this.uriTemplate;
	}

	/**
	 * 주어진 문자열을 URL로 인코딩.
	 *
	 * @param uri 인코딩할 URI 문자열
	 * @return 인코딩된 URI
	 */
	protected URI encodeUri(String uri) {
		try {
			return new URI(uri);
		} catch (URISyntaxException e) {
			throw new IllegalArgumentException("Could not create URI from [" + uri + "]: " + e, e);
		}
	}

	/**
	 * URI 템플릿 문자열을 분석하여 변수 이름을 추출하고 매칭 패턴을 생성하는 클래스.
	 * 
	 * @since 2024.03, 나인석, 최초작성
	 * @since 2024.04, 나인석, 최적화
	 */
	private static class Parser {
		private final List<String> variableNames = new LinkedList<String>();
		private final StringBuilder patternBuilder = new StringBuilder();

		/**
		 * 주어진 URI 템플릿을 분석하여 변수 이름과 패턴을 생성.
		 * @param uriTemplate URI 템플릿 문자열
		 */
		private Parser(String uriTemplate) {
			try {
				Matcher m = NAMES_PATTERN.matcher(uriTemplate);
				int end = 0;
				while (m.find()) {
					this.patternBuilder.append(quote(uriTemplate, end, m.start()));
					this.patternBuilder.append(VALUE_REGEX);
					this.variableNames.add(m.group(1));
					end = m.end();
				}
				this.patternBuilder.append(quote(uriTemplate, end, uriTemplate.length()));
				int lastIdx = this.patternBuilder.length() - 1;
				if (lastIdx >= 0 && this.patternBuilder.charAt(lastIdx) == '/') {
					this.patternBuilder.deleteCharAt(lastIdx);
				}
			} catch (Exception e) {
				throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
			}
		}

		/**
		 * 주어진 범위의 문자열을 패턴으로 감쌈.
		 * 
		 * @param fullPath 전체 URI 템플릿 문자열
		 * @param start 시작 인덱스
		 * @param end  종료 인덱스
		 * @return 패턴으로 감싸진 문자열
		 */
		private String quote(String fullPath, int start, int end) {
			try {
				if (start == end) {
					return "";
				}
				return Pattern.quote(fullPath.substring(start, end));
			} catch (Exception e) {
				throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
			}
		}

		/**
		 * 추출된 변수 이름들의 리스트를 반환.
		 * @return 변수 이름들의 리스트
		 */
		private List<String> getVariableNames() {
			return Collections.unmodifiableList(this.variableNames);
		}

		/**
		 * 매칭 패턴을 반환
		 * @return URI 템플릿에 대한 매칭 패턴
		 */
		private Pattern getMatchPattern() {
			return Pattern.compile(this.patternBuilder.toString());
		}
	}
	
}


