<?php

require_once dirname(__file__) . '/../../model/Ldap.php';
header('content-type: application/json');

$ldap = new LDAP;

//UID recebido pela sessão
$uid = $_REQUEST['uid'];
$acao = $_REQUEST['acao'];

$resposta = false;

if ($acao == "acc")
    $resposta = $ldap->moveUsuario($uid);
else {
    //The message
    $msg = "First line of text\nSecond line of text";

    //Use wordwrap() if lines are longer than 70 characters
    $msg = wordwrap($msg, 70);

    //Send email
    mail("pitterpereira@gmail.com", "My subject", $msg);
}

echo json_encode($resposta);
