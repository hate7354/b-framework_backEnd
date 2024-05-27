package com.bellock.framework.core.util;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.HashMap;

import javax.crypto.Cipher;

import com.bellock.framework.core.exception.BwException;
import com.bellock.framework.core.exception.BwExceptionStatus;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import static com.bellock.framework.core.constant.BwConstants.Rsa.Const.*;
import static com.bellock.framework.core.constant.BwConstants.MimeType.Const.*;


/**
 * RSA 키를 생성해서 클라이언트에 제공, private key는 세션에 저장
 * modulus와 public exponent를 클라이언트로 반환할 수 있도록 생성.
 * 
 * @since 2024.03, 나인석, 최초작성
 */
public class BwRSACryptoUtil {
	/**
	 * RSA key generator.
	 * 
	 * @return Base64 Key Data
	 * @throws NoSuchAlgorithmException
	 */
	public static HashMap<String, Object> RSAKeyGenerator(HttpServletRequest request) {
		try {
			HashMap<String, Object> keyData = new HashMap<String, Object>();
			KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
			kpg.initialize(KEYSIZE_INT);
			
			KeyPair keyPair = kpg.genKeyPair();
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");

			PublicKey publicKey = keyPair.getPublic();
			PrivateKey privateKey = keyPair.getPrivate();

			HttpSession session = request.getSession();
			// 세션에 공개키의 문자열을 키로하여 개인키를 저장한다.
			session.setAttribute(PRIVATE_KEY_STR, privateKey);
			
			// 공개키를 문자열로 변환하여 JavaScript RSA 라이브러리 넘겨준다.
			RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
			
			// 생성된 키데이터 리턴
			keyData.put(MODULUS_STR, publicSpec.getModulus().toString(16));
			keyData.put(EXPONENT_STR, publicSpec.getPublicExponent().toString(16));
			
			return keyData;
		} catch(Exception e) {
			throw new BwException(BwExceptionStatus.CRYPTO_EXCEPTION, e);
		}
	}
	
	/**
	 * 클라이언트에서 올라온 암호화된 데이터를 복호화 한다.
	 * 복호화시 세션에 저장된 개인키를 사용해 진행한다. 
	 * 세션에 저장된 개인키의 삭제는 해당함수를 호출하는 곳에서 삭제해야 한다.
	 * 
	 * @param request The request
	 * @param data 암호화된 데이터 
	 * @return The decrypted data
	 * @throws Exception
	 */
	public static String decryptData(HttpServletRequest request, String data) {
		try {
			HttpSession session = request.getSession();
			PrivateKey privateKey = (PrivateKey)session.getAttribute(PRIVATE_KEY_STR);
			
			Cipher cipher = Cipher.getInstance("RSA");

	        byte[] encryptedBytes = hexToByteArray(data);
	        cipher.init(Cipher.DECRYPT_MODE, privateKey);

	        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
	        String decryptData = new String(decryptedBytes, UTF8_STR);
	        
			return decryptData;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.CRYPTO_EXCEPTION, e);
		}
	}

	/**
	 * 16진 문자열을 byte 배열로 변환.
	 *
	 * @param hex the hex
	 * @return the byte[]
	 */
    public static byte[] hexToByteArray(String hex) {
    	try {
	        if (hex == null || hex.length() % 2 != 0) {
	            return new byte[]{};
	        }

	        byte[] bytes = new byte[hex.length() / 2];
	        for (int i = 0; i < hex.length(); i += 2) {
	            byte value = (byte)Integer.parseInt(hex.substring(i, i + 2), 16);
	            bytes[(int) Math.floor(i / 2)] = value;
	        }
	        return bytes;
		} catch (Exception e) {
			throw new BwException(BwExceptionStatus.CRYPTO_EXCEPTION, e);
		}
   }

}


