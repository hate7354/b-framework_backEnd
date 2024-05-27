package com.bellock.framework.core.util;

import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.http.BwHttpAdapter;


/**
 * 외부 시스템과의 통신을 담당.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwInterfaceUtil {
	private static final Logger logger = 
			LoggerFactory.getLogger(BwInterfaceUtil.class);

	/**
	 * 주어진 외부 시스템 URL에 요청을 보내고, 해당 요청에 대한 응답을 받아옴. 
	 * 요청 파라미터는 dataMap에 저장된 맵으로 지정.
	 *
	 * @param invokeUrl 외부 시스템의 URL
	 * @param dataMap 요청 파라미터 맵
	 * @return 외부 시스템으로부터 받은 응답 본문
	 */
	public String processRun(String invokeUrl, Map<String, String> dataMap) {
		BwHttpAdapter adapter = new BwHttpAdapter(invokeUrl);

		// parameter Setting
        if (dataMap != null) {
		    adapter.setRequestParamMap(dataMap);
        }

		// 연동후 처리용
		HttpResponse res = null;
		String responseBody = null;

		// 연동 처리 및 예외처리
		try {
			res = adapter.executeGet();
			responseBody = EntityUtils.toString(res.getEntity(), BwHttpAdapter.DEFAULT_CHARACTER_SET);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION);
		}

		// 결과 상태값 확인
		int httpStatus = (res.getStatusLine().getStatusCode());
		if (httpStatus != BwHttpAdapter.HTTP_SUCCESS_CODE) {
			logger.info("HTTP status: {}, Body: {}", httpStatus, responseBody);
		}

		return responseBody;
    }

}


