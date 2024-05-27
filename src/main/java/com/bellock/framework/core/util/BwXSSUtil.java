package com.bellock.framework.core.util;

import org.springframework.util.StringUtils;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;


/**
 * 크로스 사이트 스크립팅(XSS) 공격을 방지하고 HTML 이스케이프 처리하는 클래스.
 * 
 * @since 2024/03, 나인석, 최초작성
 */
public class BwXSSUtil {

	/**
	 * XSS 공격을 방지하기 위해 잠재적으로 위험한 HTML 태그와 속성을 제거.
	 *
	 * @param string 검사하고 정리할 입력 문자열
	 * @return 정리된 문자열을 반환. 입력 문자열이 null인 경우 빈 문자열을 반환
	 */
	public static String sanitize(String string) {
		try {
			if (string == null) {
				return "";
			}

			// escape code 변환 관련 정리가 필요 함.
			String value = "";
			value = string.replaceAll("(?i)<script.*?>.*?</script.*?>", "")
						  .replaceAll("(?i)<.*?javascript:.*?>.*?</.*?>", "")
						  .replaceAll("(?i)<.*?\\s+on.*?>.*?</.*?>", "");
			return value;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	/**
	 *  HTML 태그를 이스케이프 처리하여 브라우저에서 코드로 실행되지 않도록 처리.
	 *
	 * @param value 이스케이프 처리할 입력 문자열
	 * @return 이스케이프 처리된 문자열을 반환
	 */
	public static String escapeHTML(String value) {
		try {
			String str = value;
			str = StringUtils.replace(str, "<", "&lt;");
			str = StringUtils.replace(str, ">", "&gt;");
			return str;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	/**
	 * 다양한 특수 문자를 HTML 엔티티로 변환하여 HTML에서 안전하게 표시 처리.
	 * 
	 * @param s 이스케이프 처리할 입력 문자열
	 * @return 이스케이프 처리된 문자열
	 */
	public static final String escapeHtmlAll(String s) {
		try {
		   StringBuffer sb = new StringBuffer();
		   int n = s.length();
		   for (int i = 0; i < n; i++) {
		      char c = s.charAt(i);
		      switch (c) {
		         case '<': sb.append("&lt;"); break;
		         case '>': sb.append("&gt;"); break;
		         case '&': sb.append("&amp;"); break;
		         case '\\': sb.append("&apos;"); break;
		         case '"': sb.append("&quot;"); break;
		         case 'à': sb.append("&agrave;");break;
		         case 'À': sb.append("&Agrave;");break;
		         case 'â': sb.append("&acirc;");break;
		         case 'Â': sb.append("&Acirc;");break;
		         case 'ä': sb.append("&auml;");break;
		         case 'Ä': sb.append("&Auml;");break;
		         case 'å': sb.append("&aring;");break;
		         case 'Å': sb.append("&Aring;");break;
		         case 'æ': sb.append("&aelig;");break;
		         case 'Æ': sb.append("&AElig;");break;
		         case 'ç': sb.append("&ccedil;");break;
		         case 'Ç': sb.append("&Ccedil;");break;
		         case 'é': sb.append("&eacute;");break;
		         case 'É': sb.append("&Eacute;");break;
		         case 'è': sb.append("&egrave;");break;
		         case 'È': sb.append("&Egrave;");break;
		         case 'ê': sb.append("&ecirc;");break;
		         case 'Ê': sb.append("&Ecirc;");break;
		         case 'ë': sb.append("&euml;");break;
		         case 'Ë': sb.append("&Euml;");break;
		         case 'ï': sb.append("&iuml;");break;
		         case 'Ï': sb.append("&Iuml;");break;
		         case 'ô': sb.append("&ocirc;");break;
		         case 'Ô': sb.append("&Ocirc;");break;
		         case 'ö': sb.append("&ouml;");break;
		         case 'Ö': sb.append("&Ouml;");break;
		         case 'ø': sb.append("&oslash;");break;
		         case 'Ø': sb.append("&Oslash;");break;
		         case 'ß': sb.append("&szlig;");break;
		         case 'ù': sb.append("&ugrave;");break;
		         case 'Ù': sb.append("&Ugrave;");break;
		         case 'û': sb.append("&ucirc;");break;
		         case 'Û': sb.append("&Ucirc;");break;
		         case 'ü': sb.append("&uuml;");break;
		         case 'Ü': sb.append("&Uuml;");break;
		         case '®': sb.append("&reg;");break;
		         case '©': sb.append("&copy;");break;
		         default:  sb.append(c); break;
		      }
		   }
		   return sb.toString();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * HTML 엔티티를 원래의 문자로 변환하여 원래 문자열로 복원
	 *
	 * @param value 원래 문자로 변환할 입력 문자열
	 * @return 원래 문자로 복원된 문자열을 반환
	 */
	public static String unescapeHTML (String value) {
		try {
			String str = value;
			str = StringUtils.replace(str, "&lt;", "<");
			str = StringUtils.replace(str, "&gt;", ">" );
			return str;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

}


