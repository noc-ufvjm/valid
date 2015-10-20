//Variáveis globais
var dados = false, login = false, cpf = false;

//Verifica se o login existe
function verificarLogin() {
    $.get('/valid/app/verificarLogin.php?login=' + $('#uid').val(), function (data, status) {
        if ($('#uid').val() !== "") {
            if (status !== 'success') {
                $('#uid').addClass('error').removeClass('ok');
                ;
                loginTrulse(false);
            } else if (data === 'false') {
                $('#uid').addClass('error').removeClass('ok');
                ;
                loginTrulse(false);
            } else {
                $('#uid').addClass('ok').removeClass('error');
                ;
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

//Verifica se o CPF existe
function verificarCPF() {
    if (($('#brPersonCPF').val()).length === 11) {
        $.get('/valid/app/verificarLogin.php?login=' + $('#brPersonCPF').val(), function (data, status) {
            if ($('#brPersonCPF').val() !== "") {
                if (status !== 'success') {
                    $('#brPersonCPF').addClass('error').removeClass('ok');
                    cpfTrulse(false);
                } else if (data === 'false') {
                    $('#brPersonCPF').addClass('error').removeClass('ok');
                    cpfTrulse(false);
                } else {
                    $('#brPersonCPF').addClass('ok').removeClass('error');
                    cpfTrulse(true);
                }
            }
            else {
                $('#brPersonCPF').removeClass('ok error');
                cpfTrulse(false);
            }
        });
    }
    else if (($('#brPersonCPF').val()).length === 0){
        $('#brPersonCPF').removeClass('ok error');
        mensagem();
        cpfTrulse(false);
    }
    else {
        $('#brPersonCPF').addClass('error').removeClass('ok');
        mensagem("Por favor, verifique seu cpf!");
        cpfTrulse(false);
    }
}

function cpfTrulse(trulse) {
    cpf = trulse;
}

//Verifica se o login existe
function getSIGAbyCPF() {
    
}



//Verifica os dados do cliente
function verificaCampos() {
    var vetor = [$('#cn'), $('#sn'), $('#uid'), $('#employeeNumber'), $('#brPersonCPF'), $('#mailAlternateAddress'), $('#telephoneNumber'), $('#userPassword'), $('#check_senha')];

    if ($('#cn').val() && $('#sn').val() && $('#uid').val() && $('#employeeNumber').val() && $('#brPersonCPF').val() && $('#mailAlternateAddress').val() && $('#userPassword').val() && $('#check_senha').val()) {
    }
    else {
        for (var a = 0; a < 11; ++a) {
            if (!vetor[a].val()) {
                vetor[a].addClass('error');
            }
        }
        return false;
    }
}

//Verifica os dados do cliente
function verificaDados() {
    if ($('#cn').val() && $('#sn').val() && $('#employeeNumber').val() && $('#brPersonCPF').val() && $('#mailAlternateAddress').val() && $('#telephoneNumber'))
        return true;
    else
        return false;

}

//Mostra mensagem
function mensagem(texto) {
    $("#erro p").text(texto).addClass('alert-danger').addClass('alert');
    
    if(texto)
        $("#erro").show("slow");
    else
        $("#erro").hide("slow"); 
}

$(document).ready(function () {
    $('#brPersonCPF').keyup(function () {
        verificarCPF();
    });

    $('#buscar-siga').click(function (e) {
        
    });

    $('#uid').keyup(function () {
        verificarLogin();
    });

    $('#cn').keyup(function () {
        $('#cn').removeClass('error');
    });
    $('#sn').keyup(function () {
        $('#sn').removeClass('error');
    });
    $('#employeeNumber').keyup(function () {
        $('#employeeNumber').removeClass('error');
    });
    $('#mailAlternateAddress').keyup(function () {
        $('#mailAlternateAddress').removeClass('error');
    });
    $('#telephoneNumber').keyup(function () {
        $('#telephoneNumber').removeClass('error');
    });

    $('#cadastrar').click(function (e) {
        verificaCampos();

        dados = verificaDados();

        if (dados && login && cpf) {
            if (confirm("Confirme as informações antes de realizar o cadastro:\n\nNome: " + $('#cn').val() + "\nSobrenome: " + $('#sn').val() + "\nMatrícula: " + $('#employeeNumber').val() + "\nCPF: " + $('#brPersonCPF').val() + "\nUID: " + $('#uid').val() + "\nE-mail: " + $('#mailAlternateAddress').val() + "\nTelefone: " + $('#telephoneNumber').val() + "\n\nAs informações estão corretas?")) {
                document.forms[0].submit();
                return true;
            }
            else {
                e.preventDefault();
            }
        }
        else if (!cpf) {
            mensagem("Por favor, verifique seu cpf!");
            e.preventDefault();
        }
        else if (!dados) {
            mensagem("Por favor, verifique seus dados!");
            e.preventDefault();
        }
        else if (!login) {
            mensagem("Por favor, verifique seu login!");
            e.preventDefault();
        }
    });
}
);