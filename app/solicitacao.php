<?php 
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Siga.php';    

    session_start();

    $s = new Smarty;
    
    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");

    //Display de página que utiliza template "template"
//    $s->display('solicitacao.html');

    if ($_POST['cpf'] != null && $_POST['senha'] != null) {
        $ldap = new Siga();
        if ($ldap->autenticacao($_POST['cpf'], $_POST['senha'])) {
            error_log("usuario com " . $_POST['cpf'] . " autenticado");
            $_SESSION['cpf'] = $_POST['cpf'];
//            $s->display('info_siga.html');
            header("location:info_siga.php");
        } else {
            $s->assign('erro', true);
            $s->display('solicitacao.html');
        }
    } else {
        echo 'sem valores para comparar';
        unset($_SESSION);
        //var_dump($_SESSION);
        $s->display('solicitacao.html');
    }
?>
