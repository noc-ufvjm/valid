<?php

require_once(dirname(__file__) . './../conf/Config.php');
require_once(dirname(__file__) . '/Usuario.php');

class Siga {

    private $sigaconn;

    public function __construct() {
        Config::load();
    }

    public function conectar() {
        if (!function_exists('pg_connect'))
            throw new Exception('PostgreSQL extension not installed/loaded');

        if (!($this->sigaconn = pg_connect("host=" . Config::get('hostSiga') . " dbname=" . Config::get('dbSiga') . " port=" . Config::get('portSiga') . " user=" . Config::get('userSiga') . " password=" . config::get('passwdSiga')))) {
            echo "Não foi possível estabelecer uma conexão com o banco de dados do SIGA.<br />";
            return;
        }
    }

    public function getUsuario($cpf) {
        $cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $cpf)); // filtra digitos
        $this->conectar();
        //$sql = 'SELECT ' . implode(', ', $this->campos) . ' FROM ' . $this->tabelas . " WHERE cpf = '$cpf'";
        //$sql = "select p.idpessoa as id, p.nome as nome, p.email as mail, p.datanasc, p.telefone, p.celular, p.endereco, p.bairro, p.cep, u.login, u.passmd5 from cm_pessoa p join cm_usuario u using (idpessoa)";
        $sql = "select p.nome as nome, p.email as mail, p.telefone, p.celular, u.login as matricula, u.passmd5 as senha from cm_pessoa p join cm_usuario u using (idpessoa) where cpf = '$cpf'";

        $result = pg_exec($this->sigaconn, $sql);
        $obj = pg_fetch_object($result);
        
        $obj->nome = $this->formata_nome($obj->nome);
        $aux = explode(" ", $obj->nome, 2);
        $obj->apelido = $aux[0];
        $obj->sobrenome = $aux[1];
        $obj->cpf = $cpf;
        $obj->telefones = array();
        if ($obj->telefone) $obj->telefones[] = $this->check_telefone($obj->telefone);
        if ($obj->celular) $obj->telefones[] = $this->check_telefone($obj->celular);

        unset($obj->telefone);
        unset($obj->celular);
        $usuario = new Usuario;
        $usuario->setUsuario($obj);
        return $usuario;
    }
    
    public function autenticacao($cpf, $senha){
        $cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $cpf)); // filtra digitos
        $this->conectar();
        $sql = "select u.passmd5 as senha from cm_pessoa p join cm_usuario u using (idpessoa) where cpf = '$cpf'";

        $result = pg_exec($this->sigaconn, $sql);
        $array = pg_fetch_all($result);
        foreach($array as $values){
            if (md5($senha) == $values['senha']) {
                $result = TRUE;
            } else {
                error_log("Nao foi possivel autenticar.");
                $result = FALSE;
            }
            if ($result){
                return TRUE;
            }
        }
        return FALSE;
    }

    public function check_telefone($telefone) {
        if ($telefone != "") {
            $telefone = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $telefone)); // filtra digitos
            if ((strlen($telefone) == 10) && ($telefone[0] != "0" ))
                $telefone = "(" . substr($telefone, 0, 2) . ") " . substr($telefone, 2, 4) . "-" . substr($telefone, 6, 4);
            elseif ((strlen($telefone) == 11) && ($telefone[0] == "0" ))
                $telefone = "(" . substr($telefone, 1, 2) . ") " . substr($telefone, 3, 4) . "-" . substr($telefone, 7, 4);
        }
        return $telefone;
    }

    function formata_nome($nome) {
        $a1 = array(" De ", " Da ", " Do ", " Dos ", " E ", " Em ");
        $a2 = array(" de ", " da ", " do ", " dos ", " e ", " em ");
        $nome = mb_strtolower($nome, 'UTF-8');                  // converte todas as letras para minúsculas
        $nome = mb_convert_case($nome, MB_CASE_TITLE, "UTF-8"); // converte apenas as iniciais para maiúsculas
        $nome = str_replace($a1, $a2, $nome);
        return $nome;
    }

}
