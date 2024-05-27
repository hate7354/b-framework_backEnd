package com.bellock.framework.web.service.login;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.bellock.framework.core.map.BwMap;
import com.bellock.framework.core.map.BwObjectMap;


/**
 * 로그인 서비스 Mapper Interface
 * 
 * @since 2024.03, 나인석, 최초작성
 */
@Repository
@Mapper
public interface BwLoginMapper {

    /**
     * 사용자정보 조회.
     * @param paramMap BwObjectMap 개체
     * @return 조회된 사용자 정보 맵
     * @throws SQLException The SQL exception
     */
    public BwMap selectByUsrInfo(BwObjectMap paramMap) throws SQLException;

    /**
     * 비밀번호 오류 카운터 업데이트
     * @param paramMap BwObjectMap 개체
     * @throws SQLException The SQL exception
     */
    public void updateFailCnt(BwObjectMap paramMap) throws SQLException;
}
