package com.bellock.framework.core.socket;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.bellock.framework.core.session.BwSessionManager;

import static com.bellock.framework.core.constant.BwConstants.Session.Const.*;


/**
 * 웹소켓이 연결되거나 해제될 때 호출되는 콜백 메서드를 정의한 클래스
 * 웹소켓이 연결되었을 때 관련 HTTP 세션의 정보를 업데이트 한다
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@SuppressWarnings("null")
public class BwWebSocketHandler extends TextWebSocketHandler {
    protected static final Logger logger = 
            LoggerFactory.getLogger(BwWebSocketHandler.class);

    /**
     * 웹소켓이 연결된 후 호출되는 이벤트 콜백
     * 해당 콜백 메서드에서 웹소켓과 연관된 HTTP 세션을 찾아 세션 정보를 업데이트한다
     * 
     * @param session 웹소켓 객체
     */
    @Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // URI에 첨부된 세션 ID를 추출
        Map<String, String> parameters = extractUriParameters(session.getUri().getQuery());
        String httpSessionId = parameters.get(KEY_SESSION_ID_STR);

        // HTTP 세션에 Socket 세션을 업데이트 한다.
        BwSessionManager.updateSession(httpSessionId, KEY_SOCKET_STR, session);
	}

    /**
     * 웹소켓이 해제된 후 발생되는 이벤트 콜백
     * 
     * @param session 웹소켓 객체
     * @param status 해제 상태 코드
     */
    @Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("WebSocketSession:" + session.getId());
        logger.info("afterConnectionClosed: status " + status.getCode());
	}

    /**
     * 소켓 연결시 넘어온 URI를 이용해 파라메터를 맵으로 반환
     * 
     * @param queryString 소켓 연결시 URI
     * @return HTTP 세션 ID
     */
    private Map<String, String> extractUriParameters(String queryString) {
        Map<String, String> parameters = new HashMap<>();
        if (queryString != null) {
            Pattern pattern = Pattern.compile("([^&=]+)=([^&=]+)");
            Matcher matcher = pattern.matcher(queryString);
            while (matcher.find()) {
                String key = matcher.group(1);
                String value = matcher.group(2);
                parameters.put(key, value);
            }
        }
        return parameters;
    }
    
}


