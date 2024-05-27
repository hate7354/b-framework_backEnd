package com.bellock.framework.core.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import static com.bellock.framework.core.constant.BwConstants.Locale.Const.*;


/**
 * Date Time util class
 * 
 * @since 2024.03, 나인석, 최초작성
 */
@SuppressWarnings("deprecation")
public class BwDateTimeUtil {
	public static final String SDF = new String("yyyyMMddHHmmss");
	public static final String SHORT_DATE_FORMAT = new String("yyyy-MM-dd");
	public static final String TIMESTAMP_PATTERN = "yyyyMMddHHmmss";
	public static final String SIMPLE_PATTERN = "yyyy-MM-dd HH:mm:ss";
	public static final String DIRECTORY_DATE_FORMAT = new String("yyyy/MM/dd");
	public static final String MAINTAINANCE_DATE_FORMAT = new String("yy-MM-dd HH:mm");
	public static final SimpleDateFormat SIMPLE_FORMAT = new SimpleDateFormat(SIMPLE_PATTERN);
	public static final String DEFAULT_DATETIME_PATTERN = "yyyyMMdd HH:mm:ss Z";
	/** 이메일 메시지에 사용되는 날짜/시간 패턴. 예) Tue, 08 Jun 2004 13:43:23 +0900 */
	public static final String DATE_PATTERN = "EEE, dd MMM yyyy HH:mm:ss Z";
	/** 이메일 메시지에 사용되는 날짜/시간 패턴2. 예) Tue, 08 Jun 2004 13:43:23 +0900 (KST) */
	public static final String DATE_PATTERN2 = "EEE, dd MMM yyyy HH:mm:ss Z (z)";
	/** 이메일 메시지에 사용되는 날짜/시간 패턴3. 예) 24 Jul 2004 05:46:01 +0900 */
	public static final String DATE_PATTERN3 = "dd MMM yyyy HH:mm:ss Z";
	/** 이메일 메시지에 사용되는 날짜/시간 패턴4. 예) 24 Jul 2004 05:46:01 +0900 (KST) */
	public static final String DATE_PATTERN4 = "dd MMM yyyy HH:mm:ss Z (z)";
	/** 로그 기록시 사용되는 날짜/시간 패턴. 예) 2004/06/08 13:43:23 */
	public static final String LOG_DATE_PATTERN = "yyyy/MM/dd HH:mm:ss";
	/** 최종 싱크 시간 기록시 사용되는 날짜/시간 패턴. 예) 2004/06/08 13:43:23 */
	public static final String SYNC_DATE_PATTERN = "yyyy/MM/dd HH:mm:ss";
	/** 로그파일명 구성에 사용되는 날짜/시간 패턴. 예) 20040614_23 */
	public static final String LOGFILENAME_DATE_PATTERN = "yyyyMMdd_HH";
	/** 실패한 메시지를 기록해둘때 사용하는 날짜/시간 패턴. 예) 20040628_182230 */
	public static final String FAILURE_DATE_PATTERN = "yyyyMMdd_HHmmss";
	/** 고유 메일 바운더리를 만들때 사용되는 날짜/시간 패턴. */
	public static final String BOUNDARY_DATE_PATTERN = "yyyyMMdd_HHmmss";
	/** 우솔에게 보내는 XML 문서 생성시 사용되는 날짜/시간 패턴. 예) 2004-06-08 13:43:23 */
	public static final String USOL_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";
	/** 우솔에게 보내는 SMS 요청 생성시 사용되는 날짜/시간 패턴. 예) 06/09/2004 03:57:12 */
	public static final String USOL_SMS_DATE_PATTERN = "MM/dd/yyyy HH:mm:ss";
	public static final String NEWMAILQ_DATE_PATTERN = "yyyyMMdd_HHmm";
	private static final Pattern TZ_REGEX = Pattern.compile("([+-][0-9][0-9]):?([0-9][0-9])$");


