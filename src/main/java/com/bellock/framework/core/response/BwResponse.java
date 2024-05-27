package com.bellock.framework.core.response;

import com.bellock.framework.core.base.BwAbstractBase;
import com.bellock.framework.core.context.BwApplicationContextAware;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.message.BwMessageResolver;


/**
 * 클라이언트로 전송되는 Response 클래스
 * 컨트롤러에서 @RestController 또는 @ResponseBody 어노테이션이 붙어야 함.
 * @ResponseBody 어노테이션이 붙은 경우 스프링 프레임워크가 자동적으로 Body 영역에 Response 객체를 붙임.
 * 
 * @history: 2024.03, 최초작성
 */
public final class BwResponse extends BwAbstractBase {
	
	/***
	 * Request에 대한 결과 코드, HttpStatus code와 다름.
	 * 프런트엔드 영역에서는 해당 코드를 읽어 성공여부 및 결과의 상태를 파악함.
	 */
	private int code;
	
	/**
	 *  Request에 대한 결과 메세지, 처리 결과에 대한 클라이언트에서 표시될 메세지
	 * 에러가 발생한 경우 alert 메세지를 해당 서버에서 받은 메세지로 표시.
	 */
	private String message;

	/**
	 * 상세 메세지, 예외발생시 시스템에서 셍성되는 예외 메세지
	 */
	private String detailMessage;
	
	/**
	 * Request에 대한 데이터, 처리 결과에 대한 데이터
	 * 데이터는 가변 파라메터로 설정되기 때문에 Object 타입의 배열로 내려감.
	 */
	private Object[] data;


	/**
	 * Request에 대한 결과 코드 반환
	 * @return 결과 코드
	 */
	public int getCode() {
		return code;
	}
	
	/**
	 * Request에 대한 결과 메세지 반환
	 * @return 결과 메세지
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * Request에 대한 결과 상세 메세지 반환
	 * @return 결과 상세 메세지
	 */
	public String getDetailMessage() {
		return detailMessage;
	}

	/**
	 * Request에 대한 데이터 반환
	 * @return Object 배열
	 */
	public Object[] getData() {
		return data;
	}

	/**
	 * 생성자, 코드와 메세지만 설정되는 경우
	 * 
	 * @param code 응답 코드
	 * @param message 응답 메세지
	 */
	public BwResponse(int code, String message) {
		this(code, message, "", new Object[]{});
	}

	/**
	 * 생성자, ResponseCode를 통해 결과 코드와 메세지를 설정
	 * 상세 메세지는 null, 데이터는 빈 배열
	 * 
	 * @param code ResponseCode 객체 인스턴스
	 */
	public BwResponse(BwResponseCode code) {
		this(
			code.code(), 
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(code.messageKey(), ""), 
			"", 
			new Object[]{}
		);
	}

	/**
	 * 생성자, BellockResultCode를 통해 결과 코드와 메세지 설정
	 * 상세 메세지는 null, 데이터는 빈 배열
	 * 
	 * @param status BellockExceptionStatus 객체 인스턴스
	 */
	public BwResponse(BwExceptionStatus status) {
		this(
			status.value(),
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(status.messageKey(), ""),
			"", 
			new Object[]{}
		);
	}

	/**
	 * 생성자, 코드와 메세지 그리고 데이터를 설정하는 경우, 상세 메세지는 null.
	 * 
	 * @param code 응답 코드
	 * @param message 응답 메세지
	 * @param data 클라이언트로 내려가는 데이터 (가변)
	 */
	public BwResponse(int code, String message, Object... data) {
		this(code, message, "", data);
	}

	/**
	 * 생성자, ResponseCode를 통해 코드와 메세지 설정, 
	 * 제네릭 타입으로 데이터 설정, 상세 메세지는 null.
	 * 
	 * @param code ResponseCode 객체 인스턴스
	 * @param data 클라이언트로 내려가는 데이터 (가변)
	 */
	public BwResponse(BwResponseCode code, Object... data) {
		this(
			code.code(),
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(code.messageKey(), ""),
			"",
			data
		);
	}

	/**
	 * 생성자, BellockResultCode를 통해 코드와 메세지 설정, 
	 * 제네릭 타입으로 데이터 설정, 상세 메세지는 null.
	 * 
	 * @param status BellockExceptionStatus 객체 인스턴스
	 * @param data 클라이언트로 내려가는 데이터 (가변)
	 */
	public BwResponse(BwExceptionStatus status, Object... data) {
		this(
			status.value(),
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(status.messageKey(), ""),
			"", 
			data
		);
	}

	/**
	 * 생성자, ResponseCode를 통해 코드와 메세지 설정, 
	 * 제네릭 타입으로 데이터 설정, 데이터는 빈 배열.
	 * 
	 * @param code ResponseCode 객체 인스턴스
	 * @param e Exception 객체 인스턴스
	 */
	public BwResponse(BwResponseCode code, Exception e) {
		this(
			code.code(),
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(code.messageKey(), ""),
			e.getMessage(),
			new Object[]{}
		);
	}

	/**
	 * 생성자, ResponseCode를 통해 코드와 메세지 설정, 
	 * 제네릭 타입으로 데이터 설정, 데이터는 빈 배열.
	 * 
	 * @param status BellockExceptionStatus 객체 인스턴스
	 * @param e Exception 객체 인스턴스
	 */
	public BwResponse(BwExceptionStatus status, Exception e) {
		this(
			status.value(),
			BwApplicationContextAware
				.getBean(BwMessageResolver.class)
				.getMessage(status.messageKey(), ""),
			e.getMessage(),
			new Object[]{}
		);
	}

	/**
	 * 생성자, 내부에서만 사용되는 생성자
	 * 모든 생성자들이 해당 생성자를 호출하게 됨.
	 * 
	 * 그리고 해당 생성자에서 로깅을 남겨 별도의 로깅 처리가 없어도 
	 * 
	 * @param code 응답 코드
	 * @param message 응답 메세지
	 * @param detailMessage 응답 상세 메세지
	 * @param data 클라이언트로 내려가는 데이터 (가변)
	 */
	private BwResponse(int code, String message, String detailMessage, Object... data) {
		this.code = code;
		this.message = message;
		this.detailMessage = detailMessage;
		this.data = data;

		if (!isProdMode()) {
			logger.info("code: {}, message: {}, detailMessage: {}", code, message, detailMessage);
		}
	}
	
}


