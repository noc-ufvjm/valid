<?php

require_once(dirname(__file__) . './../conf/Config.php');
require_once(dirname(__file__) . '/Usuario.php');

class Siga {

    private $sigaconn;

    //Carrega o arquivo config.json, onde constam informações úteis
    public function __construct() {
        Config::load();
    }

    //Realiza conexão ao banco de dados do SIGA
    public function conectar() {

        //Verifica se o postgresql está instalado no servidor
        if (!function_exists('pg_connect')) {
            throw new Exception('PostgreSQL extension not installed/loaded');
            return;
        }

        //Estabelece a conexão com o SIGA
        if (!($this->sigaconn = pg_connect("host=" . Config::get('siga_host') . " dbname=" . Config::get('siga_db') . " port=" . Config::get('siga_port') . " user=" . Config::get('siga_user') . " password=" . config::get('siga_password')))) {
            echo "Não foi possível estabelecer uma conexão com o banco de dados do SIGA.<br />";
            return;
        }
    }
    
    //Vericifica se existe determinado CPF e senha no SIGA
    public function autenticacao($cpf, $senha) {
        
        //Filtra digitos do CPF digitado - Removendo caracteres especiais, espaços, etc.
        $cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $cpf));
        
        //Realiza conexão ao banco de dados do SIGA
        $this->conectar();

        //Realiza a pesquisa no banco de dados do SIGA, baseando-se no CPF
        $result = pg_exec($this->sigaconn, "select u.passmd5 as senha from cm_pessoa p join cm_usuario u using (idpessoa) where cpf = '$cpf'");
        
        //Os dados pesquisados são recebidos por este objeto.
        $array = pg_fetch_all($result);
        
        //Verifica os cadastros com o determinado CPF dentro do SIGA
        foreach ($array as $values) {
            if (md5($senha) == $values['senha']) {
                $result = TRUE;
            } else {
                error_log("Nao foi possivel autenticar.");
                $result = FALSE;
            }
            if ($result) {
                return TRUE;
            }
        }
        return FALSE;
    }

    //Pega as informações do usuário do SIGA e as retorna
    public function getUsuario($cpf) {

        //Filtra digitos do CPF digitado - Removendo caracteres especiais, espaços, etc.
        $cpf = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $cpf));

        //Realiza conexão ao banco de dados do SIGA
        $this->conectar();

        //Realiza a pesquisa no banco de dados do SIGA, baseando-se no CPF
        $result = pg_exec($this->sigaconn, "select p.nome as nome, p.email as mail, p.telefone, p.celular, u.login as matricula, u.passmd5 as senha from cm_pessoa p join cm_usuario u using (idpessoa) where cpf = '$cpf'");
        
        //Os dados pesquisados são recebidos por este objeto.
        $obj = pg_fetch_object($result);

        //O nome do usuário é formatado
        $obj->nome = $this->formata_nome($obj->nome);
        
        //Separação dos sobrenomes do primeiro nome
        $aux = explode(" ", $obj->nome);
        $obj->apelido = $aux[0] . " " . $aux[1];
        
        //Eliminação do primeiro nome
        unset($aux[0]);
        
        //Junta os sobrenomes em apenas uma variável
        $obj->sobrenome = implode(" ", $aux);
        
        $obj->cpf = $cpf;
       
        //Os telefones são formatados
        $obj->telefones = array();
        if ($obj->telefone)
            $obj->telefones[] = $this->formata_telefone($obj->telefone);
        if ($obj->celular)
            $obj->telefones[] = $this->formata_telefone($obj->celular);

        //Eliminação das variáveis não tulizadas mais
        unset($obj->telefone);
        unset($obj->celular);
        
        //Criação do usuário com os valores retirados do SIGA
        $usuario = new Usuario;
        $usuario->setUsuario($obj);
        
        return $usuario;
    }

    //Formata os números de telefone
    public function formata_telefone($telefone) {
        if ($telefone != "") {
            $telefone = str_replace(" ", "", preg_replace("/[^0-9\s]/", "", $telefone)); //Filtra digitos
            if ((strlen($telefone) == 10) && ($telefone[0] != "0" ))
                $telefone = "(" . substr($telefone, 0, 2) . ")" . " " . substr($telefone, 2, 4) . "-" . substr($telefone, 6, 4);
            elseif ((strlen($telefone) == 11) && ($telefone[0] == "0" ))
                $telefone = "(" . substr($telefone, 1, 2) . ")" . " " . substr($telefone, 3, 4) . "-" . substr($telefone, 7, 4);
        }
        return $telefone;
    }

    //Formata os nomes
    function formata_nome($nome) {
        $a1 = array(" De ", " Da ", " Do ", " Dos ", " E ", " Em ");
        $a2 = array(" de ", " da ", " do ", " dos ", " e ", " em ");
        $nome = mb_strtolower($nome, 'UTF-8');                  //Converte todas as letras para minúsculas
        $nome = mb_convert_case($nome, MB_CASE_TITLE, "UTF-8"); //Converte apenas as iniciais para maiúsculas
        $nome = str_replace($a1, $a2, $nome);
        return $nome;
    }

}
