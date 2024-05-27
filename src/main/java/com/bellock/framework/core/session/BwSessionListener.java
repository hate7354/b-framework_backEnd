package com.bellock.framework.core.session;

import static com.bellock.framework.core.constant.BwConstants.Session.PropKey.Placeholder.TIMEOUT_DEF;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.util.BwBeanAutowiringUtils;

import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;


/**
 * 세션 리스너.  HttpSessionListener 구현 클래스.
 * <p>세션 생성 및 소멸 이벤트를 처리하는 클래스.
 * <p>{@code @WebListener} 어노테이션을 사용하여서블릿 컨테이너에 의해 관리되기 
 * <p>때문에 스프링 컨텍스트에 의해 관리되지 않음. 즉 프로퍼티가 주입되지 않을 수 있음.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@WebListener
public class BwSessionListener implements HttpSessionListener {
	/**
	 * 프로퍼티에 설정된 세션 타임아웃 값 주입.
	 * BwSessionListener 인스턴스가 생성되는 시점이 빨라 {@code @Value}, {@code @BwSetField}를 사용할 수 없다.
	 */
	@BwSetField(TIMEOUT_DEF)
	private int sessionTimeout;


	/**
	 * Notification that a session was created. 
	 * 세션 생성시 BellockSessionManager 클래스를 통해 세션을 저장한다
	 * 
	 * @param se the notification event 
	 */
    @Override
    public void sessionCreated(HttpSessionEvent se) {
		/*
		 * @Value의 경우 아래와 같이 스프링의 자동 주입을 활성화할 수 있다.
		 * SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
		 *
		 * 하지만 우리는 @BwSetField 어노테이션을 사용해서 데이터 주입을 한다.
		 * 이유는 프로파일(application.properties)외에 우리가 정의한 프로퍼티(config/*.properties)에 있는
		 * 프로파일을 관리하고 거기서 설정을 기술할 수 있도록 하기 위해서이다.
		 */
		BwBeanAutowiringUtils.processBwSetField(this);

		try {
			HttpSession session = se.getSession();
			if (!session.getId().isEmpty()) {
				BwSessionManager.addSession(session);
				se.getSession().setMaxInactiveInterval(sessionTimeout*1000);
			}
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
		}
    }

	/**
	 * Notification that a session is about to be invalidated.
	 * 세션 해제시 BellockSessionManager 클래스를 통해 세션을 해제한다
	 * 
	 * @param se the notification event 
	 */
    @Override 
    public void sessionDestroyed(HttpSessionEvent se) {
		try {
			HttpSession session = se.getSession();
			if (!session.getId().isEmpty()) {
				BwSessionManager.removeSession(session);
			}
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
		}
    }

}


