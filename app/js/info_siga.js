function verificar_click(e) {
    $('#login').removeClass('ok error');
    $.get('/valid/app/verificarLogin.php?login=' + $('#login').val(), function (data, status) {
	if (status !== 'success') {
	    $('#login').addClass('error');
	} else if (data === 'false') {
	    $('#login').addClass('error');
	} else {
	    $('#login').addClass('ok');
	}
    });
    e.preventDefault();
}
$(document).ready(function () {
    $('#login').blur(verificar_click);
});
