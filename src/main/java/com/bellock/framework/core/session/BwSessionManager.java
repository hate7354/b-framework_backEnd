package com.bellock.framework.core.session;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.WebSocketSession;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import jakarta.servlet.http.HttpSession;

import static com.bellock.framework.core.constant.BwConstants.Session.Const.*;


/**
 * 세션 관리자 클래스.
 * 연결된 세션 및 해제되는 세션을 관리한다. 세션 리스너에 의해 세션 생성 및 해제시 
 * 관련 메서드가 호출되며, 해당 메서드에서 맵 객체를 통해 세션을 저장 및 삭제한다.
 * 
 * 그 외 세션 정보를 조회하거나, 세션을 강제로 종료하는 처리를 한다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
public class BwSessionManager {
    private static final Logger logger = 
            LoggerFactory.getLogger(BwSessionManager.class);
    /**
     * 세션을 관리하는 동기화를 지원하는 맵
     * 해당 맵을 통해 생성된 세션을 저장하거나 삭제한다
     */
    private static final Map<String, HttpSession> sessions = new ConcurrentHashMap<>();


    /**
     * 내부적으로 세션을 관리하는 맵 객체를 반환
     * 
     * @return 맵 객체
     */
    public static synchronized Map<String, HttpSession> getSessions() {
        return sessions;
    }
    /**
     * 세션을 저장.
     * 세션 리스너의 sessionCreated 메서드에 의해 호출.
     * 
     * @param session 새롭게 생성된 세션 객체
     */
    public static synchronized void addSession(HttpSession session) {
        sessions.put(session.getId(), session);
    }

    /**
     * 세션을 삭제.
     * 세션 리스너의 sessionDestroyed 메서드에 의해 호출.
     * 
     * @param session 삭제하기 위한 세션 객체
     */
    public static synchronized void removeSession(HttpSession session) {
        WebSocketSession wss = (WebSocketSession) session.getAttribute(KEY_SOCKET_STR);
        if (wss != null) {
            try {
                wss.close();
            } catch (IOException e) {
                logger.info("{}", e.getMessage(), e);
            }
        }
        sessions.remove(session.getId());
    }

    /**
     * 세션 ID를 통해 세션이 있는지 확인
     * 
     * @param sessionId 찾으려는 세션 ID
     * @return 세션이 있을 경우 true, 그렇지 않으면 false
     */
    public static synchronized boolean isSessionValid(String sessionId) {
        return sessions.containsKey(sessionId);
    }

    /**
     * 세션 해제.
     * 세션 ID를 통해 강제적으로 세션을 해제한다.
     * 세션 중복(로그인 중복 방지) 기능을 적용하는 경우 사용
     * 
     * @param sessionId 세션 ID
     */
    public static synchronized void invalidateSession(String sessionId) {
        HttpSession session = sessions.get(sessionId);
        if (session != null) {
            session.invalidate();
        }
    }

    /**
     * 세션에 설정된 속성 값으로 세션 객체를 반환한다.
     * 없을 경우 null을 리턴한다.
     * 
     * @param name 세션의 속성 명
     * @param value 세션의 속성 값
     * @return 세션 객체 혹은 없을 경우 null
     */
    public static synchronized HttpSession getSession(String name, String value) {
        try {
            String sessionId = getSessionId(name, value);
            if (sessionId != null) {
                return sessions.get(sessionId);
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
        }
    }

    /**
     * 세션ID를 통해 저장된 세션의 객체를 반환한다.
     * 
     * @param sessionId 세션 ID
     * @return 세션 객체 혹은 없을 경우 null
     */
    public static synchronized HttpSession getSession(String sessionId) {
        try {
            HttpSession session = null;
            if (sessionId != null) {
                session = sessions.get(sessionId);
            }
            return session;
        } catch (Exception e) {
            throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
        }
    }

    /**
     * 세션에 설정된 속성 값으로 세션 ID를 반환한다.
     * 없을 경우 null을 리턴한다.
     * 
     * @param name 세션의 속성 명
     * @param value 세션의 속성 값
     * @return 세션 ID 혹은 없을 경우 null
     */
    public static synchronized String getSessionId(String name, String value) {
        try {
            for (String key : sessions.keySet()) {
                HttpSession session = sessions.get(key);
                if (session != null && session.getAttribute(name) != null) {
                    if (session.getAttribute(name).toString().equals(value)) {
                        return session.getId();
                    }
                }
            }
            return null;
        } catch (Exception e) {
            throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
        }
    }

    /**
     * 세션 ID를 통해 해당 세션에 속성을 설정한다.
     * 
     * @param sessionId 세션 ID
     * @param key 속성 키
     * @param value 속성 값
     */
    public static synchronized void updateSession(String sessionId, String key, Object value) {
        try {
            HttpSession session = sessions.get(sessionId);
            if (session != null) {
                session.setAttribute(key, value);
            }
        } catch (Exception e) {
            throw new BwException(BwExceptionStatus.SESSION_EXCEPTION, e);
        }
    }

    /**
     * 세션관리 맵의 Iterator를 반환한다.
     * 
     * @return 세션 맵의 Iterator
     */
    public static synchronized Iterator<Map.Entry<String, HttpSession>> getIterator() {
        return sessions.entrySet().iterator();
    }

}


