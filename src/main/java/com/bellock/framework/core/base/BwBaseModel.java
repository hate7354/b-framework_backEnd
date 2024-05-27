package com.bellock.framework.core.base;

import java.io.Serializable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;


/**
 * Model Base 클래스.<p>
 * VO, DTO 모델관련 베이스 클래스.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
@SuppressWarnings("serial")
public class BwBaseModel extends BwAbstractBase implements Serializable {

	/**
	 * 객체의 문자열을 반환, 디버깅이나 로깅시에 쓰임.
	 * 
	 * @return String
	 * @throws BwException
	 */
	@Override
	public String toString() {
		try {
			return ToStringBuilder.reflectionToString(this, ToStringStyle.SIMPLE_STYLE);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}
	
	/**
	 * 객체를 비교하는 메서드.
	 * 
	 * @return boolean
	 * @throws BwException
	 */
	@Override
	public boolean equals(Object o) {
		try {
			return EqualsBuilder.reflectionEquals(this, o);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

	/**
	 * 객체의 해시코드 반환, 해시 기반 컬렉션에서 객체를 사용할 때 쓰임.
	 * 
	 * @return Integer
	 * @throws BwException
	 */
	@Override
	public int hashCode() {
		try {
			return HashCodeBuilder.reflectionHashCode(this);
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.INTERNAL_SERVER_ERROR, e);
		}
	}

}


