//Variáveis com os valores do usuário já cadastrados no ldap - Utilizadas em verificações de alterações
var apelido = $('#apelido').val(), email_alternativo = $('#email_alternativo').val(), telefone1 = $('#telefone1').val(), telefone2 = $('#telefone2').val();

//Variável que é alterada caso o usuário digite a senha certa no campo senha atual - Com valor true, ativa o submit do botão confirmar da direita
var apelido_tf = false, email_alternativo_tf = false, telefone1_tf = false, telefone2_tf = false, senha_a = false, senha_n = false;

function verifica_dados(atual, dados_iniciais) {
    if (atual.val() === "" && dados_iniciais !== "") {
        atual.removeClass("warning").addClass("error");
        dadosTrulse(atual, false);
    } else {
        if (atual.val() !== dados_iniciais) {
            atual.addClass("warning").removeClass("error");
            dadosTrulse(atual, true);
        }
        else if (atual.val() === dados_iniciais) {
            atual.removeClass("warning").removeClass("error");
            dadosTrulse(atual, false);
        }
    }
}

function dadosTrulse(atual, valor) {
    if (atual.attr('id') === "apelido")
        apelido_tf = valor;
    else if (atual.attr('id') === "email_alternativo")
        email_alternativo_tf = valor;
    else if (atual.attr('id') === "telefone1")
        telefone1_tf = valor;
    else if (atual.attr('id') === "telefone2")
        telefone2_tf = valor;
}

//Altera os dados do usuário
function altera_dados(dado, tipo) {
    //Envia os dados para serem processados pela api getsiga.php
    $.post("/valid/app/api/alterarDados.php", {
        dado: dado,
        tipo: tipo
    }, function (data, status) {

        //Se o post tiver dado certo, verificar a resposta
        if (status === 'success') {
            if (data) {
                mensagem_dados("Dado(s) alterado(s) com sucesso!", "ok");
            }
        }
    });
}

//Mostra mensagem de erro/confirmação de dados
function mensagem_dados(texto, tipo) {
    if (tipo === "erro") {
        $("#erro_dados p").text(texto).addClass('alert-danger').addClass('alert');
        $("#erro_dados").show("slow");
    }
    else if (tipo === "ok") {
        $("#erro_dados p").text(texto).addClass('alert-success').addClass('alert');
        $("#erro_dados").show("slow");
    }
    else {
        $("#erro_dados").hide("slow");
    }
}

//------------------------------------------------------------------------------

//Verifica se a senha digitada pelo usuário é a atual
function verifica_senha() {
    //Envia os dados para serem processados pela api verificarSenha.php
    $.post("/valid/app/api/verificarSenha.php", {
        login: $('#id-usuario').text(),
        senha: $('#senha_atual').val()
    }, function (data, status) {

        //Se a conexão tiver sido feita com sucesso
        if ($('#senha_atual').val() !== "") {
            if (status === "success") {
                if (data === "ok") {
                    $('#senha_atual').addClass('ok').removeClass('error');
                    $("#erro_senha").hide("slow");
                    senhaATrulse(true);
                }
                else {
                    $('#senha_atual').addClass('error').removeClass('ok');
                    senhaATrulse(false);
                }
            }
        }
        else {
            $('#senha_atual').removeClass('error ok');
            $("#erro_senha").hide("slow");
            senhaATrulse(false);
        }
    });
}

function senhaATrulse(trulse) {
    senha_a = trulse;
}

//Verifica se os campos nova senha e confirmar senha coincidem. Caso concidam..............
function verifica_campos_senha() {
    if ($('#nova_senha').val() !== "" || $('#confirmar_nova_senha').val() !== "") {
        if ($('#nova_senha').val() === $('#confirmar_nova_senha').val()) {
            $('#nova_senha').addClass('ok').removeClass('error');
            $('#confirmar_nova_senha').addClass('ok').removeClass('error');
            $("#erro_senha p").text("");
            $("#erro_senha").hide("slow");
            senhaNTrulse(true);
        } else {
            $('#nova_senha').addClass('error').removeClass('ok');
            $('#confirmar_nova_senha').addClass('error').removeClass('ok');
            $("#erro_senha p").text("Digite corretamente sua nova senha!").addClass('alert').addClass('alert-danger');
            $("#erro_senha").show("slow");
            senhaNTrulse(false);
        }
    }
    else {
        $('#nova_senha').removeClass('ok error');
        $('#confirmar_nova_senha').removeClass('ok error');
        $("#erro_senha p").text("");
        $("#erro_senha").hide("slow");
        senhaNTrulse(false);
    }
}

function senhaNTrulse(trulse) {
    senha_n = trulse;
}

//Altera os dados do usuário
function altera_senha(dado, tipo) {
    //Envia os dados para serem processados pela api getsiga.php
    $.post("/valid/app/api/alterarDados.php", {
        dado: dado,
        tipo: tipo
    }, function (data, status) {

        //Se o post tiver dado certo, verificar a resposta
        if (status === 'success') {
            if (data) {
                mensagem_senha("Dado(s) alterado(s) com sucesso!", "ok");
            }
        }
    });
}

