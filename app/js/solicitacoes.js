function getSolicitantes() {
    //Envia os dados para serem processados pela api getsiga.php
    $.get("/valid/app/api/retornaUsuarios.php", function (data) {
        if (data) {

            //$("#tabela").html('');
            $("#tabela").append("<tr><td class='table-first'>Nome</td><td class='table-first'>E-mail</td><td class='table-first'>Vínculo</td><td class='table-first'>Aceitar</td><td class='table-first'>Rejeitar</td></tr>");

            for (var a = 0; a < data['count']; ++a) {
                var f = function () {
                    var removeponto = removePonto(data[a]['uid'][0]);
                    var cn = data[a]['cn'][0];
                    var mail = data[a]['mail'][0];
                    var uid = data[a]['uid'][0];
                    var cpf = data[a]['brpersoncpf'][0];
                    var i = a;

                    getVinculos(cpf, function (vinculos) {
                        $("#tabela").append("<tr id=" + removeponto + "><td class='data text-left'>" + cn + "</td><td class='data'>" + mail + "</td><td class='data'>" + vinculos + "</td><td class='data'><input type='radio' class='aceitar' value=" + uid + " name='select" + i + "'></td><td class='data'><input type='radio' class='rejeitar' value=" + uid + " name='select" + i + "'></td></tr>");
                    })
                };
                f();
            }
        } else {
            $("#tabelas-place").html("<p id='vazio' class='alert alert-success'>Não existem novas solicitações de acesso!</p>");
        }
    });
}

function processarSolicitacoes(uid, acao) {
    //Envia os dados para serem processados pela api getsiga.php
    $.post("/valid/app/api/processarSolicitacoes.php", {uid: uid, acao: acao}, function (data) {
        if (data) {
        }
    });
}

function removePonto(string) {
    string = string.replace('.', '');

    return string;
}

//Mostra mensagem de erro/confirmação de dados
function mensagem(texto) {
    $("#processamento p").text(texto).addClass('alert-success').addClass('alert');
    $("#processamento").show("slow");

    setTimeout(function () {
        $("#processamento").hide('slow');
    }, 3000);
}

function getVinculos(cpf, callback) {
    $.get('/valid/app/api/verificarVinculos.php?cpf=' + cpf, function (data) {

        if (data === 1) {
            vincs = '<img id="ta" src="imagens/ta.png" title="TA" />';
        } else if (data === 2) {
            vincs = '<img id="professor" src="imagens/professor.png" title="Professor" />';
        } else if (data === 6) {
            vincs = '<img id="aluno" src="imagens/aluno.png" title="Aluno" /><img id="ta" src="imagens/ta.png" title="TA" />';
        } else if (data === 7) {
            vincs = '<img id="aluno" src="imagens/aluno.png" title="Aluno" /><img id="professor" src="imagens/professor.png" title="Professor" />';
        } else {
            vincs = '<img id="aluno" src="imagens/aluno.png" title="Aluno" />';
        }

        callback(vincs);
    });
}

$(document).ready(function () {
    getSolicitantes();

    var string = "grande.nappa";

    $("#desmarcar-todos").click(function () {
        $(".aceitar").removeAttr('checked');
        $(".rejeitar").removeAttr('checked');
    });

    $("#processar").click(function () {
        var aceitar = [], rejeitar = [];

        $.each($("input[class='aceitar']:checked"), function () {
            aceitar.push($(this).val());
        });

        $.each($("input[class='rejeitar']:checked"), function () {
            rejeitar.push($(this).val());
        });

        if (aceitar.length > 0 || rejeitar.length > 0) {

            for (var a = 0; a < aceitar.length; ++a) {
                processarSolicitacoes(aceitar[a], "acc");

                $('#' + removePonto(aceitar[a])).addClass('success');
                $('#' + removePonto(aceitar[a])).hide("slow");
            }

            for (var a = 0; a < rejeitar.length; ++a) {
                processarSolicitacoes(rejeitar[a], "dn");

                $('#' + removePonto(rejeitar[a])).addClass('danger');
                $('#' + removePonto(rejeitar[a])).hide("slow");
            }
        }
    });
});