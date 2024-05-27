package com.bellock.framework.core.map;

import org.apache.commons.collections4.map.ListOrderedMap;

import com.bellock.framework.core.util.BwCamelcaseUtil;


/**
 * Camel Case 표기법 변환 처리를 포함하는 Map 확장 클래스
 * 
 * @history: 2024.03, 최초작성
 */
public class BwMap extends ListOrderedMap<Object, Object> {

	private static final long serialVersionUID = -7656942167514342257L;

	/**
	 * key 에 대하여 Camel Case 변환하여 super.put
	 * (ListOrderedMap) 을 호출한다.
	 * @param key
	 *        - '_' 가 포함된 변수명
	 * @param value
	 *        - 명시된 key 에 대한 값 (변경 없음)
	 * @return previous value associated with specified
	 *         key, or null if there was no mapping for
	 *         key
	 */
	@Override
    public Object put(Object key, Object value) {
        return super.put(BwCamelcaseUtil.toSnakeCase((String)key), value);
    }
}


