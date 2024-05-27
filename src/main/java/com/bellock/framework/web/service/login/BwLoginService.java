package com.bellock.framework.web.service.login;

import com.bellock.framework.core.map.BwObjectMap;

import jakarta.servlet.http.HttpServletRequest;


/**
 * 로그인 서비스 Interface
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public interface BwLoginService {

    /**
     * 사용자정보 조회.
     * @param paramMap BwObjectMap 개체
     * @return int, 성공 0, 그렇지 않으면 실패횟수, 계정이 잠김 경우 -1
     * @throws Exception
     */
    public int selectByUsrInfo(HttpServletRequest request, BwObjectMap paramMap) throws Exception;
}
