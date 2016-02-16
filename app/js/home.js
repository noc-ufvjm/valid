//Verifica os vínculos do usuário
function verificaVínculo() {
    $.get('/valid/app/api/verificarVinculos.php?cpf=' + $('#cpf').text(), function (data) {

        console.log(data);

        if (data === 1) {
            $("#vinculos").append('<img class="vinc" id="ta" src="imagens/ta.png" title="TA" />');
        } else if (data === 2) {
            $("#vinculos").append('<img class="vinc" id="professor" src="imagens/professor.png" title="Professor" />');
        } else if (data === 6) {
            $("#vinculos").append('<img class="vinc" id="aluno" src="imagens/aluno.png" title="Aluno" />');
            $("#vinculos").append('<img class="vinc" id="ta" src="imagens/ta.png" title="TA" />');
        } else if (data === 7) {
            $("#vinculos").append('<img class="vinc" id="aluno" src="imagens/aluno.png" title="Aluno" />');
            $("#vinculos").append('<img class="vinc" id="professor" src="imagens/professor.png" title="Professor" />');
        } else {
            $("#vinculos").append('<img class="vinc" id="aluno" src="imagens/aluno.png" title="Aluno" />');
        }

    });
}

//Quando a página estiver completamente carregada...
$(document).ready(function () {

    verificaVínculo();

});