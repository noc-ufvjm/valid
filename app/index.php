<?php
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Ldap.php';
    require_once dirname(__file__).'/../model/Siga.php';

    session_start();
        
    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");

    //Criação de variável
    //$s->assign('titulo', 'Bem Vindo!');

    if ($_POST['login'] != null && $_POST['password'] != null) {
        $ldap = new Ldap();
        if ($ldap->autenticacao($_POST['login'], $_POST['password'])) {
            $_SESSION['login'] = $_POST['login'];
            $s->display('info_siga.html');
        } else {
            $s->assign('erro', true);
            $s->display('index.html');
        }
    } else {
        unset($_SESSION);
        $s->display('index.html');
    }