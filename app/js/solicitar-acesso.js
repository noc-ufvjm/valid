//Variáveis globais
var dados = false, login = false, senha = false;

//Verifica se o login existe
function verificarLogin() {
    $.get('/valid/app/api/verificarLogin.php?login=' + $('#uid').val(), function (data) {
        if ($('#uid').val() !== "") {
            if (data) {
                $('#uid').addClass('error');
                mensagem("Este login já existe no LDAP!");
                login = false;
            } else {
                $('#uid').removeClass('error');
                login = true;
            }
        }
        else {
            $('#uid').removeClass('error');
            login = false;
        }
    });
}

//Verifica se todos os dados foram preenchidos
function verificaCampos() {
    var vetor = [$('#cn'), $('#sn'), $('#employeeNumber'), $('#uid'), $('#givenName'), $('#mail'), $('#telephoneNumber'), $('#cellphoneNumber'), $('#userPassword'), $('#confirmar_senha')];

    if ($('#cn').val() && $('#sn').val() && $('#employeeNumber').val() && $('#uid').val() && $('#givenName').val() && $('#mail').val() && $('#telephoneNumber').val() && $('#cellphoneNumber').val() && $('#userPassword').val() && $('#confirmar_senha').val()) {
        dados = true;
    }
    else {
        for (var a = 0; a < 10; ++a) {
            if (!vetor[a].val()) {
                vetor[a].addClass('error');
            }
        }
        dados = false;
    }
}

//Verifica os vínculos do usuário
function verificaVínculo() {
    $.get('/valid/app/api/verificarVinculos.php?cpf=' + $('#cpf').val(), function (data) {

        console.log(data);

        if (data === 1) {
            $("#vinculos").append('<img id="ta" src="imagens/ta.png" title="TA" />');
        } else if (data === 2) {
            $("#vinculos").append('<img id="professor" src="imagens/professor.png" title="Professor" />');
        } else if (data === 6) {
            $("#vinculos").append('<img id="aluno" src="imagens/aluno.png" title="Aluno" />');
            $("#vinculos").append('<img id="ta" src="imagens/ta.png" title="TA" />');
        } else if (data === 7) {
            $("#vinculos").append('<img id="aluno" src="imagens/aluno.png" title="Aluno" />');
            $("#vinculos").append('<img id="professor" src="imagens/professor.png" title="Professor" />');
        } else {
            $("#vinculos").append('<img id="aluno" src="imagens/aluno.png" title="Aluno" />');
        }

    });
}

