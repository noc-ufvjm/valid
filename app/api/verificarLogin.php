<?php
require_once dirname(__file__).'/../../model/Ldap.php';
header('content-type: application/json');

//Faz-se a pesquisa pelo nome do usuário digitado
$dados = new Ldap();
$resposta = $dados->getUsuario($_REQUEST['login']);

echo json_encode($resposta);