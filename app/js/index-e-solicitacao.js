function autenticacao(e) {
    
    //Envia os dados para serem processados pela api getsiga.php
    $.post("/valid/app/api/getSiga.php", {
        cpf: $('#cpf').val(),
        senha: $('#senha').val()
    }, function (data, status) {
        
        //Se o post tiver dado certo, verificar a resposta
        if (status === 'success') {
            
            //Existe no siga e não no ldap
            if (data == 'true') {
                
                //Executar o submit do form
                $("#form_solicitacao").submit();
                
              //Se o usuário já existir dentro do ldap, ele já possui acesso direto ao valid, então, mostra a mensagem
            } else if (data == 'Already exists') {
                
                //Seta esta mensagem ao div
                $("#msg_error p").text("Usuário já possui acesso ao ValID!");
                
                //Mostra a mensagem
                $("#msg_error").show("slow");
                
              //Erro no cpf ou na senha
            } else if (data == 'Already in progress') {
                
                //Seta esta mensagem ao div
                $("#msg_error p").text("Usuário já solicitou acesso ao ValID!");
                
                //Mostra a mensagem
                $("#msg_error").show("slow");
                
              //Erro no cpf ou na senha
            } else {
                $("#msg_error p").text("Favor verificar CPF e/ou senha!");
                $("#msg_error").show("slow");
            }
        }
    });
    
    //Evita que o botão execute sua ação default, executando as definidas pelo javascript
    e.preventDefault();
}

$(document).ready(function () {
    
    //Ao se preencher o cpf e a senha do siga, o envio da solicitação de acesso é feito
    $("#solicitar").click(autenticacao);

    //A mensagem de erro do envio de solicitação começa escondida
    $("#msg_error").hide();
});
