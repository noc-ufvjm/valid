<?php

require_once dirname(__file__) . '/../../model/Ldap.php';

session_start();

header('content-type: application/json');

$uid = $_SESSION['login'];

$dado = $_REQUEST['dado'];
$tipo = $_REQUEST['tipo'];

$ldap = new LDAP();

if ($tipo == 0) {
    $ldap->modificar("apelido", "uid=$uid,ou=teste,ou=usuarios,dc=ufvjm,dc=edu,dc=br", $dado);
} else if ($tipo == 1) {
    $ldap->modificar("email_alternativo", "uid=$uid,ou=teste,ou=usuarios,dc=ufvjm,dc=edu,dc=br", $dado);
} else if ($tipo == 2) {
    $ldap->modificar("telefone", "uid=$uid,ou=teste,ou=usuarios,dc=ufvjm,dc=edu,dc=br", $dado);
} else {
    echo json_encode(false);
}

echo json_encode(true);


