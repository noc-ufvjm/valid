<?php
require_once dirname(__file__).'/../../model/Siga.php';
header('content-type: application/json');

//Faz requisição do cpf
$cpf = $_REQUEST['cpf'];

$siga = new Siga();

$resultado = $siga->getStudentConfirmation($cpf) + $siga->getTAProfConfirmation($cpf);

echo json_encode($resultado);