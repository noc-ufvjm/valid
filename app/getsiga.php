<?php
require_once dirname(__file__).'/../model/Siga.php';
require_once dirname(__file__).'/../model/Ldap.php';

session_start();

header('content-type: application/json');

//Faz requisição e adequação do cpf ao padrão de 11 dígitos
$cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $_REQUEST['cpf']));

//Faz requisição da senha
$senha = $_REQUEST['senha'];

$siga = new Siga();

//Se o usuário existir no siga, verificar se o usuário já existe no ldap
if ($siga->autenticacao($cpf, $_REQUEST['senha'])) {
    
    $ldap = new Ldap;
    
    //Se o usuário já existir no ldap, retornar mensagem e parar execução
    if ($ldap->getUsuario($cpf)){
        echo json_encode('Already exists');
        exit;
    }
    
    //Como o cpf existe no siga e não no ldap, disponibilizar o cpf na seção e setar dados como true
    $_SESSION['cpf'] = $cpf;
    $dados = 'true';
    
    //Como o cpf não existe na seção, setar dados como false
} else {
    $dados = 'false';
}

//Retornar a resposta
echo json_encode($dados);