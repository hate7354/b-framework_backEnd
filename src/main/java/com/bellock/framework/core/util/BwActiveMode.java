package com.bellock.framework.core.util;

import org.springframework.stereotype.Component;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.constant.BwConstants.ActiveProfile;
import static com.bellock.framework.core.constant.BwConstants.ActiveProfile.Const.*;


/**
 * 어플리케이션의 실행모드를 반환 클래스.
 * <p>
 * {@code spring.profiles.active}프로퍼티 값을 주입받기 위해 빈으로 생성한다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Component
public class BwActiveMode {
    /** spring.profiles.active 프로퍼티 값을 주입 */
   	@BwSetField(ActiveProfile.PropKey.Placeholder.ACTIVE_DEF)
	private static String activeProfile;


    /**
     * 프로퍼티 값을 반환.
     * @return {@code spring.profiles.active} 프로퍼티 값
     */
	private static String getProfileActive() {
		return activeProfile;
	}

    /**
     * 개발 모드인지 확인.
     * @return 개발 모드이면 true, 그렇지 않으면 false
     */
    public static boolean isDevMode() {
        return getProfileActive().endsWith(DEV_STR);
    }

    /**
     * 테스트 모드인지 확인.
     * @return 테스트 모드이면 true, 그렇지 않으면 false
     */
    public static boolean isTestMode() {
        return getProfileActive().endsWith(TEST_STR);
    }

    /**
     * 운영 모드인지 확인.
     * @return 운영 모드이면 true, 그렇지 않으면 false
     */
    public static boolean isProdMode() {
        return getProfileActive().endsWith(PROD_STR);
    }

}


