<?php 
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Siga.php';    

    session_start();
    if (!array_key_exists('cpf', $_SESSION))
    {
        header('location: index.php');
        exit;
    }

    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");
    //Display de página que utiliza template "template"
    if (array_key_exists('cpf', $_SESSION)) {
        $siga = new Siga;
        $usuario = $siga->getUsuario($_SESSION['cpf']);
        $s->assign('usuario', $usuario);
    }
    $s->display('info_siga.html');
?>
