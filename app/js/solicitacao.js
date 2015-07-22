function autenticacao(e) {
    $.post("/valid/app/getsiga.php",
	   {
	       cpf: $('#cpf').val(),
	       senha: $('#senha').val()
	   },
	   function(data, status){
	if (status === 'success') {
	    if (data == 'false') {
		$("#msg_error").show("slow");
	    } else {
		$("#form_solicitacao").submit();
	    }
	} else {
	    console.log('error conection');
	}
    });
    e.preventDefault();
}
$(document).ready(function () {
    $("#solicitar").click(autenticacao);
    $("#msg_error").hide();
});
