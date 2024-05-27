package com.bellock.framework.core.response;

import org.springframework.lang.Nullable;

import com.bellock.framework.core.context.BwApplicationContextAware;
import com.bellock.framework.core.message.BwMessageResolver;


/**
 * The enum responseCode
 * 
 * @history 2024.03, 최초작성 - 아직 부족한 부분이 많음. 작업하면서 계속 추가되어야함.
 */
public enum BwResponseCode {
	/**
	 * 처리성공(msg:정상 처리되었습니다.)
	 */
	OK(0, "RESPONSE.OK"),	  
	/**
	 * 처리실패(msg:요청된 처리가 실패하였습니다.)
	 */
	FAIL(1, "RESPONSE.FAIL"),
	/**
	 * 파라메터 오류(msg:파라메터에 오류가 있습니다.)
	 */
	FAIL_PARAMETER(2, "RESPONSE.FAIL.PARAMETER"),
	/**
	 * 비밀번호 오류(msg:비밀번호 오류입니다.)
	 */
	FAIL_INVALID_PSWD(3, "RESPONSE.FAIL.INVALID.PSWD"),
	/**
	 * 계정오류(msg:등록되지 않은 계정입니다.)
	 */
	FAIL_USER_NOTFOUND(4, "RESPONSE.FAIL.USER.NOTFOUND"),
	/**
	 * 권한오류(msg:계정에 접속 권한이 없습니다.)
	 */
	FAIL_ACCESS_PERMISSION(5, "RESPONSE.FAIL.ACCESS.PERMISSION"),
	/**
	 * 계정잠김 오류(msg:사용자의 계정이 잠겨있습니다<br>관리자를 통해 잠김 해제하시기 바랍니다.)
	 */
	FAIL_ACCOUND_IS_LOCKED(6, "RESPONSE.FAIL.ACCOUND.IS.LOCKED"),
	/**
	 * 계정이 잠김 처리(msg:비밀번호 오류가 5회 이상 발생되어<br>계정이 잠김 처리됩니다.)
	 */
	FAIL_ACCOUND_IS_LOCKING_5(7, "RESPONSE.FAIL.ACCOUND.IS.LOCKING.5"),
	/**
	 * RSA 키 생성 오류(msg:암호화 키를 생성하지 못했습니다.)
	 */
	FAIL_GEN_RSAKEY(8, "RESPONSE.FAIL.GEN.RSAKEY"),
	/**
	 * 중복오류(msg:데이터 된 데이터입니다.)
	 */
	FAIL_DATA_DUPLICATE(9, "RESPONSE.FAIL.DATA.DUPLICATE"),
	/**
	 * 라이센스 오류(msg:라이센스가 없습니다.)
	 */
	FAIL_LICENSE(10, "RESPONSE.FAIL.LICENSE"),
	/**
	 * 알 수 없는 에러(msg:요청에 대한 처리 중 알 수 없는 에러가 발생했습니다.)
	 */
	FAIL_UNKNOWN(999, "RESPONSE.FAIL.UNKNOWN");

	
	private static final BwResponseCode[] VALUES;

	static {
		VALUES = values();
	}
	
	/**
	 * response 코드
	 */
	protected int code;
	
	/**
	 * response 메세지
	 */
	protected String messageKey;
	
	/**
	 * 생성자, 내부적으로 enum 생성시 사용
	 * 
	 * @param code error code
	 * @param message error message
	 */
	private BwResponseCode(int code, String messageKey) {
		this.code = code;
		this.messageKey = messageKey;
	}

	/**
	 * get error code
	 * 
	 * @return The error code
	 */
	public int code() {
		return code;
	}
	
	/**
	 * get error message
	 * 
	 * @return The error message
	 */
	public String messageKey() {
		return messageKey;
	}

	/**
	 * 
	 * @return
	 */
	public String message() {
		BwMessageResolver inst = BwApplicationContextAware.getBean(BwMessageResolver.class);
		return inst.getMessage(messageKey);
	}
	
	/**
	 * Return a string representation of this status code.
	 */
	@Override
	public String toString() {
		return this.code + " " + name();
	}

	/**
	 * Return the {@code ResponseCode} enum constant with the specified numeric value.
	 * 
	 * @param statusCode the string value of the enum to be returned
	 * @return the enum constant with the specified numeric value
	 * @throws IllegalArgumentException if this enum has no constant for the specified numeric value
	 */
	@Nullable
	public static BwResponseCode valueOf(int statusCode) {
		BwResponseCode status = resolve(statusCode);
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
	public static BwResponseCode resolve(int statusCode) {
		for (BwResponseCode status : VALUES) {
			if (status.code == statusCode) {
				return status;
			}
		}
		return null;
	}
	
}


