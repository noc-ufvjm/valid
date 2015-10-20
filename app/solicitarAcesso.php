<?php

require_once dirname(__file__) . '/../model/Ldap.php';
header('content-type: application/json');

session_start();

if (!array_key_exists('cpf', $_SESSION)) {
    header('Location: index.php');
    exit;
}

$cn = $_REQUEST['cn'];
$sn = $_REQUEST['sn'];
$employeeNumber = $_REQUEST['employeeNumber'];
$brPersonCPF = $_SESSION['cpf'];
$uid = $_REQUEST['uid'];
$mailAlternateAddress = $_REQUEST['mailAlternateAddress'];
$telephoneNumber = $_REQUEST['telephoneNumber'];
$cellphoneNumber = $_REQUEST['cellphoneNumber'];

$vetor = [0 => $cn, 1 => $sn, 2 => $employeeNumber, 3 => $brPersonCPF, 4 => $uid, 5 => $mailAlternateAddress, 6 => $telephoneNumber, 7 => $cellphoneNumber];

if (!$cn || !sn || !$employeeNumber || !$brPersonCPF || !$uid || !$mailAlternateAddress || !$telephoneNumber || !$cellphoneNumber) {
    header('Location: solicitar-acesso.php');
} else {
    $ldap = new LDAP();
    echo $ldap->cadastrar($vetor, "uid=$uid,ou=solicitacoes,dc=ufvjm,dc=edu,dc=br");
}