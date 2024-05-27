package com.bellock.framework.core.exception;


/**
 * 해당 클래스는 서버에서 발생되는 예외를 처리하는 클래스.<p>
 * HTTPStatus 500번대 에러에 대한 부분을 해당 클래스를 통해 예외 처리 한다. 
 * <p>
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.05, 나인석, 추가처리 및 최적화
 */
@SuppressWarnings("serial")
public class BwException extends RuntimeException {
	/**
	 * BellockExceptionCode 객체.
	 */
	private BwExceptionStatus bellockStatus = null;


	/**
	 * BellockExceptionCode 객체 반환
	 * @return BwExceptionStatus 객체
	 */
	public BwExceptionStatus getBellockStatus() {
		return bellockStatus;
	}

	/**
	 * 생성자, 예외 코드를 받아 BellockExceptionStatus enum을 설정.
	 * @param value 예외 코드
	 */
	public BwException(int value) {
		this(BwExceptionStatus.valueOf(value));
	}
	
	/**
	 * 생성자, 아규먼트로 BellockExceptionStatus enum을 받아 설정.
	 * <p>
	 * @param bellockStatus BellockExceptionStatus 상수
	 */
	public BwException(BwExceptionStatus bellockStatus) {
		this.bellockStatus = bellockStatus;
	}

	/**
	 * 생성자, 아규먼트로 BellockExceptionStatus enum을 받아 설정한 후<p>
	 * Exception 객체를 통해 예외발생 상세 메세지를 설정한다.
	 * <p>
	 * @param bellockStatus BellockExceptionStatus 상수
	 * @param e The Exception
	 * @see #BwException(BwExceptionStatus, String)
	 */
	public BwException(BwExceptionStatus bellockStatus, Exception e) {
		this(bellockStatus, e.getMessage());
	}

	/**
	 * 생성자, 아규먼트로 BellockExceptionStatus enum을 받아 설정한 후<p>
	 * 직접 메세지를 받아 상세 메세지를 설정한다.
	 * <p>
	 * @param bellockStatus BellockExceptionStatus 상수
	 * @param message 상세 메세지
	 */
	public BwException(BwExceptionStatus bellockStatus, String message) {
		super(message);
		this.bellockStatus = bellockStatus;
	}

}

