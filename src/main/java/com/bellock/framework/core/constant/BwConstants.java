package com.bellock.framework.core.constant;


/**
 * 프레임워크 전반에 사용되는 상수들을 정우한 클래스.<p>
 * <p>
 * 각 상수들은 클래스로 그룹핑하여 정의하며, 각 클래스 안에서도 상수의<p>
 * 성격에 따라 세분화된 클래스로 구분하여 정의한다.<p>
 * 
 * @since 2024.03, 나인석, 최초작성.
 * @since 2024.05, 나인석, 클래스 구조 변경.
 */
public class BwConstants {
	/**
	 * 어플케이션 런타임 프로파일 관련 상수 정의 클래스.
	 */
	public class ActiveProfile {
		public class PropKey {
			// 스프링 프로파일 프로퍼티 키
			public static final String ACTIVE = "spring.profiles.active";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// 스프링 프로파일 프로퍼티 키 for @BwSetField
				public static final String ACTIVE = "${" + PropKey.ACTIVE + "}";
				//스프링 프로파일 디폴트 프로퍼티 키 for @BwSetField
				public static final String ACTIVE_DEF = "${" + PropKey.ACTIVE + ":prod}";
			}
		}
		public class Const {
			// 어플리케이션 테스트 모드 - Test mode
			public static final String TEST_STR = "test";
			// 어플리케이션 개발 모드 - Development mode
			public static final String DEV_STR = "dev";
			// 어플리케이션 운영 모드 - Production mode
			public static final String PROD_STR = "prod";
		}
	}

	/**
	 * 세션 관련 상수 정의 클래스.
	 */
	public class Session {
		public class PropKey {
			// 세션타임 아웃 사용 여부 설정 프로퍼티 키
			public static final String USED_TIMEOUT = "bellock.session.timeout.enabled";
			// 프레임워크 세션 타임아웃 시간 설정 프로퍼티 키
			public static final String TIMEOUT = "server.servlet.session.timeout";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// 세션타임 아웃 사용 여부 설정 프로퍼티 키 for @BwSetField
				public static final String USED_TIMEOUT = "${" + PropKey.USED_TIMEOUT + "}";
				// 프레임워크 세션 타임아웃 시간 설정 프로퍼티 키 for @BwSetField
				public static final String TIMEOUT = "${" + PropKey.TIMEOUT + "}";

				// 세션타임 아웃 사용 여부 설정 프로퍼티 키 default for @BwSetField
				public static final String USED_TIMEOUT_DEF = "${" + PropKey.USED_TIMEOUT + ":N}";////////
				// 프레임워크 세션 타임아웃 시간 설정 프로퍼티 키 for @BwSetField
				public static final String TIMEOUT_DEF = "${" + PropKey.TIMEOUT + ":1800}";
			}
		}
		public class Const {
			// 세션타임 아웃시 클라이언트로 전송하는 스트링
			public static final String TIMEOUT_PACKET_STR = "socketMsg_closeSession";
			// 세션타임 아웃 전 여유 시간 (2분)
			public static final int SLACK_TIME_INT = 120;
			// 소켓 세션 속성 키 스트링
			public static final String KEY_SOCKET_STR = "socket";
			// 세션의 사용자 구분 키 스트링
			public static final String KEY_SESSION_UNIQ_STR = "usrLgn";
			// 세션 체크 타임(duration)
			public static final int DURATION_INT = 30000;
			// 소켓 패스 명
			public static final String SOCKET_PATH_NAME_STR = "/bellockSocketServer";
			// 세션 ID 세션 속성 키 스트링
			public static final String KEY_SESSION_ID_STR = "sessionId";
			// 세션 유효성 검사 세션 속성 키
			public static final String KEY_SESSION_NULL_CHK_STR = "usrId";
		}
	}

	/**
	 * 파라메터와 세션속성의 키 스트링 정의 클래스.
	 */
	public class MapKey {
		public class Parameter {
			// 사용자 아이디 파라메터 키
			public static final String USER_LGN ="loginUsrLgn";
			// 사용자 아이디 ID 파라메터 키
			public static final String USER_ID ="loginUsrId";
			// 사용자 이름 파라메터 키
			public static final String USER_NM = "loginUsrNm";
			// 부서 아이디 파라메터 키
			public static final String DPT_ID = "loginDptId";
			// 부서 이름 파라메터 키
			public static final String DPT_NM = "loginDptNm";
			// 사원번호 파라메터 키
			public static final String EMPL_ID = "loginMemNo";
			// 권한 아이디 파라메터 키
			public static final String AUTH_ID = "loginAuthId";
			// 권한 코드 파라메터 키
			public static final String AUTH_CD = "loginAuthCd";
			// 권한 이름 파라메터 키
			public static final String AUTH_NM = "loginAuthNm";
			// 등록자 아이디 파라메터 키
			public static final String REGIST_ID = "frstRegistId";
			// 수정자 아이디 파라메터 키
			public static final String UPDATE_ID = "lastUpdateId";
			// 접속 IP 파라메터 키
			public static final String ACCESS_IP = "accessIp";
			// End-Point Paths 파라메터 키
			public static final String REQUEST_URL = "requestUri";
			// login user-name 파라메터 키
			public static final String USERNAME = "userName";
			// login user-password 파라메터 키
			public static final String PASSWORD = "password";
			// login 파라메터 키
			public static final String LOGIN = "login";
			// 
		}
		public class Attribute {
			// 세션에 저장된 사용자 아이디 속성 키
			public static final String USER_LGN = "usrLgn";
			// 세션에 저장된 사용자 아이디 ID 속성 키
			public static final String USER_ID = "usrId";
			// 세션에 저장된 사용자 이름 속성 키
			public static final String USER_NM = "usrNm";
			// 세션에 저장된 부서 아이디 속성 키
			public static final String DPT_ID = "dptId";
			// 세션에 저장된 부서 이름 속성 키
			public static final String DPT_NM = "dptNm";
			// 세션에 저장된 사원번호 속성 키
			public static final String EMPL_ID = "memNo";
			// 세션에 저장된 권한 아이디 속성 키
			public static final String AUTH_ID = "authId";
			// 세션에 저장된 권한 코드 속성 키
			public static final String AUTH_CD = "authCd";
			// 세션에 저장된 권한 이름 속성 키
			public static final String AUTH_NM = "authNm";
			// 세션에 저장된 등록자 아이디 속성 키
			public static final String REGIST_ID = "usrId";
			// 세션에 저장된 수정자 아이디 속성 키
			public static final String UPDATE_ID = "usrId";
		}
	}

	/**
	 * 예외처리와 관련한 상수 정의 클래스.
	 */
	public class Exception {
		public class PropKey {
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
			}
		}
		public class Const {
			// 4XX 번대 에러 발생시 End-Point
			public static final String URI_4XXERR_STR = "/bellock4xxErrorPage";
			// 4xx번대 에러 발생시 리다이렉트하기 위해 Get 방식 통신시 보내는 파라메터 일부
			public static final String STATUS_CODE_STR = "?statusCode=";
		}
	}

	/**
	 * 어브젝트 풀과 관련된 상수 정의 클래스
	 */
	public class ObjectPool {
		public class PropKey {
			// 어브젝트 풀의 MAX 어브젝트 갯수 프로퍼티 키
			public static final String MAXTOTAL = "bw.object.max.total";
			// 어브젝트 풀의 MAX 어브젝트 Idle 갯수 프로퍼티 키
			public static final String MAXIDLE = "bw.object.max.idle";
			// 어브젝트 풀의 MIN 어브젝트 Idle 갯수 프로퍼티 키
			public static final String MINIDLE = "bw.object.min.idle";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// 어브젝트 풀의 MAX 어브젝트 갯수 프로퍼티 키 for @BwSetField
				public static final String MAXTOTAL = "${" + PropKey.MAXTOTAL + "}";
				// 어브젝트 풀의 MAX 어브젝트 Idle 갯수 프로퍼티 키 for @BwSetField
				public static final String MAXIDLE = "${" + PropKey.MAXIDLE + "}";
				// 어브젝트 풀의 MIN 어브젝트 Idle 갯수 프로퍼티 키 for @BwSetField
				public static final String MINIDLE = "${" + PropKey.MINIDLE + "}";
				// 어브젝트 풀의 디폴트 MAX 어브젝트 갯수 프로퍼티 키 for @BwSetField
				public static final String MAXTOTAL_DEF = "${" + PropKey.MAXTOTAL + ":10}";
				// 어브젝트 풀의 디폴트 MAX 어브젝트 Idle 갯수 프로퍼티 키 for @BwSetField
				public static final String MAXIDLE_DEF = "${" + PropKey.MAXIDLE + ":5}";
				// 어브젝트 풀의 디폴트 MIN 어브젝트 Idle 갯수 프로퍼티 키 for @BwSetField
				public static final String MINIDLE_DEF = "${" + PropKey.MINIDLE + ":1}";
			}
		}
		public class Const {
		}
	}

	/**
	 * HTTP 접속 관련 프로처티 키 및 상수 정의 클래스.
	 */
	public class HttpConnect {
		public class PropKey {
			// HttpClient가 동시에 생성할 수 있는 커넥션 최대수.
			public static final String MAX_TOTAL = "bw.connect.max.total";
			// 동일한 호스트(라우트)에 허용되는 최대 연결수.
			public static final String MAX_PER_ROUTER = "bw.connect.max.per.route";
			// Request Timeout 시간 기본 값
			public static final String REQUEST_TIMEOUT = "bw.connect.request.timeout";
			// Character Set (UTF-8)
			public static final String CHARACTER_SET = "bw.connect.character.set";
			// Content Type (text/html)
			public static final String CONTENT_TYPE = "bw.connect.content.type";
			// Debug log display (false)
			public static final String DEBUG = "bw.connect.debug";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// HttpClient가 동시에 생성할 수 있는 커넥션 최대수 for @BwProfile.
				public static final String MAX_TOTAL = "${" + PropKey.MAX_TOTAL + "}";
				// 동일한 호스트(라우트)에 허용되는 최대 연결수 for @BwProfile.
				public static final String MAX_PER_ROUTER = "${" + PropKey.MAX_PER_ROUTER + "}";
				// Request Timeout 시간 기본 값 for @BwProfile.
				public static final String REQUEST_TIMEOUT = "${" + PropKey.REQUEST_TIMEOUT + "}";
				// Character Set for @BwProfile.
				public static final String CHARACTER_SET = "${" + PropKey.CHARACTER_SET + "}";
				// Content Type (text/html) for @BwProfile.
				public static final String CONTENT_TYPE = "${" + PropKey.CONTENT_TYPE + "}";
				// Debug log display (false) for @BwProfile.
				public static final String DEBUG = "${" + PropKey.DEBUG + "}";
				// 디폴트 HttpClient가 동시에 생성할 수 있는 커넥션 최대수 for @BwProfile.
				public static final String MAX_TOTAL_DEF = "${" + PropKey.MAX_TOTAL + ":100}";
				// 디폴트 동일한 호스트(라우트)에 허용되는 최대 연결수 for @BwProfile.
				public static final String MAX_PER_ROUTER_DEF = "${" + PropKey.MAX_PER_ROUTER + ":30}";
				// 디폴트 Request Timeout 시간 기본 값 for @BwProfile.
				public static final String REQUEST_TIMEOUT_DEF = "${" + PropKey.REQUEST_TIMEOUT + ":30000}";
				// Character Set for 기본 값 for @BwProfile.
				public static final String CHARACTER_SET_DEF = "${" + PropKey.CHARACTER_SET + ":UTF-8}";
				// Character Set for 기본 값 for @BwProfile.
				public static final String CONTENT_TYPE_DEF = "${" + PropKey.CONTENT_TYPE + ":text/html}";
				// Debug log display (false) 기본 값 for @BwProfile.
				public static final String DEBUG_DEF = "${" + PropKey.DEBUG + ":false}";
			}
		}
		public class Const {
			// HttpClient가 동시에 생성할 수 있는 커넥션 기본 최대수.
			public static final int DEF_MAX_TOTAL_INT = 100;
			// 동일한 호스트(라우트)에 허용되는 최대 기본 연결수.
			public static final int DEF_MAX_PER_ROUTER_INT = 30;
			// Request Timeout 시간 기본 값
			public static final int DEF_REQUEST_TIMEOUT_INT = 30000;
			// 텍스트 엔티티 타입 파라메터 키 값
			public static final String ENTITY_TEXT_STR = "entity_text";
			// JSON 엔티티 타입 파라메터 키 값
			public static final String ENTITY_JSON_STR = "entity_json";
			// 바이너리 엔티티 타입 파라메터 키 값
			public static final String ENTITY_INPUT_STREAM_STR = "entity_input_stream";
		}
	}

	/**
	 * MIME 타입과 관련한 상수 정의 클래스.
	 */
	public class MimeType {
		public class PropKey {
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
			}
		}
		public class Const {
			public static final String UTF8_STR = "UTF-8";
			public static final String JSON_STR = "application/json";
			public static final String OCTET_STREAM_STR = "binary/octet-stream";
		}
	}

	/**
	 * Encoding 타입과 관련한 상수 정의 클래스.
	 */
	public class EncodingType {
		public class PropKey {
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
			}
		}
		public class Const {
			public static final String TEXT_HTML_STR = "text/html";
		}
	}

	/**
	 * 다국어 관련 상수 정의 클래스.
	 */
	public class Locale {
		public class PropKey {
			// 다국어 선택 후 쿠키에 저장되는 시간 프로퍼티 키.
			public static final String COOKIE_MAXAGE = "bw.locale.cookie.maxAge";
			// 다국어 디폴트 언어 프로퍼티 키.
			public static final String LANGUAGE = "bw.locale.language";
			// 다국어 디폴트 국가 프로퍼티 키.
			public static final String COUNTRY = "bw.locale.country";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// 다국어 선택 후 쿠키에 저장되는 시간 프로퍼티 키 for @BwSetField.
				public static final String COOKIE_MAXAGE = "${" + PropKey.COOKIE_MAXAGE + "}";
				// 다국어 디폴트 언어 프로퍼티 키 for @BwSetField.
				public static final String LANGUAGE = "${" + PropKey.LANGUAGE + "}";
				// 다국어 디폴트 국가 프로퍼티 키 for @BwSetField.
				public static final String COUNTRY = "${" + PropKey.COUNTRY + "}";
				// 디폴트 다국어 선택 후 쿠키에 저장되는 시간 프로퍼티 키 for @BwSetField.
				public static final String COOKIE_MAXAGE_DEF = "${" + PropKey.COOKIE_MAXAGE + ":604800}";
				// 디폴트 다국어 디폴트 언어 프로퍼티 키 for @BwSetField.
				public static final String LANGUAGE_DEF = "${" + PropKey.LANGUAGE + ":ko}";
				// 디폴트 다국어 디폴트 국가 프로퍼티 키 for @BwSetField.
				public static final String COUNTRY_DEF = "${" + PropKey.COUNTRY + ":KR}";
				// .properties 파일들의 경로 정보 for @BwSetField
				public static final String RESOURCE_LOCATION = "classpath*:/config/**/*.properties";
			}
		}
		public class Const {
			// 한국 언어 상수 값
			public static final String LANGUAGE_KO = "ko";
			// 한국 국가 상수 값
			public static final String COUNTRY_KO = "KR";
			// 미국 언어 상수 값
			public static final String LANGUAGE_US = "en";
			// 미국 국가 상수 값
			public static final String COUNTRY_US = "US";
		}
	}

	/**
	 * RSA 암호화 관련 상수 정의 클래스.
	 */
	public class Rsa {
		public class PropKey {
		}
		public class Const {
			// 세션에 저장되는 RSA private key의 저장 키 이름
			public static final String PRIVATE_KEY_STR = "__privateKey__";
			// RSA Public Key modulus
			public static final String MODULUS_STR = "modulus";
			// RSA Public Key exponent
			public static final String EXPONENT_STR = "exponent";
			// RSA Key Size
			public static final int KEYSIZE_INT = 2048;
		}
	}

	/**
	 * Mail 관련 상수 정의 클래스.
	 */
	public class Mail {
		public class PropKey {
			// 메일 사용여부 프로퍼티 키
			public static final String USED = "bw.mail.used";
			// 보내는 사람 메일 주소 프로퍼티 키
			public static final String SENDER = "bw.mail.sender";
			// 보내는 사람 이름 프로퍼티 키
			public static final String SENDER_NAME = "bw.mail.sender.name";
			// 보내는 사람 메일 암호 프로퍼티 키
			public static final String SENDER_PASSWORD = "bw.mail.password";
			// SMTP TLS Enable/Disable 프로퍼티 키
			public static final String START_TLS_ENABLE = "bw.mail.smtp.starttls.enable";
			// SMTP HOST 프로퍼티 키
			public static final String SMTP_HOST = "bw.mail.smtp.host";
			// SMTP AUTH 프로퍼티 키
			public static final String SMTP_AUTH = "bw.mail.smtp.auth";
			// SMTP PORT 프로퍼티 키
			public static final String SMTP_PORT = "bw.mail.smtp.port";
			// SMTP SSL Enable/Disable 프로퍼티 키
			public static final String SMTP_SSL_ENABLE = "bw.mail.smtp.ssl.enable";
			// SMTP SSL trust 프로퍼티 키
			public static final String SMTP_SSL_TRUST = "bw.mail.smtp.ssl.trust";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				// 메일 사용여부 프로퍼티 키 for @BwSetField.
				public static final String USED = "${" + PropKey.USED + "}";
				// 보내는 사람 메일 주소 프로퍼티 키 for @BwSetField.
				public static final String SENDER = "${" + PropKey.SENDER + "}";
				// 보내는 사람 이름 프로퍼티 키 for @BwSetField.
				public static final String SENDER_NAME = "${" + PropKey.SENDER_NAME + "}";
				// 보내는 사람 메일 암호 프로퍼티 키 for @BwSetField.
				public static final String SENDER_PASSWORD = "${" + PropKey.SENDER_PASSWORD + "}";
				// SMTP TLS Enable/Disable 프로퍼티 키 for @BwSetField.
				public static final String START_TLS_ENABLE = "${" + PropKey.START_TLS_ENABLE + "}";
				// SMTP HOST 프로퍼티 키 for @BwSetField.
				public static final String SMTP_HOST = "${" + PropKey.SMTP_HOST + "}";
				// SMTP AUTH 프로퍼티 키 for @BwSetField.
				public static final String SMTP_AUTH = "${" + PropKey.SMTP_AUTH + "}";
				// SMTP PORT 프로퍼티 키 for @BwSetField.
				public static final String SMTP_PORT = "${" + PropKey.SMTP_PORT + "}";
				// SMTP SSL Enable/Disable 프로퍼티 키 for @BwSetField.
				public static final String SMTP_SSL_ENABLE = "${" + PropKey.SMTP_SSL_ENABLE + "}";
				// SMTP SSL trust 프로퍼티 키 for @BwSetField.
				public static final String SMTP_SSL_TRUST = "${" + PropKey.SMTP_SSL_TRUST + "}";
				// 메일 사용여부 프로퍼티 키 디폴트 for @BwSetField.
				public static final String USED_DEF = "${" + PropKey.USED + ":N}";
				// 보내는 사람 메일 주소 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SENDER_DEF = "${" + PropKey.SENDER + ":XX@XX.com}";
				// 보내는 사람 이름 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SENDER_NAME_DEF = "${" + PropKey.SENDER_NAME + ":XXX}";
				// 보내는 사람 메일 암호 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SENDER_PASSWORD_DEF = "${" + PropKey.SENDER_PASSWORD + ":1234}";
				// SMTP TLS Enable/Disable 프로퍼티 키 디폴트 for @BwSetField.
				public static final String START_TLS_ENABLE_DEF = "${" + PropKey.START_TLS_ENABLE + ":false}";
				// SMTP HOST 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SMTP_HOST_DEF = "${" + PropKey.SMTP_HOST + ":0.0.0.0}";
				// SMTP AUTH 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SMTP_AUTH_DEF = "${" + PropKey.SMTP_AUTH + ":false}";
				// SMTP PORT 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SMTP_PORT_DEF = "${" + PropKey.SMTP_PORT + ":587}";
				// SMTP SSL Enable/Disable 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SMTP_SSL_ENABLE_DEF = "${" + PropKey.SMTP_SSL_ENABLE + ":false}";
				// SMTP SSL trust 프로퍼티 키 디폴트 for @BwSetField.
				public static final String SMTP_SSL_TRUST_DEF = "${" + PropKey.SMTP_SSL_TRUST + ":false}";
			}
		}
		public class Const {
		}
	}

	/**
	 * 로그인 서비스 상수 정의 클래스.
	 */
	public class LoginSvc {
		public class PropKey {
			//
			public static final String LOGIN_LOCK_CNT = "bellock.login.locked.max.cnt";
			// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
			public class Placeholder {
				public static final String LOGIN_LOCK_CNT = "${" + PropKey.LOGIN_LOCK_CNT + ":5}";
			}
		}
		public class Const {
			// 로그인 실패 최재 횟수 상수 값
			public static final int LOCKED_MAXCNT_INT = 5;
			// 로그인 성공 리턴 상수 값
			public static final int SUCCEED_INT = 0;
			// 계정이 이미 잠긴 리턴 상수 값
			public static final int LOCKED_INT = -1;
			// 계정이 이제 잠긴 리턴 상수 값
			public static final int LOCKING_INT = -2;
			// 계정이 없는 리턴 상수 값
			public static final int NOTFOUND_INT = -3;
		}
	}

	/**
	 * 컨트롤러의 엔드포인트 상수 정의 클래스.
	 */
	public class EndPoint {
		// 로그인 시 RSA 암호화와 관련한 상수 정의 클래스.
		public class Rsa {
			public class Get {
				// RSA 암호화를 위한 키 요청 End-Point URL
				public static final String RSAKEY = "/getRSAKey";
			}
			public class Post {
			}
		}
		// 엔드포인트 공통 상수 정의 클래스.
		public class Commons {
			public class Get {
				public static final String ROOT = "/";
				public static final String INDEX = "/index.html";
			}
			public class Post {
			}
		}
		// 로그인 상수 정의 클래스.
		public class Login {
			public class Get {
				public static final String VERIFY = "/login_verify";
			}
			public class Post {
			}
		}
		// 로그아웃 상수 정의 클래스.
		public class Logout {
			public class Get {
				public static final String LOGOUT = "/logOut";
			}
			public class Post {
			}
		}
	}

	/**
	 * 프로퍼티 키 상수를 정의한 클래스.
	 */
	public class PropKey {
		// @BwSetField 어노테이션을 이용할 경우를 위해 상수를 정의한 클래스.
		public class Placeholder {
		}
	}

	/**
	 * 일반 상수를 정의한 클래스.
	 */
	public class Const {
		// Yes 상수 값
		public static final String YES_STR = "Y";
		// No 상수 값
		public static final String NO_STR = "N";
		// ms 단위
		public static final int UNIT_MS_INT = 1000;
		// @BwSetField, @BwProfile, @BwProperty 어노테이션 패턴
		public static final String ANNO_PATTERN_STR = "\\$\\{([^:}]+):?([^}]*)}";
		// REST API URI prefix
		public static final String REST_API_PREFIX_STR = "/api";
		// HTML Tag pattern 상수
		public static final String HTML_TAG_PATTERN_STR = "\\<.*?\\>";
		// TRUE string 상수
		public static final String TRUE_STR = "true";

		
		// 
		public static final String CONTEXT_STR = "context";
		// 
		public static final String DEBUG_STR = "debug";
		//
		public static final String TEST_STR = "test";
		//
		public static final String EMULATOR_STR = "emulator";
	}

}


