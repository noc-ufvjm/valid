//Variáveis globais
var dados = false, login = false;

//Verifica se o login existe
function verificarLogin() {
    $.get('/valid/app/api/verificarLogin.php?login=' + $('#uid').val(), function (data, status) {
        if ($('#uid').val() !== "") {
            if (status !== 'success') {
                $('#uid').addClass('error').removeClass('ok');
                loginTrulse(false);
            } else if (data === 'false') {
                $('#uid').addClass('error').removeClass('ok');
                loginTrulse(false);
            } else {
                $('#uid').addClass('ok').removeClass('error');
                loginTrulse(true);
            }
        }
        else {
            $('#uid').removeClass('ok error');
            loginTrulse(false);
        }
    });
}

function loginTrulse(trulse) {
    login = trulse;
}

//Verifica os dados do cliente
function verificaCampos() {
    var vetor = [$('#cn'), $('#sn'), $('#employeeNumber'), $('#uid'), $('#givenName'), $('#mailAlternateAddress'), $('#telephoneNumber'), $('#cellphoneNumber')];

    if ($('#cn').val() && $('#sn').val() && $('#employeeNumber').val() && $('#uid').val() && $('#givenName').val() && $('#mailAlternateAddress').val() && $('#telephoneNumber').val() && $('#cellphoneNumber').val()) {
        dadosTrulse(true);
    }
    else {
        for (var a = 0; a < 8; ++a) {
            if (!vetor[a].val()) {
                vetor[a].addClass('error');
            }
        }
        dadosTrulse(false);
    }
}

function dadosTrulse(trulse) {
    dados = trulse;
}

//Mostra mensagem
function mensagem(texto) {
    $("#erro p").text(texto).addClass('alert-danger').addClass('alert');

    if (texto)
        $("#erro").show("slow");
    else
        $("#erro").hide("slow");
}

//Quando a página estiver completamente carregada...
$(document).ready(function () {

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

    $('#mailAlternateAddress').change(function () {
        $('#mailAlternateAddress').removeClass('error');
    });

    $('#telephoneNumber').change(function () {
        $('#telephoneNumber').removeClass('error');
    });

    $('#cellphoneNumber').change(function () {
        $('#cellphoneNumber').removeClass('error');
    });

    $('#solicitar').click(function (e) {
        verificaCampos();

        if (dados && login) {
            if (confirm("Confirme as informações antes de realizar o cadastro:\n\nNome: " + $('#cn').val() + "\nSobrenome: " + $('#sn').val() + "\nMatrícula: " + $('#employeeNumber').val() + "\nUID: " + $('#uid').val() + "\nE-mail: " + $('#mailAlternateAddress').val() + "\nTelefone: " + $('#telephoneNumber').val() + "\nCelular: " + $('#cellphoneNumber').val() + "\n\nAs informações estão corretas?")) {
                document.forms[0].submit();
                return true;
            } else {
                e.preventDefault();
            }
        } else if (!dados) {
            mensagem("Por favor, verifique seus dados!");
            e.preventDefault();
        } else if (!login) {
            mensagem("Por favor, verifique seu login!");
            e.preventDefault();
        }
    });
}
);