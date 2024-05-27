package com.bellock.framework.core.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bellock.framework.core.response.BwResponse;
import com.bellock.framework.core.response.BwResponseCode;

import static com.bellock.framework.core.constant.BwConstants.Exception.Const.*;


/**
 * 프레임워크 글로벌 예외처리 핸들러.<p>
 * <p>
 * 모든 예외처리는 해당 핸들러를 통해 이루어진다.<p>
 * 400번대의 예외는 리다이렉션하여 예외처리 컨트롤러를 통해 HTML View 처리.
 * <p>
 * 어플리케이션 레벨에서는 예외처리가 필요한 경우 BwExceptionInterface 인터페이스를 상속 받은<p> 클래스의
 * {@link BwExceptionInterface#exceptionProcedure(Exception)} 메서드에서 예외처리할 수 있다.
 * 
 * @since 2024.04, 나인석, 최초작성
 */
@RestControllerAdvice
public class BwExceptionHandler {
	private static final Logger logger = 
			LoggerFactory.getLogger(BwExceptionHandler.class);
	/**
	 * 해당 인터페이스는 어플리케이션에서 implements 하게 되는 인터페이스로<p>
	 * 프레임워크 예외처리 핸들러는 해당 인터페이스를 미리 추상화시켜, 예외가<p>
	 * 발생하게 되면 어플리케이션에서도 예외 처리를 할 수 있도록 구조화 한다. 
	 * @see #setUserExceptionHandler(BwExceptionInterface)
	 */
	private BwExceptionInterface exceptionHandler;
	
	
	/**
	 * Spring Boot 프레임워크가 로드될 때 어플리케이션 예외처리 콤포넌트가 빈으로 등록되어 
	 * 있으면,<p>해당 인스턴스를 프레임워크 글로벌 예외처리 클래스의 필드로 주입한다.<p>
	 * 주입된 경우 예외발생시 어플리케이션 레벨에서도 예외처리가 가능해진다.
	 * <p>
	 * @param exceptionHandler BellockExceptionInterface 인스턴스
	 */
	@Autowired(required = false)
	private void setUserExceptionHandler(BwExceptionInterface exceptionHandler) {
		this.exceptionHandler = exceptionHandler;
	}

	/**
	 * BellockException 예외처리 핸들러.<p>
	 * 어플리케이션에서 예외 발생시 던지는 모든 예외를 해당 메서드에서 
	 * 처리하게 된다. <p>만약 어플리케이션에서 예외처리 환경이 만들어져 있으면
	 * 먼저 어플리케이션 예외를 처리한 후 나머지 후 처리를 하게 된다.<p>
	 * 해당 메서드는 프런트엔드로 JSON 타입으로 결과를 반환한다.
	 * <p>
	 * {@code @ExceptionHandler(BwException.class)} 어노테이션을 통해 예외발생시 
	 * {@link com.bellock.core.exception.BwException}으로<p> 던지는 모든 예외가 
	 * 해당 메서드로 들어오게 된다.
	 * <p>
	 * @param e {@link com.bellock.core.exception.BwException} 인스턴스
	 * @return {@link com.bellock.core.response.BwResponse} 인스턴스
	 */
	@ExceptionHandler(BwException.class)
	public BwResponse BellockException(BwException e) {
		BwExceptionResponse status;
		
		if (exceptionHandler != null) {
			status = exceptionHandler.exceptionProcedure(e);
			
			// 응답코드가 null 로 설정된 경우 default 값으로 설정
			if (status.getResponseCode() == null) {
				status.setResponseCode(BwResponseCode.FAIL);
			}
		} else {
			status = new BwExceptionResponse(true, BwResponseCode.FAIL);
		}

		// 어플리케이션 예외 핸들러에서 플레임워크의 기본 예외처리를 거부하면
		// 설정된 리턴 코드 및 메세지를 바로 프런트엔드로 반환하고 예외처리를 종료 한다.
		if (status.isContinueProc() == false) {
			return new BwResponse(status.getResponseCode());
		}

		//
		// 이하는 프레임워크의 디폴트 처리
		//

		logger.error(e.getMessage());

		// stack trace 정보
		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		String stackTrace = sw.toString();
		logger.error(stackTrace);

		// 로깅 관련 처리 (파일, 콘솔, DB) <===

		return new BwResponse(status.getResponseCode(), e);
	}

	/**
	 * BellockException외 모든 예외 발생시 처리되는 핸들러.<p>
	 * 어플리케이션에서 예외 발생시 던지는 모든 예외를 해당 메서드에서 
	 * 처리하게 된다. <p>만약 어플리케이션에서 예외처리 환경이 만들어져 있으면
	 * 먼저 어플리케이션 예외를 처리한 후 나머지 후 처리를 하게 된다.<p>
	 * 400번대의 예외는 리다이렉트 처리된다. <p>엔드포인트는 어플리케이션 
	 * 예외처리에서 변경이 가능하며, <p>400번대 외 예외처리는 클라이언트로
	 * JSON 타입의 스트링 결과를 반환한다.
	 * 
	 * @param e {@link java.lang.Exception} 인스턴스
	 * @return {@link org.springframework.http.ResponseEntity} 인스턴스 혹은 리다이렉트
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> BellockException(Exception e) {
		BwExceptionResponse status;
		
		if (exceptionHandler != null) {
			status = exceptionHandler.exceptionProcedure(e);
			
			// 엔드포인트와 응답코드를 null로 설정이 되어 있는 경우 default 값을 설정 
			if (status.getEntryPoint() == null) {
				status.setEntryPoint(URI_4XXERR_STR);
			}
			
			if (status.getResponseCode() == null) {
				status.setResponseCode(BwResponseCode.FAIL);
			}
		} else {
			status = new BwExceptionResponse(true, URI_4XXERR_STR, BwResponseCode.FAIL);
		}

		// 어플리케이션 예외 핸들러에서 플레임워크의 기본 예외처리를 거부하면
		// 설정된 리턴 코드 및 메세지를 바로 프런트엔드로 반환하고 예외처리를 종료 한다
		// 
		// 만약 HTML 페이지가 내려가야하는 상황에서 어플리케이션 예외처리 핸들러에서
		// 프레임워크 예외처리를 취소하는 경우, JSON으로 내려가게되는 결과가 발생한다
		//  
		if (status.isContinueProc() == false) {
			return ResponseEntity.status(HttpStatus.OK).body(new BwResponse(status.getResponseCode()));
		}

		logger.error(e.getMessage());
		
		// stack trace 정보를 구한다
		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		String stackTrace = sw.toString();
		logger.error(stackTrace);

		// 로깅 관련 처리 (파일, 콘솔, DB) <===
		
		if (status.getEntryPoint() != null && !status.getEntryPoint().isEmpty()) {
			// HTTP status 정보를 구한다
			HttpStatusCode statusCode = null;
			String endPoint = status.getEntryPoint();
			
			if (e instanceof ErrorResponse) {
				ErrorResponse er = (ErrorResponse)e;
				statusCode = er.getStatusCode();
				endPoint += STATUS_CODE_STR + Integer.toString(statusCode.value());
			}
			
			// 400번대 에러인 경우 ExceptionHandlerExceptionResolver를 통해 다시 엔드포인트를 호출하도록 한다
			if (statusCode != null && statusCode.is4xxClientError()) {
				return ResponseEntity.status(HttpStatus.FOUND).header("Location", endPoint).build();
			}
		}

		return ResponseEntity.status(HttpStatus.OK).body(new BwResponse(status.getResponseCode(), e));
	}
	
}


