function getSolicitantes() {
    //Envia os dados para serem processados pela api getsiga.php
    $.get("/valid/app/api/retornaUsuarios.php", function (data) {
        if (data) {
            $("#tabela").html('');
            $("#tabela").append("<tr><td class='table-first'>Nome</td><td class='table-first'>E-mail</td><td class='table-first'>UID</td><td class='table-first'>Aceitar</td><td class='table-first'>Rejeitar</td></tr>");

            for (var a = 0; a < data['count']; ++a) {
                $("#tabela").append("<tr id=" + removePonto(data[a]['uid'][0]) + "><td class='data text-left'>" + data[a]['cn'][0] + "</td><td class='data'>" + data[a]['mail'][0] + "</td><td class='data'>" + data[a]['uid'][0] + "</td><td class='data'><input type='radio' class='aceitar' value=" + data[a]['uid'][0] + " name='select" + a + "'></td><td class='data'><input type='radio' class='rejeitar' value=" + data[a]['uid'][0] + " name='select" + a + "'></td></tr>");
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
            console.log(data);
        }
    });
}

function removePonto(string) {
    string = string.replace('.','');
    
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
                
                console.log(rejeitar[a] + " rejeitado!");
                
                $('#' + removePonto(rejeitar[a])).addClass('danger');
                $('#' + removePonto(rejeitar[a])).hide("slow");
            }
        }
    });
});