	/**
	 * 주어진 날짜/시간을 입력된 날짜/시간 패턴에 따른 문자열로 변환한다. 
	 * 디폴트 로케일은 Locale("en", "US") 로 설정된다.
	 * @param dt 변환할 날짜/시간 객체
	 * @param datepattern 얻고자 하는 날짜/시간 문자열을 나타내는 패턴
	 * @return 변환된 날짜/시간 문자열
	 */
	public static String convertDateToString(Date dt, String datepattern) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(datepattern, new Locale(LANGUAGE_KO, COUNTRY_KO));
			return sdf.format(dt);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜/시간을 기본 날짜/시간 패턴(DateUtil.DEFAULT_DATETIME_PATTERN)에 따른 문자열로 변환한다.
	 * 내부적으로 convertDateToString(Date, String)을 호출한다.
	 * @param dt 변환할 날짜/시간 객체
	 * @return 변환된 날짜/시간 문자열
	 */
	public static String convertDateToString(Date dt) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_DATETIME_PATTERN, new Locale(LANGUAGE_KO, COUNTRY_KO));
			return sdf.format(dt);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 날짜/시간을 기본 날짜/시간 패턴(DateUtil.DEFAULT_DATETIME_PATTERN)에 따른 문자열로 변환한다.
	 * 내부적으로 convertDateToString(Date)을 호출한다.
	 * @return 변환된 날짜/시간 문자열
	 */
	public static String convertNowToString() {
		try {
			return convertDateToString(new Date());
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 날짜/시간을 입력된 날짜/시간 패턴에 따른 문자열로 변환한다.
	 * 내부적으로 convertDateToString(Date, String)을 호출한다.
	 * @param datepattern 얻고자 하는 날짜/시간 문자열을 나타내는 패턴
	 * @return 변환된 날짜/시간 문자열
	 */
	public static String convertNowToString(String datepattern) {
		try {
			return convertDateToString(new Date(), datepattern);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜/시간을 문자열을 입력된 날짜/시간 패턴에 따른 날짜/시간 객체로 변환한다.
	 * @param datestr 날짜/시간 문자열
	 * @param datepattern 변환에 사용될 날짜/시간 패턴
	 * @return 날짜/시간 객체 (Date 객체)
	 * @exception ParseException
	 */
	public static Date convertStringToDate(String datestr, String datepattern) throws ParseException {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(datepattern, new Locale(LANGUAGE_KO, COUNTRY_KO));
			// sdf.setLenient(true);
			return sdf.parse(datestr);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜/시간을 문자열을 기본 날짜/시간 패턴(DateUtil.DEFAULT_DATETIME_PATTERN)에 따른 날짜/시간
	 * 객체로 변환한다. 내부적으로 convertStringToDate(String, String)을 호출한다.
	 * @param datestr 날짜/시간 문자열
	 * @return 날짜/시간 객체 (Date 객체)
	 * @exception ParseException
	 */
	public static Date convertStringToDate(String datestr) throws ParseException {
		try {
			return convertStringToDate(datestr, DEFAULT_DATETIME_PATTERN);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간으로 부터 로그 기록시에 사용될 날짜/시간 문자열을 구한다. 
	 * DateUtil.LOG_DATE_PATTERN 이 패턴으로 사용된다.
	 * @return 날짜/시간 문자열
	 */
	public static String getLogDateTimeStr() {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(LOG_DATE_PATTERN, new Locale(LANGUAGE_KO, COUNTRY_KO));
			return sdf.format(new Date());
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간으로 부터 로그 파일명 생성시에 사용될 날짜/시간 문자열을 구한다.
	 * DateUtil.LOGFILENAME_DATE_PATTERN 이 패턴으로 사용된다.
	 * @return 날짜/시간 문자열
	 */
	public static String getLogFilenameDateStr() {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(LOGFILENAME_DATE_PATTERN, new Locale(LANGUAGE_KO, COUNTRY_KO));
			return sdf.format(new Date());
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 RFC822 형식의 날짜/시간 문자열을 분석하여 해당하는 날짜/시간 패턴을 결정하고 반환.
	 * @param strDate 분석할 RFC822 형식의 날짜/시간 문자열
	 * @return 주어진 RFC822 날짜/시간 문자열에 해당하는 날짜/시간 패턴. 
	 *         만약 입력 문자열이 null이거나 빈 문자열인 경우 빈 문자열을 반환
	 */
	public static String getRFC822DatePattern(String strDate) {
		try {
			if (strDate == null || strDate.equals(""))
				return "";

			// 양쪽 공백 제거
			strDate = strDate.trim();

			// 변환에 사용할 날짜/시간 패턴 변수
			String strPattern = DATE_PATTERN;

			// 앞에 요일이 나오는지 --> 콤마를 찾아본다.
			int nCommaIndex = strDate.indexOf(",");
			if (nCommaIndex != -1) {
				// 콤마 발견 --> 즉, 요일이 들어간 날짜/시간 패턴
				// 따라서 DATE_PATTERN 이거나 DATE_PATTERN2 둘중에 하나이다.

				// 만약 타임존 표시 나오는지 --> ) 를 찾아본다.
				if (!strDate.endsWith(")"))
					strPattern = DATE_PATTERN;
				else
					strPattern = DATE_PATTERN2;
			} else {
				// 콤마 미발견 --> 요일이 안 들어간 날짜/시간 패턴
				// 따라서 DATE_PATTERN3 이거나 DATE_PATTERN4 둘중에 하나이다.

				// 만약 타임존 표시 나오는지 --> ) 를 찾아본다.
				if (!strDate.endsWith(")"))
					strPattern = DATE_PATTERN3;
				else
					strPattern = DATE_PATTERN4;
			}

			return strPattern;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 이메일 날짜를 보기 좋게 바꾼다. 한글로..
	 *
	 * @param strDate
	 *         이메일에 붙은 날짜 문자열 (영문)<br>
	 *         예1) Tue, 08 Jun 2004 13:43:23 +0900 또는 Tue, 08 Jun 2004
	 *         13:43:23 +0900 (KST)<br>
	 *         예2) 08 Jun 2004 13:43:23 +0900 또는 08 Jun 2004 13:43:23 +0900
	 *         (KST)<br>
	 *         즉, DATE_PATTERN, DATE_PATTERN2, DATE_PATTERN3, DATE_PATTERN4
	 *         형태 중 하나의 형태를 가진 문자열
	 * @return 한글로 보기 좋게 바꾼 날짜. 예) 2004년 07월 18일 09시 04분<br>
	 *         만약, 파라메터로 입력된 날짜/시간이 문자열이 한국 표준시가 아닌 다른 타임존의 날짜/시간으로 입력되었다고 해도
	 *         변환된 후의 시간 기준은 한국 표준시에 맞추어 변환된다.<br>
	 *         예) 입력: 24 Jul 2004 05:46:01 -0000 --> 출력: 2004년 07월 24일 14시 46분
	 */
	public static String convertRDate(String strDate) {
		try {
			String strPattern = getRFC822DatePattern(strDate);

			if (strPattern.equals(""))
				return "";

			Locale usLocale = new Locale("en", "US");

			SimpleDateFormat sdf = new SimpleDateFormat(strPattern, usLocale);
			sdf.setLenient(true); // 관대하게 파싱해줘~

			// catch ParseException
			try {
				Date dd1 = sdf.parse(strDate);

				// 파싱 익셉션 나면 그냥 돌려줘 버려
				Calendar cal = Calendar.getInstance(usLocale);
				cal.setTime(dd1);

				StringBuffer sb = new StringBuffer();
				sb.append("" + cal.get(Calendar.YEAR));
				sb.append("년 ");
				sb.append("" + getTwoDigit(cal.get(Calendar.MONTH) + 1));
				sb.append("월 ");
				sb.append("" + getTwoDigit(cal.get(Calendar.DAY_OF_MONTH)));
				sb.append("일 ");

				sb.append("" + getTwoDigit(cal.get(Calendar.HOUR_OF_DAY)));
				sb.append("시 ");
				sb.append("" + getTwoDigit(cal.get(Calendar.MINUTE)));
				sb.append("분");

				dd1 = null;
				usLocale = null;

				return sb.toString();
			} catch (ParseException pe) {
				usLocale = null;
				return strDate;
			} catch (Exception e) {
				usLocale = null;
				return strDate;
			}
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 문자열을 입력 형식에서 원하는 출력 형식으로 변환.
	 * @param strDate 입력으로 받는 문자열
	 * @return 변환된 문자열. 입력 문자열이 빈 문자열인 경우 빈 문자열을 반환
	 */
	public static String convertToDateDot(String strDate) {
		try {
			if (strDate.equals(""))
				return "";

			try {
				String strYear = strDate.substring(0, 4);
				String strMonth = strDate.substring(4, 6);
				String strDay = strDate.substring(6, 8);
				String strHour = strDate.substring(8, 10);
				String strMinute = strDate.substring(10, 12);

				StringBuffer sb = new StringBuffer();
				sb.append(strYear);
				sb.append(".");
				sb.append(strMonth);
				sb.append(".");
				sb.append(strDay);
				sb.append("&nbsp;");
				sb.append(strHour);
				sb.append(":");
				sb.append(strMinute);

				return sb.toString();
			} catch (Exception e) {
				return "";
			}
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 숫자를 두 자리로 만들어 반환
	 * @param digit 변환할 숫자
	 * @return 두 자리로 변환된 숫자를 문자열 형태로 반환
	 */
	private static String getTwoDigit(int digit) {
		try {
			if (digit < 10)
				return "0" + ("" + digit);
			else
				return "" + digit;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * SugarSync Platform API에서 내려주는 날짜/시간 문자열을 기본 패턴으로 변환.
	 * @param strDate 입력으로 받는 GMT 문자열
	 * @return 변환된 문자열. 입력 문자열이 null이거나 변환이 실패한 경우 빈 문자열을 반환
	 */
	public static String convertGMTToStr(String strDate) {
		try {
			// String pattern = "yyyy-MM-dd a h시mm분ss초";
			String pattern = "yyyy-MM-dd a h:mm:ss";
			return convertGMTToStr(strDate, pattern);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * SugarSync Platform API에서 내려주는 날짜/시간 문자열을 주어진 패턴으로 변환
	 * @param strDate 입력으로 받는 GMT 문자열
	 * @param pattern 변환할 패턴
	 * @return 주어진 패턴으로 변환된 문자열. 입력 문자열이 null이거나 변환이 실패한 경우 빈 문자열을 반환.
	 */
	public static String convertGMTToStr(String strDate, String pattern) {
		try {
			Date date = parseDateTime(strDate);
			if (date == null) {
				return "";
			} else {
				SimpleDateFormat sdf2 = new SimpleDateFormat(pattern);
				return sdf2.format(date);
			}
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * SugarSync Platform API에서 내려주는 dateString을 Date 형식으로 변환
	 * @param s 변환할 dateString
	 * @return 변환된 Date 객체. 입력 문자열이 null이거나 변환이 실패한 경우 null을 반환
	 */
	public static Date parseDateTime(String s) {
		try {
			Matcher mat = TZ_REGEX.matcher(s);
			TimeZone tz = null;
			if (mat.find()) {
				String tzCode = "GMT" + mat.group(1) + mat.group(2); // ex>
																		// "GMT+0100"
				tz = TimeZone.getTimeZone(tzCode);
			}

			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
			if (tz != null) {
				formatter.setTimeZone(tz);
			}

			try {
				return formatter.parse(s);
			} catch (Exception e) {
				return null;
			}
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 날짜를 문자열로 가져온다. 구분자에 따라 날짜를 8자리, 14자리로 가져온다.
	 * @param int pm_iFlag : 날짜 구분자 (0:8자리 날짜, 1:14자리 날짜+시간)
	 * @return String lm_sDate : 날짜 문자열
	 */
	public static String getNowDate(int pm_iFlag) {
		try {
			String lm_sDate = ""; // 반환할 날짜

			// 현재 날짜를 세팅한다.
			Date lm_oDate = new Date();
			GregorianCalendar lm_oGCal = new GregorianCalendar();
			lm_oGCal.setTime(lm_oDate);

			String lm_sYear = Integer.toString(lm_oGCal.get(Calendar.YEAR)); // 년
			String lm_sMonth = Integer.toString(lm_oGCal.get(Calendar.MONTH) + 1); // 월
			String lm_sDay = Integer.toString(lm_oGCal.get(Calendar.DATE)); // 일
			String lm_sHour = Integer.toString(lm_oGCal.get(Calendar.HOUR_OF_DAY)); // 시
			String lm_sMinute = Integer.toString(lm_oGCal.get(Calendar.MINUTE)); // 분
			String lm_sSecond = Integer.toString(lm_oGCal.get(Calendar.SECOND)); // 초

			// 월일시분초가 1자리로 나올 경우 2자리로 맞춘다.
			if (lm_sMonth.length() == 1)
				lm_sMonth = "0" + lm_sMonth;
			if (lm_sDay.length() == 1)
				lm_sDay = "0" + lm_sDay;
			if (lm_sHour.length() == 1)
				lm_sHour = "0" + lm_sHour;
			if (lm_sMinute.length() == 1)
				lm_sMinute = "0" + lm_sMinute;
			if (lm_sSecond.length() == 1)
				lm_sSecond = "0" + lm_sSecond;

			// Flag 값에 맞는 날짜 조합을 만든다.
			if (pm_iFlag == 0)
				lm_sDate = lm_sYear + lm_sMonth + lm_sDay;
			else if (pm_iFlag == 1)
				lm_sDate = lm_sYear + lm_sMonth + lm_sDay + lm_sHour + lm_sMinute + lm_sSecond;

			return lm_sDate;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}

	}

	/**
	 * YYYYMMDDHHMISS 문자형 시간을 long 형으로 바꾸어 반환한다.
	 * @param timeString
	 * @return
	 */
	public static long getTimeInMillis(String timeString) {
		try {
			if (timeString == null || timeString.length() < 14)
				return 0;
			int year = Integer.parseInt(timeString.substring(0, 4));
			// System.out.println(year);
			int month = Integer.parseInt(timeString.substring(4, 6));
			// System.out.println(month);
			int date = Integer.parseInt(timeString.substring(6, 8));
			// System.out.println(date);
			int hour = Integer.parseInt(timeString.substring(8, 10));
			// System.out.println(hour);
			int minute = Integer.parseInt(timeString.substring(10, 12));
			// System.out.println(minute);
			int second = Integer.parseInt(timeString.substring(12, 14));
			// System.out.println(second);
			return getTimeInMillis(year, month, date, hour, minute, second);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 연도, 월, 일, 시간, 분, 초를 기반으로 밀리초로 변환된 시간을 반환
	 * @param year 연도
	 * @param month 월 (1월부터 시작)
	 * @param date 일
	 * @param hour 시간 (24시간 형식)
	 * @param minute 분
	 * @param second 초
	 * @return 입력된 시간의 밀리초 값
	 */
	public static long getTimeInMillis(int year, int month, int date, int hour, int minute, int second) {
		try {
			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month - 1, date, hour, minute, second);
			return calendar.getTime().getTime();
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜에 일수를 더하여 형식화된 문자열로 반환
	 * @param day 기준 날짜(yyyyMMddHHmmss 형식의 문자열)
	 * @param addDay 더할 일수
	 * @return 형식화된 문자열로 표현된 더해진 날짜
	 */
	public synchronized static String getFormattedAddDay(String day, int addDay) {
		try {
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
			Calendar calendar = Calendar.getInstance();
			Date trialTime = new Date(getTimeInMillis(day));
			calendar.setTime(trialTime);
			calendar.add(Calendar.DATE, addDay);
			Date currentTime_1 = calendar.getTime();
			Long nowtime = Long.valueOf(formatter.format(currentTime_1));

			return (String) nowtime.toString();
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 두 날짜 사이의 일수 차이를 반환
	 * @param startDay 시작 날짜(yyyyMMddHHmmss 형식의 문자열)
	 * @param endDay 끝 날짜(yyyyMMddHHmmss 형식의 문자열)
	 * @return 두 날짜 사이의 일수 차이 (절대값)
	 */
	public static int getDateGap(String startDay, String endDay) { // yyyymmddhh24miss
		try {
			long gap = -1;
			try {
				SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

				Date sdate = formatter.parse(startDay);
				Date edate = formatter.parse(endDay);

				gap = edate.getTime() - sdate.getTime();
				gap = gap / (3600 * 24 * 1000);

			} catch (Exception e) {
				//e.printStackTrace();
			}
			return Math.abs((int) gap);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간과 주어진 날짜 사이의 일수 차이를 반환
	 * @param startDay 시작 날짜(yyyyMMddHHmmss 형식의 문자열)
	 * @return 현재 시간과 주어진 날짜 사이의 일수 차이 (절대값)
	 */
	public static int getDateGap(String startDay) {
		try {
			long gap = -1;

			try {
				SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
				Date sdate = formatter.parse(startDay);

				gap = System.currentTimeMillis() - sdate.getTime();
				gap = gap / (60 * 60 * 24 * 1000);
			} catch (Exception e) {
				//e.printStackTrace();
			}
			return Math.abs((int) gap);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간과 주어진 날짜 사이의 일수 차이를 분 단위로 반환
	 * @param startDay 시작 날짜(yyyyMMddHHmm 형식의 문자열)
	 * @return 현재 시간과 주어진 날짜 사이의 일수 차이 (절대값)
	 */
	public static int getDateGapMin(String startDay) {
		try {
			if (startDay == null || startDay.trim().equals("") || startDay.length() != 12) {
				return 365;
			}

			long gap = 365;
			try {
				SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");
				Date sdate = formatter.parse(startDay);
				gap = System.currentTimeMillis() - sdate.getTime();
				gap = gap / (60 * 60 * 24 * 1000);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return Math.abs((int) gap);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간을 초까지 포함하는 문자열로 반환
	 * @return "yyyyMMddHHmmss" 형식의 현재 시간을 나타내는 문자열
	 */
	public static String getTimeInSecond() {
		try {
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			Date currentTime_1 = new Date(System.currentTimeMillis());

			return formatter.format(currentTime_1);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간을 분까지 포함하는 문자열로 반환
	 * @return "yyyyMMddHHmm" 형식의 현재 시간을 나타내는 문자열
	 */
	public static String getTimeInMin() {
		try {
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmm");
			Date currentTime_1 = new Date(System.currentTimeMillis());

			return formatter.format(currentTime_1);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜를 주어진 패턴에 따라 포맷하여 문자열로 반환
	 * @param date 날짜
	 * @param pattern 포맷할 패턴
	 * @return 패턴에 따라 포맷된 날짜를 나타내는 문자열
	 */
	public static final String getDateTime(Date date, String pattern) {
		try {
			String dateStr = null;
			try {
				DateFormat df = null;
				if (pattern == null) {
					pattern = SDF;
				}
				df = new SimpleDateFormat(pattern);
				dateStr = df.format(date == null ? new Date() : date);
			} catch (Exception e) {
			}
			return dateStr;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 날짜를 "yyyyMMdd" 형식으로 반환
	 * @return "yyyyMMdd" 형식의 현재 날짜를 나타내는 문자열
	 */
	public static final String getToday() {
		try {
			return getDateToString(null, SHORT_DATE_FORMAT);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 현재 시간을 "yyyyMMddHHmmss" 형식으로 반환
	 * @return "yyyyMMddHHmmss" 형식의 현재 시간을 나타내는 문자열
	 */
	public static final String getTimestamp() {
		try {
			String now = getDateToString(0, TIMESTAMP_PATTERN);
			return now;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 타임스탬프를 주어진 패턴에 따라 포맷하여 문자열로 반환
	 * @param timestamp 타임스탬프
	 * @param pattern 포맷할 패턴
	 * @return 패턴에 따라 포맷된 날짜를 나타내는 문자열
	 */
	public static final String getDateToString(long timestamp, String pattern) {
		try {
			if (timestamp == 0) {
				timestamp = System.currentTimeMillis();
			}
			if (pattern == null || "".equals(pattern)) {
				pattern = SIMPLE_PATTERN;
			}
			SimpleDateFormat fmt = new SimpleDateFormat(pattern);
			return fmt.format(new Date(timestamp));
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 날짜를 주어진 패턴에 따라 포맷하여 문자열로 반환
	 * @param date 날짜
	 * @param pattern 포맷할 패턴
	 * @return 패턴에 따라 포맷된 날짜를 나타내는 문자열
	 */
	public static final String getDateToString(Date date, String pattern) {
		try {
			if (date == null) {
				date = new Date();
			}
			if (pattern == null || "".equals(pattern)) {
				pattern = SIMPLE_PATTERN;
			}
			SimpleDateFormat fmt = new SimpleDateFormat(pattern);
			return fmt.format(date);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

	/**
	 * 주어진 문자열을 주어진 패턴에 따라 파싱하여 날짜로 반환
	 * @param dateStr 파싱할 문자열
	 * @param pattern 문자열의 포맷
	 * @return 주어진 패턴에 따라 파싱된 날짜
	 */
	public static final Date parseStringToDate(String dateStr, String pattern) {
		try {
			if (pattern == null || "".equals(pattern)) {
				pattern = SIMPLE_PATTERN;
			}
			SimpleDateFormat fmt = new SimpleDateFormat(pattern);
			return fmt.parse(dateStr);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.DATETIME_PROC_EXCEPTION, e);
		}
	}

}


