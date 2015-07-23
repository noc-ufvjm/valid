<?php
require_once dirname(__file__).'/../model/Siga.php';
require_once dirname(__file__).'/../model/Ldap.php';

session_start();

header('content-type: application/json');

$cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $_REQUEST['cpf']));
$senha = $_REQUEST['senha'];
$siga = new Siga();

if ($siga->autenticacao($cpf, $_REQUEST['senha'])) {
    $ldap = new Ldap;
    if ($ldap->getUsuario($cpf)){
        echo json_encode('Already exists');
        exit;
    }
    $_SESSION['cpf'] = $cpf;
    $dados = 'true';
} else {
    $dados = 'false';
}
echo json_encode($dados);