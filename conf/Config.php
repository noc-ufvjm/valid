<?php

class Config {

    private static $conf = array();

    public function load() {
        self::$conf = json_decode(file_get_contents(dirname(__file__) . '/config.json'));
    }

    public function set($name, $value) {
        self::$conf->$name = $value;
    }

    public function get($name) {
        return self::$conf->$name;
    }

}