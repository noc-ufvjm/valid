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
            obj.atual = false;
        }
    });
}

//Verifica se algum dos campos dos dados foi preenchido
function verifica_campos_dados(campo, dados_iniciais, dado) {

    if (campo.val() === "" && dados_iniciais !== "") {
        campo.removeClass("warning").addClass("error");
        set_obj(dado, false);
    } else {
        if (campo.val() !== dados_iniciais) {
            campo.addClass("warning").removeClass("error");
            set_obj(dado, true);
        }
        else if (campo.val() === dados_iniciais) {
            campo.removeClass("warning").removeClass("error");
            set_obj(dado, false);
        }
    }
}

function set_obj(dado, valor) {

    if (dado === 1)
        dados.apelido = valor;
    else if (dado === 2)
        dados.email_alternativo = valor;
    else if (dado === 3)
        dados.telefone1 = valor;
    else
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
            $("#erro_senha p").text("Digite corretamente sua nova senha!");
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
        console.log("ALTERAR DADOS - CRIAR FUNÇÃO NO LDAP");
        e.preventDefault();
    }
    else {
        $("#erro_dados p").text("ERRO!!");
        $("#erro_dados").show("slow");
        e.preventDefault();
    }
}

//Altera a senha do usuário
function altera_senha(e) {

    //Se existir valor no campo senha atual
    if ($('#senha_atual').val()) {

        //Se a senha atual estiver correta
        if (senha.atual) {

        

        }
        
        //Se a senha atual não estiver correta
        else {
            $("#erro_senha p").text("Entre com sua senha atual correta!");
            $("#erro_senha").show("slow");
            e.preventDefault();
        }
    }
    
    //Se não existir valor no campo senha atual
    else {
        $("#erro_senha p").text("Entre com sua senha atual!");
            $("#erro_senha").show("slow");
            e.preventDefault();
    }




    /*
     //Se senha atual estiver preenchida
     if ($('#senha_atual').val()) {
     
     //Se os campos nova senha e confirmação de nova senha estiverem preenchidos
     if ($('#nova_senha').val() && $('#confirmar_nova_senha').val()) {
     
     if (senha.atual && senha.nova) {
     console.log("ALTERAR SENHA - CRIAR FUNÇÃO NO LDAP");
     e.preventDefault();
     }
     else if (senha.atual && senha.nova === false) {
     if ($('#senha_atual').val()) {
     $("#erro_senha p").text("Digite corretamente sua nova senha!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     else {
     $("#erro_senha p").text("Digite corretamente sua nova senha!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     }
     else if (senha.atual === false && senha.nova) {
     $("#erro_senha p").text("Entre com sua senha atual correta!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     }
     
     //Caso os campos de nova senha e confirmar senha não estejam preenchidos
     else {
     $("#erro_senha p").text("Digite sua nova senha!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     }
     else {
     $("#erro_senha p").text("Entre com sua senha atual!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     */








    /*
     if (senha.atual && senha.nova) {
     console.log("ALTERAR SENHA - CRIAR FUNÇÃO NO LDAP");
     e.preventDefault();
     }
     else if (senha.atual && senha.nova === false) {
     
     if ($('#senha_atual').val()) {
     $("#erro_senha p").text("Digite corretamente sua nova senha!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     else {
     $("#erro_senha p").text("Digite corretamente sua nova senha!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     }
     else if (senha.atual === false && senha.nova) {
     $("#erro_senha p").text("Entre com sua senha atual correta!");
     $("#erro_senha").show("slow");
     e.preventDefault();
     }
     else {
     e.preventDefault();
     }*/
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
        verifica_campos_dados($('#apelido'), apelido, 1);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#email_alternativo').keyup(function () {
        verifica_campos_dados($('#email_alternativo'), email_alternativo, 2);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#telefone1').keyup(function () {
        verifica_campos_dados($('#telefone1'), telefone1, 3);
    });

    //Cada vez que se digitar uma letra no campo, enviar para verificação dos campos dos dados
    $('#telefone2').keyup(function () {
        verifica_campos_dados($('#telefone2'), telefone2, 4);
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