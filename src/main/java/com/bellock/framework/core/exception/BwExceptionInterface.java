package com.bellock.framework.core.exception;


/**
 * 어플리케이션 레벨에서 처리될 예외 클라스를 위한 인터페이스.
 * 
 * 어플리케이션에서는 해당 인터페이스를 이용해 implements 하며
 * 예외 발생시 프레임워크에서 해당 클래스의 메서드를 호출해 예외에 
 * 대한 처리를 가능하게 한다
 * 
 * 그리고 해당 인터페이스를 상속 받는 클래스는 반드시 @Component 어노테이션을 
 * 적용하여 빈에 등록되도록 하여야 한다.
 * 
 * @since 2024.04, 나인석, 최초작성
 */
public interface BwExceptionInterface {
	/**
	 * 예외 발생시 프레임워크에 의해 호출되는 예외처리 메서드.
	 * 
	 * 예외 발생시 해당 메서드가 호출되고 다음으로 프레임워크의 default 예외처리가
	 * 진행된다. 만약 프레임워크의 기본 예외처리를 하지 않게 하려면 BellockExceptionStatus 객체의
	 * continueProc값을 false로 설정해서 반환하면 프레임워크에서는 예외에 대한 아무런 처리도 하지않게 된다.
	 * 
	 * 프레임워크의 기본 예외처리는
	 * 400번대의 에러가 발생하면 에러 화면을 클라이언트의 탭 화면으로 전송한다, 만약 400번대 에러 발생시 
	 * 별도의 에러 페이지를 띄우고 싶으면, 반환하는 BellockExceptionStatus 객체의 entryPoint에 템플릿이나
	 * HTML 스트링을 클라이언트로 전송할 엔드포인트 주소를 설정하고 객체를 반환하면 된다.
	 * 
	 * 그리고 500번대의 에러 발생시 어플리케이션에서 지정한 반환 객체 즉 ResponseCode를 클라이언트로
	 * 전송하고 싶으면 BellockExceptionStatus 객체의 responseCode에 해당 객체를 설정하면 된다.
	 * 
	 * 만약 400번대의 예외가 발생했을 때 continueProc값을 false로 설정한 경우 프레임워크에서는
	 * 클라이언트로 JSON으로 결과 값을 내려보내며, 개발자가 내려가는 결과 값을 변경하고 싶으면
	 * 반환 객체의 responseCode에 별도로 객체를 생성해 반환하면 된다.
	 * 
	 * 
	 * @param ex 예외 인스턴스
	 * @return BellockExceptionStatus 객체
	 */
	public BwExceptionResponse exceptionProcedure(Exception ex);
}
