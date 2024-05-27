package com.bellock.framework.core.util;

import java.util.Vector;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import static com.bellock.framework.core.constant.BwConstants.Const.HTML_TAG_PATTERN_STR;


/**
 * 문자열 처리와 관련된 다양한 유틸리티 메서드를 제공 클래스.
 * <p>
 * 클래스는 StringUtils를 확장하며, 문자열 변환, HTML 태그 제거, 숫자 및 문자열 검증 등을 수행한다.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwStringUtils extends StringUtils {
	/**
	 * HTML_TAG 상수
	 */
	private static final Pattern HTML_TAG = Pattern.compile(HTML_TAG_PATTERN_STR, 2);


	/**
	 * 문자열이 null인 경우 대체 값을 반환.
	 * 
	 * @param value 확인할 문자열
	 * @param replacer value가 null일 때 반환할 대체 값
	 * @return value가 null이 아닌 경우 value, null인 경우 replacer
	 **/
	public static String nvl(final String value, final String replacer) {
		try {
			if (value == null) {
				return replacer;
			} else {
				return value;
			}
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열에서 모든 HTML 태그를 제거.
	 *
	 * @param html HTML 태그가 포함된 문자열
	 * @return HTML 태그가 제거된 문자열
	 */
	public static String htmlToText(String html) {
		try {
			if (html == null) {
				return "";
			}

			html = HTML_TAG.matcher(html).replaceAll("");
			html = html.trim();
			return html;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열의 개행 문자를 HTML의 <br> 태그로 변환.
	 *
	 * @param comment 변환할 문자열
	 * @return 변환된 문자열
	 */
	public static String convertHtmlBr(final String comment) {
		try {
			if (comment == null || comment.trim().length() == 0) {
				return "";
			}
			int length = comment.length();
			StringBuffer buffer = new StringBuffer();

			for (int i = 0; i < length; i++) {
				String tmp = comment.substring(i, i + 1);

				if ("\r".compareTo(tmp) == 0) {
					tmp = comment.substring(++i, i + 1);

					if ("\n".compareTo(tmp) == 0) {
						buffer.append("<br>\r");
					}
					else {
						buffer.append("\r");
					}
				} else if ("\n".compareTo(tmp) == 0) {
					buffer.append("<br>");
				}
				buffer.append(tmp);
			}
			return buffer.toString();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열 배열을 Vector로 변환.
	 *
	 * @param str 문자열 배열
	 * @return Vector 객체
	 */
	public static Vector<Object> getVector(String[] str) {
		try {
			Vector<Object> vec = new Vector<Object>();

			for (int i = 0; i < str.length; i++) {
				vec.addElement(str[i]);
			}
			return vec;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열이 알파벳 문자로만 구성되어 있는지 확인.
	 *
	 * @param str 확인할 문자열
	 * @return 문자열이 알파벳 문자로만 구성되어 있으면 true, 그렇지 않으면 false
	 */
	public static boolean isString(final String str) {
		try {
			byte[] inputStrArray = str.toUpperCase().getBytes();
			boolean isString = true;

			for (int i = 0; i < inputStrArray.length; i++) {
				isString = inputStrArray[i] >= 'A' && inputStrArray[i] <= 'Z';
				if (!isString) {
					break;
				}
			}
			return str == null || isString;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열이 숫자로만 구성되어 있는지 확인.
	 *
	 * @param str 확인할 문자열
	 * @return 문자열이 숫자로만 구성되어 있으면 true, 그렇지 않으면 false
	 */
	public static boolean isNumber(final String str) {
		try {
			byte[] inputStrArray = str.getBytes();
			boolean isNumber = true;

			for (int i = 0; i < inputStrArray.length; i++) {
				isNumber = inputStrArray[i] >= '0' && inputStrArray[i] <= '9';
				if (!isNumber) {
					break;
				}
			}
			return str == null || isNumber;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열이 알파벳 문자 또는 숫자로만 구성되어 있는지 확인.
	 *
	 * @param str 확인할 문자열
	 * @return 문자열이 알파벳 문자 또는 숫자로만 구성되어 있으면 true, 그렇지 않으면 false
	 */
	public static boolean isStringNumber(String str) {
		try {
			byte[] inputStrArray = str.toUpperCase().getBytes();
			boolean isStringNumber = true;

			for (int i = 0; i < inputStrArray.length; i++) {
				isStringNumber = (inputStrArray[i] >= 'A' && inputStrArray[i] <= 'Z')
						|| (inputStrArray[i] >= '0' && inputStrArray[i] <= '9');
				if (!isStringNumber) {
					break;
				}
			}
			return str == null || isStringNumber;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열이 이메일 형식인지 확인.
	 *
	 * @param str 확인할 문자열
	 * @return 문자열이 이메일 형식이면 true, 그렇지 않으면 false
	 */
	public static boolean isEmail(final String str) {
		try {
			boolean isEmail = false;
			if (str.indexOf("@") > -1 && str.indexOf(".") > -1) {
				isEmail = true;
			}
			return isEmail;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * HTML 엔티티를 원래 문자로 변환
	 *
	 * @param strText 변환할 문자열
	 * @return 변환된 문자열
	 */
	public static String reverseHtmlString(String strText) {
		try {
			if (strText == null) {
				strText = "";
			}
			strText = getReplaceAll(strText, "\n", "<br />");
			strText = getReplaceAll(strText, "&lt;", "<");
			strText = getReplaceAll(strText, "&gt;", ">");
			strText = getReplaceAll(strText, "&#37;;", (char) 37 + "");
			strText = getReplaceAll(strText, "&quot;", (char) 34 + "");
			strText = getReplaceAll(strText, "&#39;", (char) 39 + "");
			strText = getReplaceAll(strText, "&#35;", "\n");

			return strText;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열의 특수 문자를 HTML 엔티티로 변환.
	 *
	 * @param strText 변환할 문자열
	 * @return 변환된 문자열
	 */
	public static String parseHtmlString(String strText) {
		try {
			if (strText == null) {
				strText = "";
			}
			strText = getReplaceAll(strText, "\n", "&#35;");
			strText = getReplaceAll(strText, "<br />", "\n");
			strText = getReplaceAll(strText, "<br>", "\n");
			strText = getReplaceAll(strText, "<", "&lt;");
			strText = getReplaceAll(strText, ">", "&gt;");
			strText = getReplaceAll(strText, "&nbsp;", " ");
			strText = getReplaceAll(strText, (char) 37 + "", "&#37;");
			strText = getReplaceAll(strText, (char) 34 + "", "&quot;");
			strText = getReplaceAll(strText, (char) 39 + "", "&#39;");

			return strText;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열이 null인 경우 빈 문자열을 반환.
	 *
	 * @param str 변환할 문자열
	 * @return 변환된 문자열
	 */
	public static String nullToStr(String str) {
		try {
			if (str == null) {
				str = "";
			}
			str = str.trim();
			return str;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
     * 객체가 null인 경우 빈 문자열을 반환
     *
     * @param obj 변환할 객체
     * @return 변환된 문자열
     */
    public static String convNullObj(Object obj) {
		try {
	       if (obj==null || "".equals(obj)){
	            return "";
	        }
	        return obj.toString();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열 내 특정 문자열을 다른 문자열로 대체.
	 *
	 * @param s0 원본 문자열
	 * @param orgStr 대체할 문자열
	 * @param newStr 대체할 문자열
	 * @return 변환된 문자열
	 */
	public static String getReplaceAll(String s0, String orgStr, String newStr) {
		try {
			int idx = 0;
			int orgStrLength = 0;
			int newStrLength = 0;

			s0 = nullToStr(s0);
			orgStrLength = orgStr.length();
			newStrLength = newStr.length();

			idx = s0.indexOf(orgStr);
			for (; idx != -1;) {
				s0 = (s0.substring(0, idx) + newStr + s0.substring(idx	+ orgStrLength));
				idx += newStrLength;

				if (idx <= s0.length() - 1) {
					idx = s0.indexOf(orgStr, idx);
				} else {
					break;
				}
			}
			return s0;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열을 URL 인코딩 형식으로 변환.
	 * 
	 * @param str 변환할 문자열
	 * @return 변환된 문자열
	 */
	public static String escape(String str) {
		try {
			StringBuffer sb = new StringBuffer();
			String ncStr = "*+-./0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
			char c;

			for (int i = 0; i < str.length(); i++) {
				c = str.charAt(i);
				if (c > 0x7f) {
					sb.append("%u");
					sb.append(Integer.toHexString((int) c).toUpperCase());
				} else if (ncStr.indexOf((int) c) == -1) {
					sb.append('%');
					if (c <= 0xf)
						sb.append('0');
					sb.append(Integer.toHexString((int) c).toUpperCase());
				} else
					sb.append(c);
			}

			return sb.toString();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
     * 문자열의 특수 문자를 원래 문자로 변환.
     *
     * @param s 변환할 문자열
     * @return 변환된 문자열
     */
    public static String undoFilteringNbsp(String s) {
		try {
	        s = changeString(s, "&amp;", "&");
	        s = changeString(s, "&#35;", "#");
	        s = changeString(s, "&#33;", "!");
	        s = changeString(s, "&#34;", "\"");
	        s = changeString(s, "&#36;", "$");
	        s = changeString(s, "&#37;", "%");
	        s = changeString(s, "&#39;", "'");
	        s = changeString(s, "&#40;", "(");
	        s = changeString(s, "&#41;", ")");
	        s = changeString(s, "&#42;", "*");
	        s = changeString(s, "&#43;", "+");
	        s = changeString(s, "&#61;", "=");
	        s = changeString(s, "&#63;", "?");
	        s = changeString(s, "&#64;", "@");
	        s = changeString(s, "&#91;", "[");
	        s = changeString(s, "&#92;", "\\");
	        s = changeString(s, "&#93;", "]");
	        s = changeString(s, "&#94;", "^");
	        s = changeString(s, "&#95;", "_");
	        s = changeString(s, "&#123;", "{");
	        s = changeString(s, "&#124;", "|");
	        s = changeString(s, "&#125;", "}");
	        s = changeString(s, "&#126;", "~");
	        s = changeString(s, "&lt;", "<");
	        s = changeString(s, "&gt;", ">");
	        s = changeString(s, "&#46;&#46;", "..");
	        s = changeString(s, "&#105;&#102;&#114;&#97;&#109;&#101;", "iframe");
	        s = changeString(s, "&#120;&#109;&#112;", "xmp");
	        s = changeString(s, "&#100;&#114;&#111;&#112;&#28;&#116;&#97;&#98;&#108;&#101;", "drop table");
	        s = changeString(s, "&#100;&#101;&#108;&#101;&#116;&#101;&#28;&#102;&#114;&#111;&#109;", "delete from");
	        s = changeString(s, "&#99;&#114;&#101;&#97;&#116;&#101;&#28;&#116;&#97;&#98;&#108;&#101;", "create table" );
	        s = changeString(s, "&nbsp;", " ");
	        return s;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 문자열 내 특정 문자열을 다른 문자열로 대체.
	 * 
	 * @param s 원본 문자열
	 * @param s1 대체할 문자열
	 * @param s2 대체할 문자열
	 * @return 변환된 문자열
	 */
    public static String replace(String s, String s1, String s2) {
		try {
	        if (s == null) {
	            return null;
			}
	        StringBuffer stringbuffer = new StringBuffer("");
	        int i = s1.length();
	        int j = s.length();
	        int k;
	        int l;
	        for (l = 0; (k = s.indexOf(s1, l)) >= 0; l = k + i) {
	            stringbuffer.append(s.substring(l, k));
	            stringbuffer.append(s2);
	        }
	        if (l < j) {
	            stringbuffer.append(s.substring(l, j));
			}
	        return stringbuffer.toString();
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
    }

	/**
	 * replace 메서드를 호출하여 문자열 내 특정 문자열을 대체.
	 * 
	 * @param s 원본 문자열
	 * @param s1 대체할 문자열
	 * @param s2 대체할 문자열
	 * @return 변환된 문자열
	 */
    public static String changeString(String s, String s1, String s2) {
		try {
			return replace(s, s1, s2);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.STRING_PROC_EXCEPTION, e);
		}
    }

}


