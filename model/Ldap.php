<?php

require_once(dirname(__file__) . '/../conf/Config.php');
require_once(dirname(__file__) . '/Usuario.php');

class Ldap {

    private $ldapbind, $ldap_connect;

    //Carrega o arquivo config.json, onde constam informações úteis
    public function __construct() {
        Config::load();
    }

    //Retorna o estado do bind do LDAP
    public function getLdapbind() {
        return $this->ldapbind;
    }

    //Retorna o estado da conexão ao LDAP
    public function getLdapconn() {
        return $this->ldap_connect;
    }

    //Realiza a conexão com o LDAP
    public function conectar() {

        //Realiza conexão com o host
        $this->ldap_connect = ldap_connect(Config::get('ldap_host')) or die("Não foi possível conectar com o LDAP server.");

        //Se CONSEGUIR realizar conexão com o host
        if ($this->ldap_connect) {

            /*//Inicia TLS. Se não der certo, encerra conexão com LDAP
            if (!ldap_start_tls($this->ldap_connect)) {

                echo "Falha no start_tls";

                //Fecha a conexão com o LDAP
                ldap_close($this->ldap_connect);

                return;
            }*/

            //Seta Protocolo - Manter versão 3
            ldap_set_option($this->ldap_connect, LDAP_OPT_PROTOCOL_VERSION, 3);

            //Realiza o bind do LDAP
            $this->ldapbind = ldap_bind($this->ldap_connect, Config::get('ldap_user'), Config::get('ldap_password'));
        }
        //Se NÃO CONSEGUIR realizar conexão com o host, printa que não deu certo.
        else {
            echo "Impossível conectar-se com o servidor LDAP";
        }
    }
    
    public function userExists($busca, $grupo) {
        //Realiza conexão com o LDAP
        $this->conectar();

        /* Verifica se o login está sendo ralizado com o cpf ou com o uid do usuário *
         * O filtro é alterado de acordo com o tipo de login utilizado */
        if (is_numeric($busca)) {
            $filter = "brPersonCPF=$busca";
        } else {
            $filter = "uid=$busca";
        }

        //Se o bind tiver sido um sucesso fazer a coleta dos dados do usuário e devolver na forma de objeto usuário
        if ($this->getLdapbind()) {
            //Pesquisa pelos dados do usuário no LDAP
            $sr = ldap_search($this->getLdapconn(), $grupo . ",dc=ufvjm,dc=edu,dc=br", $filter, array("brPersonCPF", "memberOf"));

            //Se o usuário existir nesse grupo
            if (ldap_count_entries($this->getLdapconn(), $sr)) {
                return true;
            } else
                return false;
        }
    }
    
    public function getAllUsers($grupo) {
        //Realiza conexão com o LDAP
        $this->conectar();
        
        $filter = "(objectClass=inetOrgPerson)";

        //Se o bind tiver sido um sucesso fazer a coleta dos dados do usuário e devolver na forma de objeto usuário
        if ($this->getLdapbind()) {
            //Pesquisa pelos dados do usuário no LDAP
            $sr = ldap_search($this->getLdapconn(), $grupo . ",dc=ufvjm,dc=edu,dc=br", $filter, array("cn", "uid", "mail", "brPersonCPF"));
            
            //Se o usuário existir nesse grupo
            //Recebe todas as entradas da pesquisa realizada
            $info = ldap_get_entries($this->getLdapconn(), $sr);
            
            //Se receber dados, verifica se a senha digitada (convertida para MD5) é a mesma que consta no LDAP (já em MD5)
            if ($info['count'] != 0) {
                return $info;
            }
        }
    }
    
    public function isAdmin($busca) {
        //Realiza conexão com o LDAP
        $this->conectar();

        $filter = "(&(memberOf=cn=ldap,ou=identity,ou=grupos,dc=ufvjm,dc=edu,dc=br)(uid=$busca))";
        
        //Se o bind tiver sido um sucesso fazer a coleta dos dados do usuário e devolver na forma de objeto usuário
        if ($this->getLdapbind()) {
            //Pesquisa pelos dados do usuário no LDAP
            $sr = ldap_search($this->getLdapconn(), "dc=ufvjm,dc=edu,dc=br", $filter, array("count"));

            //Recebe todas as entradas da pesquisa realizada
            $info = ldap_get_entries($this->getLdapconn(), $sr);
            
            //Se o usuário existir nesse grupo
            if ($info["count"]) {
                return true;
            } else
                return false;
        }
    }

    //Realiza a autenticação no LDAP
    public function autenticacao($login, $senha) {

        //Realiza conexão com o LDAP
        $this->conectar();

        /* Verifica se o login está sendo ralizado com o cpf ou com o uid do usuário *
         * O filtro é alterado de acordo com o tipo de login utilizado */
        if (is_numeric($login)) {
            $filter = "brPersonCPF=$login";
        } else {
            $filter = "uid=$login";
        }

        //Se o bind tiver sido um sucesso verifica se a senha digitada bate com a senha do LDAP
        if ($this->getLdapbind()) {

            //Pesquisa pela senha do usuário no LDAP
            $sr = ldap_search($this->getLdapconn(), Config::get('base_dn'), $filter, array("userPassword"));

            //Recebe todas as entradas da pesquisa realizada
            $info = ldap_get_entries($this->getLdapconn(), $sr);

            //Se receber dados, verifica se a senha digitada (convertida para MD5) é a mesma que consta no LDAP (já em MD5)
            if ($info['count'] != 0) {

                //Retorna a primeira entrada
                $info = ldap_first_entry($this->getLdapconn(), $sr);

                //Recebe os atributos da pesquisa
                $info = ldap_get_attributes($this->getLdapconn(), $info);

                //Conversão da hash para que o 'MD5' sempre seja maiúsculo. O restante da hash permanece inalterado
                $h_ldap = explode("}", $info['userPassword'][0]);
                $hash_ldap = strtoupper($h_ldap[0]) . "}" . $h_ldap[1];

                //Se a senha digitada (convertida para MD5) for igual a que já está no LDAP (Já em MD5), retorna TRUE
                if ($hash_ldap == "{MD5}" . base64_encode(md5($senha, true))) {

                    return true;

                    //Se não for igual, retorna FALSE
                } else {
                    return false;
                }
            }
            //Se não, retorna FALSE e mostra mensagem de erro
        } else {
            error_log("Não foi possível estabelecer uma conexão com o LDAP");
            return false;
        }
    }

