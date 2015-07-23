<?php

require_once dirname(__file__).'/../model/Ldap.php';
header('content-type: application/json');

$attr = array("login");
$dados = new Ldap();
$dados = $dados->getUsuario($_REQUEST['login']);
if ($dados != FALSE) {
    echo json_encode("false");
}else{
    echo json_encode("true");
}