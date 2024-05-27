package com.bellock.framework.core.base;

import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.lang.Nullable;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;
import com.bellock.framework.core.http.BwHttpClientWrapper.HTTP_METHOD;
import com.bellock.framework.core.http.impl.BwHttpClientWrapperImpl;
import com.bellock.framework.core.map.BwObjectMap;
import com.bellock.framework.core.map.BwStringMap;

import static com.bellock.framework.core.constant.BwConstants.ObjectPool.PropKey.Placeholder.*;


/**
 * RESTFull API의 기능을 구현한 베이스 클래스.<p>
 * 자식 클래스인 서비스 클래스의 외부 통신을 위해 메서드들을 정의한다.
 * 
 * @since 2024.03, 나인석, 최초작성
 * @since 2024.04, 나인석, 최적화
 */
public abstract class BwAbstractComponent extends BwAbstractBaseComponent {

	/**
	 * 리소스의 효율적 관리 및 성능 즉 네트워크 
	 * 연결에 소요되는 비용을 고려해 Object Pool을 사용한다.<p>
	 * 외부와 연동이 많이 발생할 경우 최소, 최대로 유지하는 객체를 조정이 필요.<p>
	 * 객체의 수는 properties 파일에 저장해 관리하기로 한다.
	 */
	private GenericObjectPoolConfig<BwHttpClientWrapperImpl> config = null;
	private GenericObjectPool<BwHttpClientWrapperImpl> objectPool = null;
	@BwSetField(MAXTOTAL_DEF)
	private int objectMaxTotal;
	@BwSetField(MAXIDLE_DEF)
	private int objectMaxIdle;
	@BwSetField(MINIDLE_DEF)
	private int objectMinIdle;


