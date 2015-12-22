function autenticacao(e) {
    //Envia os dados para serem processados pela api getsiga.php
    $.post("/valid/app/api/getSiga.php", {
        cpf: $('#cpf').val(),
        senha: $('#senha').val()
    }, function (data, status) {
        
        //Se o post tiver dado certo, verificar a resposta
        if (status === 'success') {

            //Existe no siga e não no ldap
            if (data === 'true') {

                //Executar o submit do form
                $("#form_solicitacao").submit();

                //Se o usuário já existir dentro do ldap, ele já possui acesso direto ao valid, então, mostra a mensagem
            } else if (data === 'Already in progress') {

                mensagem("Usuário já solicitou acesso ao ValID!");

                //Erro no cpf ou na senha
            } else if (data === 'Already exists') {
                
                mensagem("Usuário já possui acesso ao ValID!");

                //Se o usuário já tiver realizado a solicitação de acesso
            }  else {
                mensagem("Favor verificar CPF e/ou senha!");
            }
        }
    });

    //Evita que o botão execute sua ação default, executando as definidas pelo javascript
    e.preventDefault();
}

//Mensagem que aparece de acordo com a ocasião
function mensagem(texto) {
    $("#msg_error p").text(texto).addClass('alert-danger').addClass('alert');
    $("#msg_error").show("slow");
}

$(document).ready(function () {
    //Ao se preencher o cpf e a senha do siga, o envio da solicitação de acesso é feito
    $("#solicitar").click(autenticacao);

    //A mensagem de erro do envio de solicitação começa escondida
    $("#msg_error").hide();
});
