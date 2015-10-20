<?php

require_once dirname(__file__) . '/../model/Ldap.php';
header('content-type: application/json');

$cn = $_REQUEST['cn'];
$sn = $_REQUEST['sn'];
$employeeNumber = $_REQUEST['employeeNumber'];
$brPersonCPF = $_REQUEST['brPersonCPF'];
$uid = $_REQUEST['uid'];
$mailAlternateAddress = $_REQUEST['mailAlternateAddress'];
$telephoneNumber = $_REQUEST['telephoneNumber'];

$vetor = [0 => $cn, 1 => $sn, 2 => $employeeNumber, 3 => $brPersonCPF, 4 => $uid, 5 => $mailAlternateAddress, 6 => $telephoneNumber];

if (!$cn || !sn || !$employeeNumber || !$brPersonCPF || !$mailAlternateAddress || !$telephoneNumber || !$uid) {
    header('Location: cadastrar-usuario.php');
} else {
    $ldap = new LDAP();
    echo $ldap->cadastrar($vetor, "uid=$uid,ou=teste,ou=usuarios,dc=ufvjm,dc=edu,dc=br");
}