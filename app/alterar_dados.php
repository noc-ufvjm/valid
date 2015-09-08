<?php

require_once 'smarty3/Smarty.class.php';
require_once dirname(__file__) . '/../model/Siga.php';
require_once dirname(__file__) . '/../model/Ldap.php';

session_start();

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

//Display de página que utiliza template "template"
$ldap = new Ldap;
$usuario = $ldap->getUsuario($_SESSION['login']);

//Verifica se o usuário possui foto
if ($usuario->foto) {
    //Se existir, baixar a foto para a pasta do site e associar valor verdadeiro à variável foto, usada no html da "home"
    file_put_contents("imagens/" . $usuario->login . ".jpg", $usuario->foto);
    
    //Este valor é utilizado num if. Se o usuário tiver foto, carregar a foto dele. Se não, carregar a imagem padrão
    $s->assign('foto', true);
} else {
    $s->assign('foto', false);
}

//Associa à variável usuário, um objeto recheado de valores para serem utilizados no html da home
$s->assign('usuario', $usuario);

//Mostra a página home
$s->display('alterar_dados.html');