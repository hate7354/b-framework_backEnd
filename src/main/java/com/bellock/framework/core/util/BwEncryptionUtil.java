package com.bellock.framework.core.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Base64;

import com.bellock.framework.core.base.BwAbstractComponent;

/**
 * 데이터를 암호화.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwEncryptionUtil extends BwAbstractComponent {

	/**
	 * 입력된 데이터를 SHA-256 해시 알고리즘으로 암호화한 후 Base64로 인코딩하여 반환.
	 *
	 * @param data 암호화할 데이터
	 * @return Base64로 인코딩된 암호화된 데이터
	 * @throws Exception 암호화 처리 중에 발생한 예외
	 */
    public static String encryptSHA256ToBase64(String data) throws Exception {
		if (data == null) {
		    return "";
		}

		byte[] plainText = null; // 평문
		byte[] hashValue = null; // 해쉬값
		plainText = data.getBytes();

		MessageDigest md = MessageDigest.getInstance("SHA-256");
		hashValue = md.digest(plainText);
		return new String(Base64.encodeBase64(hashValue));
    }
    
    /**
     * 입력된 데이터를 SHA-256 단방향 해시 알고리즘으로 암호화하여 반환.
     *
     * @param data 암호화할 데이터
     * @return SHA-256으로 암호화된 데이터
     * @throws Exception 암호화 처리 중에 발생한 예외
     */
    public static String encryptSHA256(String data) throws Exception {
    	String rsltData = "";
    	try {
    		MessageDigest md = MessageDigest.getInstance("SHA-256");
    		byte byteData[] = md.digest(data.getBytes());
    		StringBuffer sb = new StringBuffer();
    		for(int i = 0 ; i < byteData.length ; i++){
    			sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
    		}
    		rsltData = sb.toString();

    	} catch(NoSuchAlgorithmException e){
    		rsltData = null;
    	}
    	return rsltData;
    }
    
}


