<?php
require_once dirname(__file__).'/../../model/Ldap.php';
require_once dirname(__file__).'/../../model/Siga.php';
require_once dirname(__file__).'/../../model/Usuario.php';

session_start();

header('content-type: application/json');

//Faz requisição do cpf
$cpf = $_REQUEST['cpf'];

$ldap = new Ldap();
$siga = new Siga();
$usuario = new Usuario();

//Testa conexão do LDAP com dados do usuário
if($siga->userExists($cpf) && $ldap->userExists($cpf)){
    echo json_encode(array(0));
    exit;
} else if($siga->userExists($cpf) && $ldap->getUsuario($cpf) === false) {
    echo json_encode(array(1, $siga->getUsuario($cpf)));
    exit;
} else {
    echo json_encode(array(2));
    exit;
}