package com.bellock.framework.core.model;

import java.util.ArrayList;

import com.bellock.framework.core.map.BwMap;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * DTO Base Class.
 * 어플리케이션에서 DTO 클래스를 생성할 때 상속 받는 클래스.
 * 
 * BellockMap 객체를 각종 DTO 객체로 변환하는 기능을 제공한다.
 * 
 * @history: 2024.04, 나인석, 최초작성
 */
public class BwBaseModelDTO extends BwModelBase {
	
	/**
	 * BellockMap을 DTO 객체로 변환
	 * 
	 * @param map BellockMap 객체
	 * @param toValueType DTO 클래스 타입
	 * @return 변환된 DTO 클래스 타입의 객체
	 */
	public <T> T mapToDTO(BwMap map, Class<T> classType) {
		if (map == null) {
			logger.info("BellockMap 파라메터가 null 입니다!!");
			return null;
		}
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		return objectMapper.convertValue(map, classType);
	}

	/**
	 * BellockMap array list를 DTO 객체 array list로 변환
	 * 
	 * @param mapList BellockMap array list 객체
	 * @param toValueType  DTO 클래스 타입
	 * @return 변환된 DTO 클래스 타입의 array list 객체
	 */
	public <T> ArrayList<T> mapToDTO(ArrayList<BwMap> mapList, Class<T> classType) {
		if (mapList == null) {
			logger.info("BellockMap array list 파라메터가 null 입니다!!");
			return null;
		}

		ArrayList<T> convMapList = new ArrayList<T>();

		for (BwMap map : mapList) {
			T data = mapToDTO(map, classType);
			convMapList.add(data);
		}
		return convMapList;
	}

}


