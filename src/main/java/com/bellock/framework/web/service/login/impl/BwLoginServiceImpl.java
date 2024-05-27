package com.bellock.framework.web.service.login.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bellock.framework.core.base.BwAbstractService;
import com.bellock.framework.core.constant.BwConstants.LoginSvc.PropKey;
import com.bellock.framework.core.constant.BwConstants.LoginSvc.Const;
import com.bellock.framework.core.constant.BwConstants.MapKey.Parameter;
import com.bellock.framework.core.map.BwMap;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.session.BwSessionHandler;
import com.bellock.framework.web.service.login.BwLoginMapper;
import com.bellock.framework.web.service.login.BwLoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


/**
 * 로그인 처리 서비스.
 * 
 * @since 2024.04, 나인석, 최초작성
 * @since 2024.06, 나인석, 공통기능에 맞게 수정
 */
@Service
public class BwLoginServiceImpl extends BwAbstractService implements BwLoginService {

    /** 로그인 맵퍼 객체 */
	@Autowired
	private BwLoginMapper loginMapper;


    /**
     * 사용자정보 조회.
     * @param paramMap BwObjectMap 개체
     * @return int, 성공 0, 그렇지 않으면 실패횟수, 계정이 잠김 경우 -1, 계정이 없는 경우 -2
     * @throws Exception
     */
    @Override
    public int selectByUsrInfo(HttpServletRequest request, BwObjectMap paramMap) throws Exception {
        BwObjectMap param = new BwObjectMap();

        if (paramMap.containsKey(Parameter.LOGIN)) {
            // 로그인 처리인 경우 <===  공통 모듈 개발시 변경
            param.put("infoType", "login");
            param.put("interFlag", "false");
            
            if (paramMap.containsKey("usrId")) {
                param.put("usrId", paramMap.get("usrId"));
            }
            
            param.put("usrLgn", paramMap.get("usrLgn"));
            // Salt 된 정보여야 함.
            param.put("password", paramMap.get("password"));
        } else {
            // 단순 사용자 정보 조회
            param.remove("infoType");
            param.remove("interFlag");
            
            if (paramMap.containsKey("usrId")) {
                param.put("usrId", paramMap.get("usrId"));
            }
            if (paramMap.containsKey("usrLgn")) {
                param.put("usrLgn", paramMap.get("usrLgn"));
            }
        }

        BwMap userMapData = loginMapper.selectByUsrInfo(param);

        // 쿼리된 결과를 통해 정상처리, 오류처리를 한다
        // 오류 처리는 계정이 없거나, 비밀번호 오류, 계정이 잠기 것으로 구분해서 처리한다
        
        final int MAX_FAIL_CNT = getConfig().getInt(PropKey.LOGIN_LOCK_CNT, Const.LOCKED_MAXCNT_INT);

        if (userMapData != null) {
            // 비밀번호 오류 카운트가 0이 아닌 경우, 비밀번호 오류 카운트를 리셋 처리.
            int lockedCount = Integer.parseInt(userMapData.get("failCnt").toString());
            if (lockedCount != 0) {
                if (lockedCount >= MAX_FAIL_CNT) {
                    // 로그인에 성공했지만, 이미 계정이 잠긴 경우
                    return Const.LOCKED_INT;
                }

                param.clear();
                param.put("usrLgn", paramMap.get("usrLgn"));
                param.put("failCnt", 0);
                loginMapper.updateFailCnt(param);
            }

            // 세션 중복 체클르하고, 세션에 정보를 설정한다.
            BwSessionHandler.sessionPreventDuplication(
                "usrLgn", 
                userMapData.get("usrLgn").toString()
            );

            HttpSession session = request.getSession();
            session.setAttribute("usrNm", userMapData.get("usrNm").toString());
            session.setAttribute("usrLgn", userMapData.get("usrLgn").toString());
            session.setAttribute("usrId", userMapData.get("usrId").toString());
            session.setAttribute("dptNm", userMapData.get("dptNm").toString());
            session.setAttribute("dptId", userMapData.get("dptId").toString());
            session.setAttribute("authId", userMapData.get("authId").toString());
            session.setAttribute("authCd", userMapData.get("authCd").toString());
            session.setAttribute("memNo", userMapData.get("memNo").toString());

            return Const.SUCCEED_INT;
        } else {
            // 세부적인 오류 정보를 제공할 수 있도록 해당 ID 있는지 다시 확인해야 함.
            // 이번 조회는 password는 제외, 즉 ID로만 조회한다.
            param.clear();
            param.put("usrLgn", paramMap.get("usrLgn"));
            userMapData = loginMapper.selectByUsrInfo(param);

            if (userMapData != null) { // 비밀번호가 틀린 경우
                // 패스워드 오류 카운트 +1 증가
                // 패스워드 오류 카운트가 5이면 증가 없이 LOCKED_INT를 반환한다
                // 계정이 잠긴 경우 관리를 통해 계정을 풀수 있도록 처리하며
                // 사용자에게 메세지 팝업을 통해 인지시키도록 한다

                int lockedCount = Integer.parseInt(userMapData.get("failCnt").toString());

                if (lockedCount >= MAX_FAIL_CNT) {
                    return Const.LOCKED_INT;
                } else {
                    // 비밀번호 오류 증가 처리
                    // 환경파일에 설정된 비밀번호 오류 MAX CNT가 된 경우
                    // 계정을 잠그는 상태값을 설정한다.

                    lockedCount += 1;
                    param.clear();
                    param.put("usrLgn", paramMap.get("usrLgn"));
                    param.put("failCnt", lockedCount);

                    if (lockedCount == MAX_FAIL_CNT) {
                        param.put("statusCd", paramMap.get("US003000")); // 계정 잠김 코드 설정
                    }
                    loginMapper.updateFailCnt(param);

                    if (lockedCount == MAX_FAIL_CNT) {
                        return Const.LOCKING_INT;
                    } else {
                        return lockedCount; // 오류 횟수 반환
                    }
                }
            } else {
                return Const.NOTFOUND_INT;
            }
        }
    }

}


