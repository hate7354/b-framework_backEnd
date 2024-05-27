package com.bellock.framework.core.model;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;


/**
 * Model Base Class
 * Class Name, Equal, Hash Code method 제공
 * 
 * @history: 2024.04, 최초작성
 */
public class BwModelBase {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	/**
	 * 객체의 문자열을 반환, 디버깅이나 로깅시에 사용.
	 * 
	 * @return String
	 * @history 2024.04, 최초작성
	 */
	@Override
	public String toString() {
		try {
			return ToStringBuilder.reflectionToString(this, ToStringStyle.SIMPLE_STYLE);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INST_STRING_EXCEPTION, e);
		}
	}
	
	/**
	 * 객체의 비교, 불가변성 객체를 비교.
	 * 
	 * @return boolean
	 * @history 2024.04, 최초작성
	 */
	@Override
	public boolean equals(Object o) {
		try {
			return EqualsBuilder.reflectionEquals(this, o);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INST_COMPARE_EXCEPTION, e);
		}
	}
	
	/**
	 * 객체의 해시코드 반환, 해시 기반 컬렉션에서 객체를 사용할 때 사용.
	 * 
	 * @return integer
	 * @history 2024.04, 최초작성
	 */
	@Override
	public int hashCode() {
		try {
			return HashCodeBuilder.reflectionHashCode(this);
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.INST_HASHCODE_EXCEPTION, e);
		}
	}
	
}


