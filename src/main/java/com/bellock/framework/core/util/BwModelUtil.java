package com.bellock.framework.core.util;

import java.lang.reflect.Field;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bellock.framework.core.map.BwMap;
import com.bellock.framework.core.model.BwModelBase;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * 모델 utility 클래스
 * DTO와 VO의 필드를 JSON 형식의 스트링으로 변환
 * DTO와 VO의 필드를 BellockMap 형식으로 변환
 * BellockModelUtil의 모든 메서드는 static으로 선언되어 있음.
 * 
 * @since 2024.04, 나인석, 최초작성
 */
public class BwModelUtil {
	static final Logger logger = LoggerFactory.getLogger(BwModelUtil.class);

	/**
	 * DTO 혹은 VO 필드를 JSON 스트링으로 변환
	 * 
	 * @param obj VO 혹은 DTO 인스턴스
	 * @return 변환된 Json string
	 */
	public static String toJsonString(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(obj);
		} catch (Exception e) {
			logger.error("Model을 Json 스트링으로 변환 실패!!");
			return null;
		}
	}
	
	/**
	 * DTO 혹은 VO Array List를 JSON 스트링으로 변환
	 * 
	 * @param arrayList
	 * @return 변환된 Json string
	 */
	public static <T extends BwModelBase> String toJsonString(ArrayList<T> arrayList) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.writeValueAsString(arrayList);
		} catch (Exception e) {
			logger.error("Array에 담긴 Model을 Json 스트링으로 변환 실패!!");
			return null;
		}
	}
	
	/**
	 * 해당 Model의 모든 필드가 BellockMap으로 변환된다
	 * 
	 * @param obj VO 혹은 DTO 인스턴스
	 * @return 모든 필드가 변환된 BellockMap 인스턴스가 반환
	 */
	public static BwMap toBellockMap(Object obj) {
		BwMap bellockMap = new BwMap();
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field field : fields) {
			field.setAccessible(true);
			try {
				bellockMap.put(field.getName(), field.get(obj));
			} catch (IllegalAccessException e) {
				logger.error("BellockMap put 메서드 처리 실패!!");
			}
		}
		return bellockMap;
	}
	
	/**
	 * ArrayList에 담긴 model을 ArrayList에 HashMap으로 담아 반환
	 * 
	 * @param <T> ModelClass
	 * @param arrayList
	 * @return ArrayList<HashMap> instance 반환
	 */
	public static <T extends BwModelBase> ArrayList<BwMap> toBellockMap(ArrayList<T> arrayList) {
		ArrayList<BwMap> bellockMapList = new ArrayList<BwMap>();
		
		for (T model : arrayList) {
			BwMap bellockMap = BwModelUtil.toBellockMap(model);
			bellockMapList.add(bellockMap);
		}
		return bellockMapList;
	}
	
}


