function verificar_click(e) {
    $('#login').removeClass('ok error');
    $.get('/valid/app/verificarLogin.php?login=' + $('#login').val(), function (data, status) {
        if ($('#login').val() !== "") {
            if (status !== 'success') {
                $('#login').addClass('error');
            } else if (data === 'false') {
                $('#login').addClass('error');
            } else {
                $('#login').addClass('ok');
            }
        }
    });
    e.preventDefault();
}

$(document).ready(function () {
    $('#login').blur(verificar_click);

    $('#senha').keyup(function () {

        if ($('#senha').val() !== "") {
            if ($('#senha').val() === $('#check_senha').val()) {
                $('#senha').addClass('ok').removeClass('error');
                $('#check_senha').addClass('ok').removeClass('error');
            } else {
                $('#senha').addClass('error').removeClass('ok');
                $('#check_senha').addClass('error').removeClass('ok');
            }
        }
        else {
            $('#senha').removeClass('ok error');
            $('#check_senha').removeClass('ok error').val('');
        }
    });

    $('#check_senha').keyup(function () {

        if ($('#check_senha').val() !== "") {
            if ($('#senha').val() === $('#check_senha').val()) {
                $('#senha').addClass('ok').removeClass('error');
                $('#check_senha').addClass('ok').removeClass('error');
            } else {
                $('#senha').addClass('error').removeClass('ok');
                $('#check_senha').addClass('error').removeClass('ok');
            }
        }
        else {
            $('#senha').removeClass('ok error');
            $('#check_senha').removeClass('ok error');
        }
    });

    //Carrega a imagem selecionada na tag img
    $(function () {
        $('#my-file-selector').on('change', function () {

            var input = $(this)[0];
            var file = input.files[0];

            if (file.type === "image/jpeg") {

                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#user').attr('src', e.target.result);
                }
                reader.readAsDataURL(file);
            } else {
                alert("NAPPA!!");
            }
        });
    });
});