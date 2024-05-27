/**
 * 공통 처리 동적 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	document.querySelector('.logout').onclick = function() {
		msg.confirm("로그아웃하시겠습니까?", "예", "아니오", "confirm", "확인", async function(query) {
			if (query) {
		    	// 로그아웃 동작 수행
/*		    	
				$("body").append("<form name=\"logOutForm\" id=\"logOutForm\"></form>");
				$("#logOutForm").attr("method", "POST");
				$("#logOutForm").attr("action", "/logOut");
				$("#logOutForm").submit().remove();
*/				
				var form = document.createElement("form");
				form.method = "POST";
				form.action = "/logOut";
				document.body.appendChild(form).submit();
				window.location.replace('/');
			}
		});
	};
	
	
	
	
	
	
})();	