	/**
	 * 외부서버와 연동하는 메서드.<p>
	 * 특정 URI에 RESTFull 방식으로 request를 보내고 스트링으로 결과를 받는다.
	 * 
	 * @param method GET/POST/PUT/DELETE 방식중 하나
	 * @param uri 접속 URI
	 * @param paramMap 파라메터 맵 객체
	 * @param pathMap URI에 확장 파라메터가 있는 경우 대치될 Map 객체
	 * @return 응답받은 스트링 객체
	 * @throws BwException
	 * @see {@link BwHttpClientWrapperImpl#executeAsString(HTTP_METHOD, String, BwStringMap, BwStringMap, BwStringMap, BwObjectMap, java.net.CookieStore)}
	 */
	protected String sendRequest(HTTP_METHOD method, String uri, 
			@Nullable BwStringMap paramMap, @Nullable BwStringMap pathMap) {
		try {
			BwHttpClientWrapperImpl client = getHttpClientWrapper();
			String result = null;
			try {
				result = client.executeAsString(
						method, 
						uri, 
						paramMap, 
						pathMap, 
						null, 
						null, 
						null
					);
			} catch (Exception e) {
				logger.error("{}", e.getMessage(), e);
			} finally {
				if (client != null) {
					objectPool.returnObject(client);
				}
			}
			return result;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * 외부서버와 연동하는 메서드.<p>
	 * 특정 URI에 RESTFull 방식으로 request를 보내고 설정한 특정 클래스 타입의 객체로 결과를 받는다.
	 * 
	 * @param method GET/POST/PUT/DELETE 방식중 하나
	 * @param uri 접속 URI
	 * @param paramMap 파라메터 맵 객체
	 * @param pathMap URI에 확장 파라메터가 있는 경우 대치될 Map 객체
	 * @param clazz XML 데이터를 역직렬화하기 위한 클래스
	 * @param key 역직렬화 클래스와 매핑할 매핑명
	 * @return 지정한 클래스 객체
	 * @throws BwException
	 * @see {@link BwHttpClientWrapperImpl#executeAsObject(HTTP_METHOD, String, BwStringMap, BwStringMap, BwStringMap, BwObjectMap, java.net.CookieStore, Class, String)}
	 */
	protected <T> T sendRequest(HTTP_METHOD method, String uri, 
			@Nullable BwStringMap paramMap, @Nullable BwStringMap pathMap, Class<T> clazz, String key) {
		try {
			BwHttpClientWrapperImpl client = getHttpClientWrapper();
			T result = null;
			try {
				result = client.executeAsObject(
						method, 
						uri, 
						paramMap, 
						pathMap, 
						null, 
						null, 
						null, 
						clazz, 
						key
					);
			} catch (Exception e) {
				logger.error("{}", e.getMessage(), e);
			} finally {
				if (client != null) {
					objectPool.returnObject(client);
				}
			}
			return result;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * 외부서버와 연동하는 메서드.<p>
	 * 특정 URI에 RESTFull 방식으로 request를 보내고 ObjectMap 타입의 맵 객체로 결과를 받는다.<p>
	 * 해당 메서드는 JSON 타입의 스트링으로 결과 데이터를 받은 후 ObjectMap 타입의 객체로 변환한다.
	 * 
	 * @param method GET/POST/PUT/DELETE 방식중 하나
	 * @param uri 접속 URI
	 * @param paramMap 파라메터 맵 객체
	 * @param pathMap URI에 확장 파라메터가 있는 경우 대치될 Map 객체
	 * @return ObjectMap 타입의 맵 객체
	 * @throws BwException
	 * @see {@link BwHttpClientWrapperImpl#executeAsJSON(HTTP_METHOD, String, BwStringMap, BwStringMap, BwStringMap, BwObjectMap, java.net.CookieStore)}
	 */
	protected BwObjectMap sendRequestJson(HTTP_METHOD method, String uri, 
			@Nullable BwStringMap paramMap, @Nullable BwStringMap pathMap) {
		try {
			BwHttpClientWrapperImpl client = getHttpClientWrapper();
			BwObjectMap result = null;
			try {
				result = client.executeAsJSON(
						method, 
						uri, 
						paramMap, 
						pathMap, 
						null, 
						null, 
						null
					);
			} catch (Exception e) {
				logger.error("{}", e.getMessage(), e);
			} finally {
				if (client != null) {
					objectPool.returnObject(client);
				}
			}
			return result;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HttpClientWrapper 객체를 생성한다.<p>
	 * 성능 향상을 위해 Object Pool에 있는 경우 객체를 대여 받는다.<p>
	 * 객체의 반환은 대여 받은 메서드에서 반환 처리한다.
	 * 
	 * @return HttpClientWrapper 객체
	 * @throws BwException
	 */
	public BwHttpClientWrapperImpl getHttpClientWrapper() {
		try {
			if (config == null) {
				config = new GenericObjectPoolConfig<>();
				config.setMaxTotal(objectMaxTotal);
				config.setMaxIdle(objectMaxIdle);
				config.setMinIdle(objectMinIdle);

				ObjectFactory factory = new ObjectFactory();
				objectPool = new GenericObjectPool<>(factory, config);
			}

			BwHttpClientWrapperImpl httpClientWrapper = null;
			if (objectPool != null) {
				try {
					httpClientWrapper = objectPool.borrowObject();
				} catch (Exception e) {
					logger.error("{}", e.getMessage(), e);
				}
			}

			if (httpClientWrapper == null) {
				httpClientWrapper = new BwHttpClientWrapperImpl();
			} else {
				if (isDevMode()) {
					httpClientWrapper.setDebug(true);
				} else if (isTestMode()) {
					httpClientWrapper.setDebug(false);
				}
			}
			return httpClientWrapper;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.RESTFULL_EXCEPTION, e);
		}
	}

	/**
	 * HttpClientWrapperImpl HTTP 통신 클래스의 Object Factory 클래스.
	 * 
	 * @since 2024.05, 나인석, 최초작성
	 */
	private class ObjectFactory extends BasePooledObjectFactory<BwHttpClientWrapperImpl> {
		/**
		 * 새로운 HttpClientWrapperImpl 인스턴스 생성.
		 * 
		 * @return HttpClientWrapperImpl 객체
		 * @throws Exception
		 */
		@Override
		public BwHttpClientWrapperImpl create() throws Exception {
			return new BwHttpClientWrapperImpl();
		}

		/**
		 * HttpClientWrapperImpl PooledObject로 래핑하여 반환.
		 * 
		 * @param obj HttpClientWrapperImpl 객체
		 * @return DefaultPooledObject 객체
		 */
		@Override
		public PooledObject<BwHttpClientWrapperImpl> wrap(BwHttpClientWrapperImpl obj) {
			return new DefaultPooledObject<>(obj);
		}

		/**
		 * HttpClientWrapperImpl 소멸 시 수행할 작업.
		 * 
		 * @param p PooledObject<HttpClientWrapperImpl> 객체
		 * @throws Exception
		 */
		@Override
    	public void destroyObject(PooledObject<BwHttpClientWrapperImpl> p) throws Exception {
			// HttpClientWrapperImpl 객체가 소멸할때 정리할 부분이 있으면 
			// 이 부분에서 처리하면 된다. 현재까지는 없어 바로 super 실행.
			// 예:
			// HttpClientWrapperImpl obj = p.getObject();
			// obj.HttpClientWrapperImpl의 clean 메서드

			super.destroyObject(p);
		}

	}

}


