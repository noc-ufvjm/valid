<?php

require_once dirname(__file__) . '/../../model/Ldap.php';
header('content-type: application/json');

//Início da sessão
session_start();

//Se o cpf não existir na sessão, ir para login.php
if (!array_key_exists('cpf', $_SESSION)) {
    header('Location: index.php');
    exit;
}

//Password recebido pela sessão
$brPersonCPF = $_SESSION['cpf'];

//Dados preenchidos nos inputs
$cn = $_REQUEST['cn'] . " " . $_REQUEST['sn'];
$sn = $_REQUEST['sn'];
$employeeNumber = $_REQUEST['employeeNumber'];
$givenName = $_REQUEST['givenName'];
$uid = $_REQUEST['uid'];
$mail = $_REQUEST['mail'];
$telephoneNumber = $_REQUEST['telephoneNumber'];
$cellphoneNumber = $_REQUEST['cellphoneNumber'];
$userPassword = $_REQUEST['userPassword'];

//Vetor que contém os dados
$vetor = [ 0 => $brPersonCPF, 
    1 => $cn, 
    2 => $sn, 
    3 => $employeeNumber, 
    4 => $givenName, 
    5 => $uid, 
    6 => $mail, 
    7 => $telephoneNumber, 
    8 => $cellphoneNumber, 
    9 => $userPassword ];

//Se alguns dos dados não estiverem preenchidos, voltar à página
if (!$brPersonCPF || !$cn || !$sn || !$employeeNumber || !$givenName || !$uid || !$mail || !$telephoneNumber || !$cellphoneNumber || !$userPassword) {
    header('Location: solicitar-acesso.php');
    //Se estiver tudo ok, chamar função de cadastro
} else {
    $ldap = new LDAP();
    echo json_encode($ldap->cadastrar($vetor, "uid=$uid,ou=solicitacoes,dc=ufvjm,dc=edu,dc=br"));
}