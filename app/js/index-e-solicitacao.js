function autenticacao(e) {
    $.post("/valid/app/getsiga.php",
	   {
	       cpf: $('#cpf').val(),
	       senha: $('#senha').val()
	   },
	   function(data, status){
	if (status === 'success') {
	    if (data == 'true'){
		$("#form_solicitacao").submit();
	    }else if (data == 'Already exists'){
		$("#msg_error p").text("Usuário já possui acesso ao ValID!");
		$("#msg_error").show("slow");
	    }else{
		$("#msg_error p").text("Favor verificar CPF e/ou senha!");
		$("#msg_error").show("slow");
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
