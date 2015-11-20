<?php

require_once 'smarty3/Smarty.class.php';
require_once dirname(__file__) . '/../model/Ldap.php';

session_start();

$ldap = new Ldap;

//Se a variável login não existir na sessão, não deixar passar do index
if (!array_key_exists('login', $_SESSION)) {
    header('Location: index.php');
    exit;
}

$s = new Smarty;

//Diretório de templates
$s->addTemplateDir("../view/templates");

//Diretório de templates compilados
$s->setCompileDir("../view/com_templates");

$usuario = $ldap->getUsuario($_SESSION['login']);

//Verifica se o usuário possui e-mail alternativo
if ($usuario->mailAlternateAddress) {
    $s->assign('alt_mail', true);
} else {
    $s->assign('alt_mail', false);
}

//Verifica se o usuário possui foto
if ($usuario->jpegPhoto) {
    //Se existir, baixar a foto para a pasta do site e associar valor verdadeiro à variável foto, usada no html da "home"
    file_put_contents("imagens/" . $usuario->uid . ".jpg", $usuario->jpegPhoto);

    //Este valor é utilizado num if. Se o usuário tiver foto, carregar a foto dele. Se não, carregar a imagem padrão
    $s->assign('foto', true);
} else {
    $s->assign('foto', false);
}

//Associa à variável usuário, um objeto recheado de valores para serem utilizados no html da home
$s->assign('usuario', $usuario);

if ($ldap->estadoUsuario($_SESSION['login'], "cn=ldap,ou=identity,ou=grupos")) {
    $s->assign('estado', "adm");
    echo "<br/><br/><br/><br/><br/><br/><br/>adm";
} else if ($ldap->estadoUsuario($_SESSION['login'], "ou=solicitacoes")) {
    $s->assign('estado', "sol");
    echo "<br/><br/><br/><br/><br/><br/><br/>sol";
} else {
    $s->assign('estado', "usu");
    echo "<br/><br/><br/><br/><br/><br/><br/>usu";
}

//Mostra a página home
$s->display('home.html');
