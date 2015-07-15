<?php
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Ldap.php';

    session_start();
        
    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");

    //Criação de variável
    //$s->assign('titulo', 'Bem Vindo!');

//    if (!array_key_exists('login', $_SESSION) && $_SERVER['REQUEST_METHOD'] == 'POST') {
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
        //var_dump($_SESSION);
        $s->display('index.html');
    }