<?php

require_once dirname(__file__) . '/../../model/Ldap.php';

session_start();

header('content-type: application/json');

$login = $_REQUEST['login'];
$senha_atual = $_REQUEST['senha_atual'];
$senha_nova = $_REQUEST['nova_senha'];

$ldap = new Ldap();

    // conexão com o servidor LDAP usando TLS
    $ldapconn = ldap_connect('mail-ldap.ufvjm.edu.br') or die("Não foi possível conectar com o LDAP server.\n");

    if ($ldapconn) {
        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);

        // Comentar essa condicional se for usar SSL
        if (!ldap_start_tls($ldapconn)) {
            echo "\nstart_tls fail\n";
            ldap_close($ldapconn); //fecha conexão com o LDAP
            return;
        }

        $ldapbind = ldap_bind($ldapconn, "cn=admin,dc=ufvjm,dc=edu,dc=br", 'GoranNavojec_133');
        if ($ldapbind) {

            $dn = "uid=dti.teste,ou=semcpf,ou=usuarios,dc=ufvjm,dc=edu,dc=br";
            $values["userPassword"] = md5("dtidti");

            $add = ldap_modify($ldapconn, $dn, $values);

            if ($add)
                echo "\nSenha atualizada com sucesso!\n\n";
            else
                echo "\nAtualização da senha falhou!\n\n";
        }
    }

    echo json_encode("done");