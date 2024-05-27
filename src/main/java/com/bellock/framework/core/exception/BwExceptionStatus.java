package com.bellock.framework.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;

import com.bellock.framework.core.context.BwApplicationContextAware;
import com.bellock.framework.core.properties.BwPropertiesHandler;


/**
 * Enumeration of  BellockException status codes.
 * 
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.05, 나인석, enum명 변경 및 추가
 */
public enum BwExceptionStatus {
	/**
	 * 파라메터 오류(msg:파라메터 필수 값에 문제가 있습니다.)
	 */
	PARAMETER_EXCEPTION(1100, HttpStatus.BAD_REQUEST, "STATUS.BAD.PARAMETER"),
	/**
	 * RESRFull API 연동 오류(msg:RESRfull API 연동 중에 문제가 발생했습니다.)
	 */
	RESTFULL_EXCEPTION(1101, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.RESTFULL.ERROR"),
	/**
	 * 프로퍼티 관련 오류(msg:프로퍼티 관련 문제가 발생했습니다.)
	 */
	PROPERTIES_EXCEPTION(1102, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.PROPERTIES.ERROR"),
	/**
	 * 프로퍼티 읽기 오류(msg:프로퍼티를 읽는 중에 문제가 발생했습니다.)
	 */
	PROPERTY_GET_EXCEPTION(1103, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.PROPERTY.GET.ERROR"),
	/**
	 * 객체 생성 오류(msg:객체 인스턴스 생성 중에 문제가 발생했습니다.)
	 */
	INST_INIT_EXCEPTION(1104, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.INST.INIT.ERROR"),
	/**
	 * 세션 관리 오류(msg:세션 관리 중에 문제가 발생했습니다.)
	 */
	SESSION_EXCEPTION(1105, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.SESSION.ERROR"),
	/**
	 * RSA Crypto 오류(msg:암호화 처리 중에 문제가 발생했습니다.)
	 */
	CRYPTO_EXCEPTION(1106, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.CRYPTO.ERROR"),
	/**
	 * 스트링 처리중 오류(msg:문자열 처리 중에 문제가 발생했습니다.)
	 */
	STRING_PROC_EXCEPTION(1107, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.STRING.PROC.ERROR"),
	/**
	 * 객체 문자열 반환 오류(msg:객체 문자열 반환 중에 문제가 발생했습니다.)
	 */
	INST_STRING_EXCEPTION(1108, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.INST.STRING.ERROR"),
	/**
	 * 객체 비교 오류(msg:객체들을 비교하는 중에 문제가 발생했습니다.)
	 */
	INST_COMPARE_EXCEPTION(1109, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.INST.COMPARE.ERROR"),
	/**
	 * 객체 해시코드 반환 오류(msg:객체 해시코드 반환 중에 문제가 발생했습니다.) 
	 */
	INST_HASHCODE_EXCEPTION(1110, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.INST.HASHCODE.ERROR"),
	/**
	 * DateTime 처리 오류(msg:날짜/시간 처리 중에 문제가 발생했습니다.)
	 */
	DATETIME_PROC_EXCEPTION(1111, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.DATETIME.PROC.ERROR"),
	/**
	 * SQL 관련 오류(msg:SQL 데이터 쿼리 중에 문제가 발생했습니다.)
	 */
	SQL_EXCEPTION(1112, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.SQL.ERROR"),
	/**
	 * 알 수 없는 오류(msg:서버에서 처리 중에 내부 문제가 발생했습니다.)
	 */
	INTERNAL_SERVER_ERROR(1999, HttpStatus.INTERNAL_SERVER_ERROR, "STATUS.INTERNAL.SERVER.ERROR");
	

	private static final BwExceptionStatus[] VALUES;

	static {
		VALUES = values();
	}
	
	/**
	 * 예외코드
	 */
	protected int value;
	/**
	 * HTTP status
	 */
	protected HttpStatus status;
	/**
	 * 메세지 키
	 */
	protected String messageKey;


	/**
	 * 생성자, 내부적으로 enum 생성시 사용.
	 * 
	 * @param value 예외코드
	 * @param status The HttpStatus
	 * @param messageKey 메세지 키
	 */
	private BwExceptionStatus(int value, HttpStatus status, String messageKey) {
		this.value = value;
		this.status = status;
		this.messageKey = messageKey;
	}
	
	/**
	 * 예외 코드를 반환
	 * 
	 * @return 예외코드
	 */
	public int value() {
		return this.value;
	}

	/**
	 * HTTP status를 반환
	 * 
	 * @return HTTP status
	 */
	public HttpStatus status() {
		return this.status;
	}

	/**
	 * 메세지 키 반환
	 * 
	 * @return 메세지 키
	 */
	public String messageKey() {
		return this.messageKey;
	}

	/**
	 * 메세지 키에 해당하는 다국어 메세지를 반환 
	 * 
	 * @return 키에 해당하는 메세지
	 */
	public String message() {
		return BwApplicationContextAware
					.getBean(BwPropertiesHandler.class)
					.getString(messageKey);
	}
	
	/**
	 * Return a string representation of this status code.
	 */
	@Override
	public String toString() {
		return this.value + " " + name();
	}

	/**
	 * Return the {@code BellockExceptionCode} enum constant with the specified numeric value.
	 * 
	 * @param statusCode the string value of the enum to be returned
	 * @return the enum constant with the specified numeric value
	 * @throws IllegalArgumentException if this enum has no constant for the specified numeric value
	 */
	@Nullable
	public static BwExceptionStatus valueOf(int statusCode) {
		BwExceptionStatus status = resolve(statusCode);
		if (status == null) {
			throw new IllegalArgumentException("No matching constant for [" + statusCode + "]");
		}
		return status;
	}

	/**
	 * Resolve the given status code to an {@code BellockExceptionCode}, if possible.
	 * 
	 * @param statusCode the Exception status code (potentially non-standard)
	 * @return the corresponding {@code BellockExceptionCode}, or {@code null} if not found
	 */
	@Nullable
	public static BwExceptionStatus resolve(int statusCode) {
		for (BwExceptionStatus status : VALUES) {
			if (status.value == statusCode) {
				return status;
			}
		}
		return null;
	}

}