//Mostra mensagem de erro/confirmação de senha
function mensagem_senha(texto, tipo) {
    if (tipo === "erro") {
        $("#erro_senha p").text(texto).removeClass('alert-success').addClass('alert-danger').addClass('alert');
        $("#erro_senha").show("slow");
    }
    else if (tipo === "ok") {
        $("#erro_senha p").text(texto).removeClass('alert-danger').addClass('alert-success').addClass('alert');
        $("#erro_senha").show("slow");
    }
    else {
        $("#erro_senha").hide("slow");
    }
}

//------------------------------------------------------------------------------

//Ao se carregar a página por completo...
$(document).ready(function () {

    //Carrega a imagem selecionada na tag img
    $(function () {
        $('#escolhe-imagem').on('change', function () {

            var input = $(this)[0];
            var file = input.files[0];

            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif") {

                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#user').attr('src', e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                alert("\nPor favor, utilize apenas imagens nos seguintes formatos: jpg, gif ou png");
            }
        });
    });

    //A mensagem de erro do envio de solicitação começa escondida
    $("#erro_dados").hide();

    //A mensagem de erro do envio de solicitação começa escondida
    $("#erro_senha").hide();

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#apelido').keyup(function () {
        verifica_dados($('#apelido'), apelido);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#email_alternativo').keyup(function () {
        verifica_dados($('#email_alternativo'), email_alternativo);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#telefone1').keyup(function () {
        verifica_dados($('#telefone1'), telefone1);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#telefone2').keyup(function () {
        verifica_dados($('#telefone2'), telefone2);
    });

    //Verifica se a senha atual é realmente a senha do usuário
    $('#senha_atual').keyup(function () {
        verifica_senha();
    });

    //Verifica se a nova senha é igual à sua confirmação
    $('#nova_senha').keyup(function () {
        verifica_campos_senha();
    });

    //Verifica se a confirmação da senha é igual à senha nova desejada
    $('#confirmar_nova_senha').keyup(function () {
        verifica_campos_senha();
    });

    //Submit dos dados
    $("#submit1").click(function () {

        if (apelido_tf || email_alternativo_tf || telefone1_tf || telefone2_tf) {
            if (apelido_tf)
                altera_dados($("#apelido").val(), 0);
            if (email_alternativo_tf)
                altera_dados($("#email_alternativo").val(), 1);
            if (telefone1_tf || telefone2_tf)
                altera_dados([$("#telefone1").val(), $("#telefone2").val()], 2);
        }
        else {
        }
    });

    //Submit da senha
    $("#submit2").click(function () {
        if ($('#senha_atual').val() || $('#nova_senha').val() || $('#confirmar_nova_senha').val()) {

            //Se existir valor no campo senha atual
            if ($('#senha_atual').val()) {
                //Se a senha atual estiver correta
                if (senha_a) {
                    if ($('#nova_senha').val() === "" || $('#confirmar_nova_senha').val() === "") {
                        $("#erro_senha p").text("Entre com sua senha atual!").addClass('alert').addClass('alert-danger');
                        $("#erro_senha").show("slow");
                    }
                    if (!senha_n) {
                        $('#nova_senha').addClass('error').removeClass('ok');
                        $('#confirmar_nova_senha').addClass('error').removeClass('ok');
                        $("#erro_senha p").text("Entre com sua nova senha!").addClass('alert').addClass('alert-danger');
                        $("#erro_senha").show("slow");
                    }
                    else {
                        altera_senha($("#nova_senha").val(), 3);
                        $("div.alterar-senha").html('');
                        $("div.alterar-senha").append('<p class="alert alert-success" id="senha_after">GRANDE NAPPA</p>');
                    }
                }

                //Se a senha atual não estiver correta
                else {
                    $("#erro_senha p").text("Entre com sua senha atual correta!").addClass('alert').addClass('alert-danger');
                    $("#erro_senha").show("slow");
                }
            }

            //Se não existir valor no campo senha atual
            else {
                $('#senha_atual').addClass('error').removeClass('ok');
                $("#erro_senha p").text("Entre com sua senha atual!").addClass('alert').addClass('alert-danger');
                $("#erro_senha").show("slow");
            }
        }
    });
});
//
//
//
//
//
//
//
/*
 
 
 
 //Verifica se a senha digitada pelo usuário é a atual
 function alterar_senha(obj) {
 //Envia os dados para serem processados pela api verificarSenha.php
 $.post("/valid/app/api/alterarSenha.php", {
 login: $('#id-usuario').text(),
 senha_atual: $('#senha_atual').val(),
 senha_nova: $('#nova_senha').val()
 }, function (data, status) {
 
 });
 }
 
 */
