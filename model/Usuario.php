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
}
