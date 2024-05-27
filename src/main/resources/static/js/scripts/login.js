/**
 * 로그인 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
loadScript('/js/rsa/jsbn.js');
loadScript('/js/rsa/rsa.js');
loadScript('/js/rsa/prng4.js');
loadScript('/js/rsa/rng.js');

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}

(function() {
    const usrLgn = document.getElementById('usrLgn');
    const password = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    
    // usrLgn input에서 Enter 키 입력 시 password input으로 포커스 이동
    usrLgn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            password.focus();
        }
    });

    // password input에서 Enter 키 입력 시 loginButton으로 이동
    password.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginButton.click();
        }
    });

    // usrLgn input과 password input에서 포커스가 들어올 때 IME를 영문으로 변경
    [usrLgn, password].forEach(input => {
        input.addEventListener('focus', function() {
            this.setAttribute('lang', 'en'); // HTML lang 속성을 사용하여 영문으로 설정
        });
    });
    
	// 사용자의 ID와 Password를 RSA로 암호화하는 함수
	async function encryptCredentials() {
		// 서버로부터 RSA 키를 받아오는 요청
		const response = await fetch('/getRSAKey', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		const result = await response.json();
		if (result.code !== 0) {
			return null;
		}
		const rsaKey = result.data[0];
		
		// RSA 키를 사용하여 ID와 Password를 암호화
		const encrypt = new RSAKey();
		encrypt.setPublic(rsaKey.modulus, rsaKey.exponent);

		return {
			userName: encrypt.encrypt(usrLgn.value),
			password: encrypt.encrypt(password.value)
		};
	}
    
	// 로그인 버튼 클릭 시 실행되는 함수
	loginButton.addEventListener('click', async function() {
		// 사용자의 ID와 Password를 RSA로 암호화하여 서버로 전송
		const encryptedCredentials = await encryptCredentials();
		// 서버로 암호화된 사용자 정보를 전송
		const response = await fetch('/login_verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(encryptedCredentials)
		});
		
		// 서버로부터 받은 응답 처리
		// 예: 로그인 성공시 Index 호출 또는 실패시 팝업 메시지 출력
		const result = await response.json();
		console.log(result);
		if (result.code === 0) {
//			htmx.ajax('POST', '/test', {
			htmx.ajax('POST', '/index', {
	            target: '#s_main',
	            swap: 'innerHTML'
	        });
		} else {
			dhtmlx.alert({
				text: result.message,
				title: '에러정보',
				width: 'auto',
				height: 'auto',
				callback: function() {
					password.value = '';
					password.focus();
				}
			});
		}
	});
	
	// HTMX 이벤트 핸들러 등록
	document.body.addEventListener('htmx:afterSwap', function(event) {
	    console.log('HTMX Swap...');
	    document.body.style.minWidth = '';
	    document.body.classList.add('s_main');
	    document.body.classList.remove('f17', 'f17v2');
	});

})();