//Máscara para formatar o telefone no formato específico
function mascaraTel(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function mtelTel(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

//Máscara para formatar o celular no formato específico
function mascaraCel(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function mtelCel(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d)(\d{4})(\d{4})$/, "$1 $2-$3"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

//Verifica se os campos nova senha e confirmar senha coincidem.
function verifica_campos_senha() {
    if ($('#userPassword').val() !== "" || $('#confirmar_nova_senha').val() !== "") {
        if ($('#userPassword').val() === $('#confirmar_senha').val()) {
            $('#userPassword').addClass('ok').removeClass('error');
            $('#confirmar_senha').addClass('ok').removeClass('error');
            senha = true;
        } else {
            $('#userPassword').addClass('error').removeClass('ok');
            $('#confirmar_senha').addClass('error').removeClass('ok');
            senha = false;
        }
    }
    else {
        $('#userPassword').removeClass('ok error');
        $('#confirmar_senha').removeClass('ok error');
        senha = false;
    }
}

//Realiza o pré-cadastro no LDAP
function realizarSolicitacao() {
    $.post('/valid/app/api/solicitarAcesso.php', {
        //Dados enviados por POST. CPF é pegado da sessão dentro de solicitarAcesso.php
        cn: $('#cn').val(),
        sn: $('#sn').val(),
        employeeNumber: $('#employeeNumber').val(),
        givenName: $('#givenName').val(),
        uid: $('#uid').val(),
        mail: $('#mail').val(),
        telephoneNumber: $('#telephoneNumber').val(),
        cellphoneNumber: $('#cellphoneNumber').val(),
        userPassword: $('#userPassword').val()
    }, function (data) {
        //Limpa o bloco
        $("div.form-block").html("");

        //Se a solicitação tiver dado certo, mensagem de confirmação
        if (data === "Success") {
            $("div.form-block").append('<p class="alert alert-success" id="solicitacao">Solicitação realizada com sucesso!</p>');
            setTimeout(function () {
                window.location.href = "logout.php";
            }, 3000);
            //Se a solicitação tiver dado errado, mensagem de erro
        } else {
            console.log(data);
            $("div.form-block").append('<p class="alert alert-danger" id="solicitacao">Houve um problema com sua solicitação.<br/>Tente novamente!</p>');
            setTimeout(function () {
                window.location.href = "solicitar-acesso.php";
            }, 4000);
        }
    });
}

//Mostra mensagem que se apaga em 3 segundos
function mensagem(texto) {
    $("#erro p").text(texto).addClass('alert-danger').addClass('alert');

    if (texto)
        $("#erro").show("slow");
    else
        $("#erro").hide("slow");

    setTimeout(function () {
        $("#erro").hide('slow');
    }, 3000);
}

//Quando a página estiver completamente carregada...
$(document).ready(function () {

    verificaVínculo();

    $('#uid').change(function () {
        verificarLogin();
    });

    $('#cn').change(function () {
        $('#cn').removeClass('error');
    });

    $('#sn').keyup(function () {
        $('#sn').removeClass('error');
    });

    $('#employeeNumber').change(function () {
        $('#employeeNumber').removeClass('error');
    });

    $('#givenName').change(function () {
        $('#givenName').removeClass('error');
    });

    $('#mail').change(function () {
        $('#mail').removeClass('error');
    });

    $('#telephoneNumber').keydown(function (e) {
        $('#telephoneNumber').removeClass('error');

        //Função que realiza a conversão
        mascaraTel(this, mtelTel);

        //Permitir: backspace, delete, tab, escape e enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode == 67 && e.ctrlKey === true) || (e.keyCode == 88 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
            //Se for número, não fazer nada!
            return;
        }
        //Garantir que é um número e impedir preenchimento.
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) || $('#telephoneNumber').val().length >= 14) {
            e.preventDefault();
        }
    });

    $('#cellphoneNumber').keydown(function (e) {
        $('#cellphoneNumber').removeClass('error');

        //Função que realiza a conversão
        mascaraCel(this, mtelCel);

        //Permitir: backspace, delete, tab, escape e enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode == 67 && e.ctrlKey === true) || (e.keyCode == 88 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
            //Se for número, não fazer nada!
            return;
        }
        //Garantir que é um número e impedir preenchimento.
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) || $('#cellphoneNumber').val().length >= 14) {
            e.preventDefault();
        }
    });

    $('#userPassword').change(function () {
        verifica_campos_senha();
    });

    $('#confirmar_senha').change(function () {
        verifica_campos_senha();
    });

    $('#solicitar').click(function (e) {
        //Verifica se todos os campos foram preenchidos
        verificaCampos();

        //Verifica se dados, login e senha estão ok. Se estiverem, mensagem de confirmação e realiza solicitação
        if (dados && login && senha) {
            if (confirm("Confirme as informações antes de realizar o cadastro:\n\nNome: " + $('#cn').val() + "\nSobrenome: " + $('#sn').val() + "\nMatrícula: " + $('#employeeNumber').val() + "\nUID: " + $('#uid').val() + "\nE-mail: " + $('#mail').val() + "\nTelefone: " + $('#telephoneNumber').val() + "\nCelular: " + $('#cellphoneNumber').val() + "\n\nAs informações estão corretas?")) {
                realizarSolicitacao();
            }
            //Se não estiver, mensagem de erro
        } else {
            mensagem("Por favor, verifique os campos de informações!");
        }
    });

    $('#voltar').click(function (e) {
        window.location.href = "logout.php";
    });
});