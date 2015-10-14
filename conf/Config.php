<?php

class Config {

    private static $conf = array();

    //Carrega o arquivo config.json
    public function load() {
        self::$conf = json_decode(file_get_contents(dirname(__file__) . '/config.json'));
    }

    public function get($name) {
        return self::$conf->$name;
    }
}