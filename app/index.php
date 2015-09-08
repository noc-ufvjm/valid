<?php
require_once 'smarty3/Smarty.class.php';
require_once dirname(__file__) . '/../model/Ldap.php';

session_start();

$s = new Smarty;

//Diretório de templates
$s->addTemplateDir("../view/templates");

//Diretório de templates compilados
$s->setCompileDir("../view/com_templates");

//Se houver post de login e senha, realizar tentativa de autenticação
if ($_POST['login'] != null && $_POST['password'] != null) {

    //Novo objeto Ldap
    $ldap = new Ldap();

    //Se a autenticação passar, ir para a página home e parar a execução
    if ($ldap->autenticacao($_POST['login'], $_POST['password'])) {
        $_SESSION['login'] = $_POST['login'];
        header("Location: home.php");
        exit;

    //Se a autenticação falhar, atribuir valor true à variável erro e recarregar a página index
    } else {
        $s->assign('erro', true);
        $s->display('index.html');
    }
    
//Se houver post de login, mas não houver post de senha, atribuir valor true à variável erro e recarregar a página index
} else if ($_POST['login'] != null && $_POST['password'] == null) {
    $s->assign('erro', true);
    $s->display('index.html');

//Ao se entrar ou reentrar na página a sessão é destruída
} else {
    unset($_SESSION);
    $s->display('index.html');
}