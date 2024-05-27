(function() {
	document.getElementById('cancel-button').addEventListener('click', function(event) {
	    htmx.trigger('#request-button', 'htmx:abort');
	});
	
	document.addEventListener('htmx:abort', function(event) {
	    console.log('HTMX 요청이 취소되었습니다.');
	});
})();


class TestClass {

	constructor() {
		this.data = [];
	}

	add2(data) {
		this.data.push(data);
	}

	get2(index) {
		return this.data[index];
	}
}