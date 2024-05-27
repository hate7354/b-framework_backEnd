package com.bellock.framework.web.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bellock.framework.core.base.BwAbstractController;
import com.bellock.framework.core.constant.BwConstants.MapKey.Attribute;
import com.bellock.framework.core.constant.BwConstants.MapKey.Parameter;
import com.bellock.framework.core.constant.BwConstants.Const;
import com.bellock.framework.core.constant.BwConstants.EndPoint.Rsa;
import com.bellock.framework.core.constant.BwConstants.LoginSvc;
import com.bellock.framework.core.constant.BwConstants.EndPoint.Login;
import com.bellock.framework.core.constant.BwConstants.EndPoint.Logout;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.response.BwResponse;
import com.bellock.framework.core.response.BwResponseCode;
import com.bellock.framework.core.session.BwSessionManager;
import com.bellock.framework.core.util.BwEncryptionUtil;
import com.bellock.framework.core.util.BwParamUtil;
import com.bellock.framework.core.util.BwRSACryptoUtil;
import com.bellock.framework.web.service.login.BwLoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;



@Controller
public class BwLoginController extends BwAbstractController {
	@Autowired
	private BwLoginService loginService;


    @RequestMapping(value = Rsa.Get.RSAKEY, method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public BwResponse getRSAKey(HttpServletRequest request) {
		try {
			HashMap<String, Object> keyData = BwRSACryptoUtil.RSAKeyGenerator(request);
			return new BwResponse(BwResponseCode.OK, keyData);
		} catch (Exception e) {
			return new BwResponse(BwResponseCode.FAIL_GEN_RSAKEY);
		}
    }

    @RequestMapping(value = Login.Get.VERIFY, method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public BwResponse loginVerify(
		HttpServletRequest request, HttpServletResponse response,
		@RequestBody(required = false) HashMap<String, Object> jsonParams) throws Exception {
        try {
			HashMap<String, Object> paramMap = new HashMap<String, Object>();
			BwParamUtil paramUtil = new BwParamUtil();
			paramMap = paramUtil.getParamMap(request, jsonParams);
			
			String userName = paramMap.get(Parameter.USERNAME).toString();
			String passWord = paramMap.get(Parameter.PASSWORD).toString();
			
			userName = BwRSACryptoUtil.decryptData(request, userName);
			passWord = BwRSACryptoUtil.decryptData(request, passWord);

			// table 에서 사용자 정보 파악, 적용시 solt를 적용한 base64 string 으로 검증
			passWord = BwEncryptionUtil.encryptSHA256(userName + passWord); // for salt

			BwObjectMap param = new BwObjectMap();
			param.put(Parameter.LOGIN, Const.TRUE_STR);
			param.put(Attribute.USER_LGN, userName);
			param.put(Parameter.PASSWORD, passWord);

			// 로그인 사용자 정보 조회
			// 성공인 경우 전달받은 Response instance를 그대로 클라이언트로 반환
			// 그리고 session 정보를 설정한다
            int resultCode = loginService.selectByUsrInfo(request, param);

            if (resultCode == LoginSvc.Const.SUCCEED_INT) {
                return new BwResponse(BwResponseCode.OK);
            } else if (resultCode == LoginSvc.Const.NOTFOUND_INT) {
                return new BwResponse(BwResponseCode.FAIL_USER_NOTFOUND);
            } else if (resultCode == LoginSvc.Const.LOCKING_INT) {
                return new BwResponse(BwResponseCode.FAIL_ACCOUND_IS_LOCKING_5);
            } else if (resultCode == LoginSvc.Const.LOCKED_INT) {
                return new BwResponse(BwResponseCode.FAIL_ACCOUND_IS_LOCKED);
            } else {
                return new BwResponse(
                    BwResponseCode.FAIL_INVALID_PSWD.code(), 
                    BwResponseCode.FAIL_INVALID_PSWD.message() + " (비밀번호 오류:" + resultCode + "회)"
                );
            }
        } catch (Exception e) {
            return new BwResponse(BwResponseCode.FAIL, e);
        }
    }

    /**
     * 로그아웃 엔드-포인트 컨트롤러.
     * 
     * @param request HttpServletRequest 객체
     * @return BwResponse 객체
     * @throws Exception
     */
    @RequestMapping(value = Logout.Get.LOGOUT, method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
	public BwResponse Response(HttpServletRequest request)  throws Exception {
		try {
			HttpSession session = request.getSession();
			BwSessionManager.removeSession(session);
			session.invalidate();
			return new BwResponse(BwResponseCode.OK);
		} catch (Exception e) {
			return new BwResponse(BwResponseCode.FAIL, e);
		}
	}

}
