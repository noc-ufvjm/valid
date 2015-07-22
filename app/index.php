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
            echo 'usuario autenticado';
            $_SESSION['login'] = $_POST['login'];
            $s->display('info_siga.html');
        } else {
            $s->assign('erro', true);
            $s->display('index.html');
        }
    } else {
        echo 'sem valores para comparar';
        unset($_SESSION);
        $s->display('index.html');
    }
    if ($_POST['cpf'] != null && $_POST['senha'] != null) {
        $ldap = new Siga();
        if ($ldap->autenticacao($_POST['cpf'], $_POST['senha'])) {
            error_log("usuario com " . $_POST['cpf'] . " autenticado");
            $_SESSION['cpf'] = $_POST['cpf'];
            header("location:info_siga.php");
        } else {
            $s->assign('erro_solicitacao', true);
            $s->display('index.html');
        }
    }