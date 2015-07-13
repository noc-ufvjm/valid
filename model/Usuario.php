<?php

class Usuario {

    private $values = null;

    public function __get($name) {
        if (@!array_key_exists($name, $this->values))
            return NULL;
        //throw new Exception(__CLASS__ . ': Attribute ' . $name . ' does not exist');

        return $this->values->$name;
    }

    public function setUsuario($dados) {
        $this->values = $dados;
    }

    public function mapSiga() {
        return array(
            "nome" => "nome",
            "mail" => "email",
            "telefones" => array("telefone", "celular"),
            "matricula" => "login",
            "senha" => "passmd5"
        );
    }

    public function mapLdap() {
        return array(
            "login" => "uid",
            "nome" => "cn",
            "sobrenome" => "sn",
            "mail" => "mail",
            "apelido" => "givenName",
            "matricula" => "employeeNumber",
            "foto" => "jpegPhoto",
            "telefones" => "telephoneNumber",
            "cpf" => "brPersonCPF",
            "senha" => "userPassword"
        );
    }

}
