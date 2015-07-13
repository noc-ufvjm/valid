<?php

require_once(dirname(__file__) . './../conf/Config.php');

class Ldap {

    private $ldapbind;
    private $ldapconn;

    public function __construct() {
        Config::load();
    }

    public function conectar() {
        $this->ldapconn = ldap_connect(Config::get('hostLdap')) or die("Não foi possível conectar com o LDAP server.");
        if ($this->ldapconn) {
            ldap_set_option($this->ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
            if (Config::get('startTlsLdap') == 'true') {
                if (!ldap_start_tls($this->ldapconn)) {
                    echo "start_tls fail";
                    ldap_close($this->ldapconn); //fecha conexão com o LDAP
                    return;
                }
            }

            $this->ldapbind = ldap_bind($this->ldapconn, Config::get('userLdap'), Config::get('passwdLdap'));
        } else {
            echo "Unable to connect to LDAP server";
        }
    }

    public function getUsuario($busca) {
        $this->conectar();
        $attr = array("uid", "cn", "sn", "givenName", "userPassword", "mail", "brPersonCPF", "employeeNumber", "jpegPhoto", "telephoneNumber");

        if (is_numeric($busca)) {
            $filter = "brPersonCPF=$busca";
        } else {
            $filter = "uid=$busca";
        }

        if ($this->getLdapbind()) {
            $sr = ldap_search($this->getLdapconn(), Config::get('basedn'), $filter, $attr);
            $info = ldap_get_entries($this->getLdapconn(), $sr);
            if ($info['count'] != 0) {
                $info = ldap_first_entry($this->getLdapconn(), $sr);
                $info = ldap_get_attributes($this->getLdapconn(), $info);

                $obj = (object) array();
                $obj->login = @$info['uid'][0];
                $obj->nome = @$info['cn'][0];
                $obj->sobrenome = @$info['sn'][0];
                $obj->apelido = @$info['givenName'][0];
                $obj->senha = @$info['userPassword'][0];
                $obj->mail = @$info['mail'][0];
                $obj->cpf = @$info['brPersonCPF'][0];
                $obj->matricula = @$info['employeeNumber'][0];
                $obj->foto = @$info['jpegPhoto'][0];
                $obj->telefones = @$info['telephoneNumber'];
                unset($obj->telefones['count']);

                $usuario = new Usuario;
                $usuario->setUsuario($obj);
                return $usuario;
            } else {
                return FALSE;
            }
        } else {
            error_log("Não foi possível estabelecer uma conexão com o LDAP");
            return FALSE;
        }
    }

    public function autenticacao($login, $senha) {
        $this->conectar();
        if (is_numeric($login)) {
            $filter = "brPersonCPF=$login";
        } else {
            $filter = "uid=$login";
        }
        $attr = array("userPassword");
        if ($this->getLdapbind()) {
            $sr = ldap_search($this->getLdapconn(), Config::get('basedn'), $filter, $attr);
            $info = ldap_get_entries($this->getLdapconn(), $sr);
            if ($info['count'] != 0) {
                $info = ldap_first_entry($this->getLdapconn(), $sr);
                $info = ldap_get_attributes($this->getLdapconn(), $info);
                if ("{md5}" . base64_encode(md5($senha, TRUE)) == $info['userPassword'][0]) {
                    return TRUE;
                } else {
                    return FALSE;
                }
            }
        } else {
            error_log("Não foi possível estabelecer uma conexão com o LDAP");
            return FALSE;
        }
    }

    public function gravar($usuario) {
        $obrigatorio = array("uid", "cn", "sn", "mail", "employeeNumber", "brPersonCPF", "userPassword");
        $this->conectar();
        $attr = $usuario->mapLdap();
        //var_dump($usuario);exit;
        if ($this->getLdapbind()) {
            foreach ($attr as $key => $value) {//passa o objeto $usuario para um array mapeado para o padrao LDAP
                if ($usuario->$key != NULL) {
                    $info[$value] = $usuario->$key;
                }
            }
            $info["userPassword"] = "{MD5}" . base64_encode(md5($info["userPassword"], TRUE));
            $dn = "uid=" . $info["uid"] . Config::get('baseMail');
            $info['objectclass'] = array("inetOrgPerson", "brPerson");
            $comparacao = array_diff($obrigatorio, array_keys($info));
            if (count($comparacao) > 0){//verificar se os valores obrigatorios estao todos preenchidos
                $msg = "Os seguintes campos são obrigatórios: ";
                foreach ($comparacao as $value) {
                    $msg .= "[" . $value . "] ";
                }
                error_log($msg);
                return false;
            }
            //var_dump($info);exit;
            if (ldap_add($this->getLdapconn(), $dn, $info)) {
                return true;
            } else {
                echo ldap_error($this->getLdapconn()) . PHP_EOL;
                return false;
            }
            $con->close();
        }
    }

    public function getLdapbind() {
        return $this->ldapbind;
    }

    public function getLdapconn() {
        return $this->ldapconn;
    }

}
