package com.bellock.framework.core.exception;

import org.springframework.lang.Nullable;

import com.bellock.framework.core.response.BwResponseCode;


/**
 * 어플리케이션에서 예외처리된 후 프레임워크의 예외처리 기본 수행과
 * 관련한 상태정보를 관리하는 클래스
 * 어플리케이션에서 예외처리한 후 프레임워크로 리턴할 때의 클래스이며
 * 설정된 상태에 따라 프레임워크의 기본 예외처리 동작 여부를 설정할 수 있으며
 * 리다이렉트 엔드포인트 및 프런트엔드로 반환되는 리턴 코드를 결정할 수 있다
 * 
 * @since 2024.04, 나인석, 최초작성
 */
public class BwExceptionResponse {
	/**
	 * 프레임워크의 예외처리 수행여부를 결정.
	 * true 인 경우 프레이워크가 기본 종작을 진행하며,
	 * false 인 경우 예외 처리는 어플리케이션에서만 처리되고 종료된다.
	 */
	private boolean continueProc;
	
	/**
	 * 400번대의 예외발생시 리다이렉트할 엔드포인트 정보이다.
	 * null 또는 empty 인 경우 기본 엔트리 포인트로
	 * 프레임워크는 리다이렉트하며, 기본 예외 페이지가 클라이언트에 표시된다.
	 */
	private String entryPoint;
	
	/**
	 * 400번대 외 예외인 경우 프런트엔드로 리턴되는 코드
	 * 어플리케이션 예외처리에서 프레임워크가 프런트엔드로 반환할
	 * 에러 코드를 해당 필드를 통해 변경할 수 있다.
	 * 프레임워크가 반환하는 기본 에러코드는 ResponseCode.FAIL 이다.
	 */
	private BwResponseCode responseCode;

	/**
	 * 클라이언트로 보내는 데이터.
	 */
	private Object[] data;
	

	/**
	 * 디폴트 예외처리 진행여부 Flag 반환
	 * @return boolean
	 */
	public boolean isContinueProc() {
		return continueProc;
	}

	/**
	 * 분기할 End-Point 반환
	 * @return End-Point 스트링
	 */
	public String getEntryPoint() {
		return entryPoint;
	}

	/**
	 * 예외 응답 코드 반환
	 * @return BwResponseCode
	 */
	public BwResponseCode getResponseCode() {
		return responseCode;
	}

	/**
	 * 클라이언트로 전달할 객체 반환
	 * @return 객체 배열
	 */
	public Object[] getData() {
		return data;
	}
	
	/**
	 * 디폴트 예외처리 진행여부 Flag 설정
	 * @param continueProc boolean
	 */
	public void setContinueProc(boolean continueProc) {
		this.continueProc = continueProc;
	}

	/**
	 * 분기할 End-Point 설정
	 * @param entryPoint 분기할 End-Point
	 */
	public void setEntryPoint(String entryPoint) {
		this.entryPoint = entryPoint;
	}

	/**
	 * 예외 응답 코드 설정
	 * @param BwResponseCode 응답 코드
	 */
	public void setResponseCode(BwResponseCode responseCode) {
		this.responseCode = responseCode;
	}

	/**
	 * 클라이언트로 전달할 객체 설정
	 * @param data Object 가변 파라메터
	 */
	public void setData(Object... data) {
		this.data = data;
	}
	
	/**
	 * 생성자, 프레임워크 예외처리 여부를 결정한다
	 * 나머지 엔트포인트와 리컨코드는 null 로 설정된다
	 * 
	 * @param continueProc true 이면 프레임워크의 기본 예외처리가 동작, 그렇지 않으면 false
	 */
	public BwExceptionResponse(boolean continueProc) {
		this(continueProc, null, null, (Object[])null);
	}
	
	/**
	 * 생성자, 프레임워크의 예외처리 여부와 엔드포인트를 설정한다
	 * 나머지 리턴코드는 null 로 설정된다
	 * 
	 * @param continueProc true 이면 프레임워크의 기본 예외처리가 동작, 그렇지 않으면 false
	 * @param entryPoint 리다이렉트 엔드포인트 정보
	 */
	public BwExceptionResponse(boolean continueProc, String entryPoint) {
		this(continueProc, entryPoint, null, (Object[])null);
	}

	/**
	 * 생성자, 프레임워크의 예외처리 여부와 리턴코드를 설정한다
	 * 나머지 엔드포인트 정보는 null 로 설정된다
	 * 
	 * @param continueProc true 이면 프레임워크의 기본 예외처리가 동작, 그렇지 않으면 false
	 * @param responseCode 프런트엔드 리턴코드
	 */
	public BwExceptionResponse(boolean continueProc, BwResponseCode responseCode) {
		this(continueProc, null, responseCode, (Object[])null);
	}

	/**
	 * 생성자, 모든 필드를 설정한다
	 * 
	 * @param continueProc true 이면 프레임워크의 기본 예외처리가 동작, 그렇지 않으면 false
	 * @param entryPoint 리다이렉트 엔드포인트 정보
	 * @param responseCode 프런트엔드 리턴코드
	 */
	public BwExceptionResponse(boolean continueProc, @Nullable String entryPoint, @Nullable BwResponseCode responseCode) {
		this(continueProc, entryPoint, responseCode, (Object[])null);
	}

	/**
	 * 생성자, 모든 필드를 설정한다.
	 * 
	 * @param continueProc
	 * @param entryPoint
	 * @param responseCode
	 * @param data
	 */
	public BwExceptionResponse(boolean continueProc, @Nullable String entryPoint, @Nullable BwResponseCode responseCode, @Nullable Object... data) {
		this.continueProc = continueProc;
		this.entryPoint = entryPoint;
		this.responseCode = responseCode;
		this.data = data;
	}
	
}


