<?php
require_once dirname(__file__).'/../../model/Ldap.php';

session_start();

header('content-type: application/json');

//Faz requisição do login
$login = $_REQUEST['login'];

//Faz requisição da senha
$senha = $_REQUEST['senha'];

$ldap = new Ldap();

//Testa conexão do LDAP com dados do usuário
if($ldap->autenticacao($login, $senha)) {
    echo json_encode("ok");
    exit;
}
else {
    echo json_encode("ko");
    exit;
}