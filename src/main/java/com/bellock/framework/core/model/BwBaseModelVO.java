package com.bellock.framework.core.model;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

import java.util.ArrayList;

import com.bellock.framework.core.annotation.BwTransferField;
import com.bellock.framework.core.map.BwMap;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * VO Base Class.
 * 어플리케이션에서 VO 클래스를 생성할 때 상속 받는 클래스.
 * 
 * BellockMap 객체를 각종 VO 객체로 변환하는 기능을 제공한다.
 */
public class BwBaseModelVO extends BwModelBase {

	/**
	 * BellockMap을 VO 객체로 변환
	 * 
	 * @param <T>
	 * @param map
	 * @param toValueType
	 * @return
	 */
	public <T> T mapToVO(BwMap map, Class<T> classType) {
		if (map == null) {
			logger.info("BellockMap 파라메터가 null 입니다!!");
			return null;
		}
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		return objectMapper.convertValue(map, classType);
	}

	/**
	 * BellockMap Array 리스트를 VO 객체 리스트로 변환
	 * 
	 * @param <T>
	 * @param mapList
	 * @param toValueType
	 * @return
	 */
	public <T> ArrayList<T> mapToVO(ArrayList<BwMap> mapList, Class<T> classType) {
		if (mapList == null) {
			return null;
		}

		ArrayList<T> convMapList = new ArrayList<T>();

		for (BwMap map : mapList) {
			T data = mapToVO(map, classType);
			convMapList.add(data);
		}
		return convMapList;
	}

	/**
	 * 파라메터의 클래스 타입의 DTO 객체를 생성한다
	 * @TransferField  어노테이션이 클래스 타입에서 선언되어 있으면,
	 * 그 VO 클래스의 전체 필드를 DTO 클래스의 일치하는 필드와 매핑하고,
	 * 필드 레벨로 선언되어 있으면 해당하는 필드만 매핑한다
	 * 
	 * @param classType 생성할 DTO 클래스 타입
	 * @return 생성된 DTO 클래스 인스턴스
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public <T> T createDTOInstance(Class<T> clazz) {
		T inst = null;

		try {
			inst = (T) clazz.getDeclaredConstructor().newInstance();
		} catch (Exception e) {
			e.printStackTrace();
			return inst;
		}

		// class type으로 어노테이션이 있는지 읽어온다
		boolean allField = false;
		Annotation annotation = this.getClass().getAnnotation(BwTransferField.class);
		
		if (annotation != null) {
			// class type에 @TransferField 어노테이션이 있는 경우,
			// 모든 field를 DTO로 값을 복사한다
			// 그리고 field 레벨로 어노테이션이 있는 경우,
			// @TransferField 어노테이션이 붙은 field만 DTO로 값을 복사한다
			allField = true;
		}

		try {
			for (Field voField : this.getClass().getDeclaredFields()) {
				if (!allField) {
					annotation = voField.getAnnotation(BwTransferField.class);
					if(annotation == null) continue;
				}
				
				voField.setAccessible(true);
				Object fieldValue = voField.get(this);
				
				try {
					Field dtoField = clazz.getDeclaredField(voField.getName());

					// 필드 접근이 가능하도록 설정
					dtoField.setAccessible(true);
					
					// DTO 필드의 타입을 검사해서, VO와 동일하면 Set
					// 그렇지 않으면 타입변환 후 설정한다
					// 타입은 값이 설정되는 Target DTO를 기분으로 한다
					Class<?> dtoFieldType = dtoField.getType();
					if (dtoFieldType.isAssignableFrom(voField.getType())) {
						dtoField.set(inst, fieldValue);
					} else {
						Object convertedValue = convertType(fieldValue, dtoFieldType);
						if (convertedValue != null) {
							dtoField.set(inst, convertedValue);
						} else {
							// 타입변환이 어려운 경우 설정을 하지 않는다
							logger.info("타입을 변환할 수 없습니다: " +
									"VO(" + fieldValue.getClass().getName() + ") DTO(" + dtoFieldType.getName() + ")");
						}
					}
				} catch (NoSuchFieldException e) {
					// DTO에 필드가 없는 경우
					logger.info("DTO 객체에 VO와 일치하는 필드(" + voField.getName() + ")가 없습니다!!");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			// 예외처리에 대한 로깅 및 throw exception 처리 필요 <================ ###
		}
			
		return inst;
	}
	
	/**
	 * 타입 변환 메서드
	 * String -> INT, INT -> String, String -> Double, Double -> String
	 * 
	 * @param value 변환할 데이터 값
	 * @param targetType 변환할 데이터 타입
	 * @return 변환된 데이터 값
	 */
	private Object convertType(Object value, Class<?> targetType) {
		if (targetType == Integer.class) {
			if (value instanceof String) {
				return Integer.valueOf((String) value);
			} else if (value instanceof Double) {
				return ((Double) value).intValue();
			}
		} else if (targetType == String.class) {
			if (value instanceof Integer) {
				return String.valueOf(value);
			} else if (value instanceof Double) {
				return String.valueOf(value);
			}
		}
		return null;
	}
	
}