    //Pesquisa e devolve os dados do usuário pesquisado
    public function getUsuario($busca) {

        //Realiza conexão com o LDAP
        $this->conectar();

        /* Verifica se o login está sendo ralizado com o cpf ou com o uid do usuário *
         * O filtro é alterado de acordo com o tipo de login utilizado */
        if (is_numeric($busca)) {
            $filter = "brPersonCPF=$busca";
        } else {
            $filter = "uid=$busca";
        }

        //Se o bind tiver sido um sucesso fazer a coleta dos dados do usuário e devolver na forma de objeto usuário
        if ($this->getLdapbind()) {

            //Pesquisa pelos dados do usuário no LDAP
            $sr = ldap_search($this->getLdapconn(), Config::get('base_dn'), $filter, array("uid", "cn", "sn", "givenName", "userPassword", "mail", "brPersonCPF", "employeeNumber", "jpegPhoto", "telephoneNumber"));

            //Recebe todas as entradas da pesquisa realizada
            $info = ldap_get_entries($this->getLdapconn(), $sr);

            //Se receber dados, COMPLETAR
            if ($info['count'] != 0) {

                //Retorna a primeira entrada
                $info = ldap_first_entry($this->getLdapconn(), $sr);

                //Recebe os atributos da pesquisa
                $info = ldap_get_attributes($this->getLdapconn(), $info);

                //Cria um objeto com os valores recolhidos do usuário
                $obj = (object) array();

                //Preenche o objeto
                $obj->uid = @$info['uid'][0];
                $obj->cn = @$info['cn'][0];
                $obj->sn = @$info['sn'][0];
                $obj->givenName = @$info['givenName'][0];
                $obj->userPassword = @$info['userPassword'][0];
                $obj->mail = @$info['mail'][0];
                $obj->brPersonCPF = @$info['brPersonCPF'][0];
                $obj->employeeNumber = @$info['employeeNumber'][0];
                $obj->jpegPhoto = @$info['jpegPhoto'][0];
                $obj->telephoneNumber = @$info['telephoneNumber'];

                //Elimina a contagem do vetor de telefones
                unset($obj->telephoneNumber['count']);

                //Cria-se uma instância de usuário
                $usuario = new Usuario;

                //Seta os valores de usuário com os valores recebidos da pesquisa e convertidos para objeto
                $usuario->setUsuario($obj);

                //Retorna o usuário
                return $usuario;
                //Se não receber os dados
            } else {
                return false;
            }
            //Se não, retorna FALSE e mostra mensagem de erro
        } else {
            error_log("Não foi possível estabelecer uma conexão com o LDAP");
            return false;
        }
    }
    
    public function moveUsuario($uid) {
        //Realiza conexão com o LDAP
        $this->conectar();
        
        $dn_atual = "uid=" . $uid . ",ou=solicitacoes,dc=ufvjm,dc=edu,dc=br";
        
        $nova_dn = "ou=usuarios,dc=ufvjm,dc=edu,dc=br";
        
        ldap_rename($this->ldap_connect, $dn_atual, "uid=" . $uid, $nova_dn, true);
        
        return ldap_error($this->ldap_connect);
    }
    
    public function rejeitaUsuario($uid) {
        //Realiza conexão com o LDAP
        $this->conectar();
    }
    
    

    public function cadastrar($vetor, $dn) {
        //Realiza conexão com o LDAP
        $this->conectar();

        //Valores a inserir no cadastro (Seguindo a ordem do vetor da api)
        $values["brPersonCPF"] = $vetor[0];
        $values["cn"] = $vetor[1];
        $values["sn"] = $vetor[2];
        $values["employeeNumber"] = $vetor[3];
        $values["givenName"] = $vetor[4];
        $values["uid"] = $vetor[5];
        $values["mail"] = $vetor[6];
        $values["telephoneNumber"][0] = $vetor[7];
        $values["telephoneNumber"][1] = $vetor[8];
        $values["userPassword"] = "{MD5}" . base64_encode(md5($vetor[9], true));

        $values["objectClass"][0] = "inetOrgPerson";
        $values["objectClass"][1] = "brPerson";

        //Função que adiciona ou altera usuário no ldap
        $add = ldap_add($this->getLdapconn(), $dn, $values);

        return ldap_error($this->getLdapconn());
    }

    public function modificar($tipo, $dn, $valor) {
        //Realiza conexão com o LDAP
        $this->conectar();

        if ($tipo === "apelido")
            $value["givenName"] = $valor;
        else if ($tipo === "email_alternativo")
            $value["mail"] = $valor;
        else if ($tipo === "telefone") {
            $value["telephoneNumber"] = $valor;
        } else if ($tipo === "senha") {
            $value["userPassword"] = "{MD5}" . base64_encode(md5($valor, TRUE));
        }

        //Função que adiciona ou altera usuário no ldap
        ldap_modify($this->getLdapconn(), $dn, $value);

        return ldap_error($this->getLdapconn());
    }

}
