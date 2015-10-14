//Variáveis com os valores do usuário já cadastrados no ldap - Utilizadas em verificações de alterações
var apelido = $('#apelido').val(), email_alternativo = $('#email_alternativo').val(), telefone1 = $('#telefone1').val(), telefone2 = $('#telefone2').val();

//Variável que é alterada caso o usuário digite a senha certa no campo senha atual - Com valor true, ativa o submit do botão confirmar da direita
var dados = {apelido: false, email_alternativo: false, telefone1: false, telefone2: false}, senha = {atual: false, nova: false};

//Verifica se a senha digitada pelo usuário é a atual
function verifica_senha(obj) {
    //Envia os dados para serem processados pela api verificarSenha.php
    $.post("/valid/app/verificarSenha.php", {
        login: $('#id-usuario').text(),
        senha: $('#senha_atual').val()
    }, function (data, status) {

        //Se a conexão tiver sido feita com sucesso
        if ($('#senha_atual').val() !== "") {
            if (status === "success") {
                if (data === "ok") {
                    $('#senha_atual').addClass('ok').removeClass('error');
                    obj.atual = true;
                    $("#erro_senha").hide("slow");
                }
                else {
                    $('#senha_atual').addClass('error').removeClass('ok');
                    obj.atual = false;
                }
            }
        }
        else {
            $('#senha_atual').removeClass('error ok');
            $("#erro_senha").hide("slow");
            obj.atual = false;
        }
    });
}

//Verifica se a senha digitada pelo usuário é a atual
function alterar_senha(obj) {
    //Envia os dados para serem processados pela api verificarSenha.php
    $.post("/valid/app/alterarSenha.php", {
        login: $('#id-usuario').text(),
        senha_atual: $('#senha_atual').val(),
        senha_nova: $('#nova_senha').val()
    }, function (data, status) {

    });
}

function verifica_dados(atual, dados_iniciais) {

    if (atual.val() === "" && dados_iniciais !== "") {
        atual.removeClass("warning").addClass("error");
        set_obj(atual, false);
    } else {
        if (atual.val() !== dados_iniciais) {
            atual.addClass("warning").removeClass("error");
            set_obj(atual, true);
        }
        else if (atual.val() === dados_iniciais) {
            atual.removeClass("warning").removeClass("error");
            set_obj(atual, false);
        }
    }
}

function set_obj(atual, valor) {

    if (atual.attr('id') === "apelido")
        dados.apelido = valor;
    else if (atual.attr('id') === "email_alternativo")
        dados.email_alternativo = valor;
    else if (atual.attr('id') === "telefone1")
        dados.telefone1 = valor;
    else if (atual.attr('id') === "telefone2")
        dados.telefone2 = valor;
}

//Verifica se os campos nova senha e confirmar senha coincidem. Caso concidam..............
function verifica_campos_senha() {

    if ($('#nova_senha').val() !== "" || $('#confirmar_nova_senha').val() !== "") {
        if ($('#nova_senha').val() === $('#confirmar_nova_senha').val()) {
            $('#nova_senha').addClass('ok').removeClass('error');
            $('#confirmar_nova_senha').addClass('ok').removeClass('error');
            $("#erro_senha p").text("");
            $("#erro_senha").hide("slow");
            senha.nova = true;
        } else {
            $('#nova_senha').addClass('error').removeClass('ok');
            $('#confirmar_nova_senha').addClass('error').removeClass('ok');
            $("#erro_senha p").text("Digite corretamente sua nova senha!").addClass('alert').addClass('alert-danger');
            $("#erro_senha").show("slow");
            senha.nova = false;
        }
    }
    else {
        $('#nova_senha').removeClass('ok error');
        $('#confirmar_nova_senha').removeClass('ok error');
        $("#erro_senha p").text("");
        $("#erro_senha").hide("slow");
        senha.nova = false;
    }
}

//Altera os dados do usuário
function altera_dados(e) {
    if (dados.apelido || dados.email_alternativo || dados.telefone1 || dados.telefone2) {
        $("#erro_dados p").text("BELEZA!!").addClass('alert').addClass('alert-danger');
        $("#erro_dados").show("slow");
        e.preventDefault();
    }
    else {
        $("#erro_dados").hide("slow");
        e.preventDefault();
    }
}

//Altera a senha do usuário
function altera_senha(e) {

    if ($('#senha_atual').val() || $('#nova_senha').val() || $('#confirmar_nova_senha').val()) {

        //Se existir valor no campo senha atual
        if ($('#senha_atual').val()) {

            //Se a senha atual estiver correta
            if (senha.atual) {
                if ($('#nova_senha').val() === "" || $('#confirmar_nova_senha').val() === "") {
                    $("#erro_senha p").text("Entre com sua senha atual!").addClass('alert').addClass('alert-danger');
                    $("#erro_senha").show("slow");
                    e.preventDefault();
                }

                if (!senha.nova) {
                    $('#nova_senha').addClass('error').removeClass('ok');
                    $('#confirmar_nova_senha').addClass('error').removeClass('ok');
                    $("#erro_senha p").text("Entre com sua nova senha!").addClass('alert').addClass('alert-danger');
                    $("#erro_senha").show("slow");
                }
                else {
                    $("#erro_senha p").text("GOOD TO GO!").addClass('alert').addClass('alert-danger');
                    //altera_senha($('#nova_senha').val());
                    $("#erro_senha").show("slow");
                }

                e.preventDefault();
            }

            //Se a senha atual não estiver correta
            else {
                $("#erro_senha p").text("Entre com sua senha atual correta!").addClass('alert').addClass('alert-danger');
                $("#erro_senha").show("slow");
                e.preventDefault();
            }
        }

        //Se não existir valor no campo senha atual
        else {
            $('#senha_atual').addClass('error').removeClass('ok');
            $("#erro_senha p").text("Entre com sua senha atual!").addClass('alert').addClass('alert-danger');
            $("#erro_senha").show("slow");
            e.preventDefault();
        }
    }
    else {
        e.preventDefault();
    }

}

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
        verifica_senha(senha);
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
    $("#submit1").click(altera_dados);

    //Submit da senha
    $("#submit2").click(altera_senha);
});