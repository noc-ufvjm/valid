<?php 
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Siga.php';
    require_once dirname(__file__).'/../model/Ldap.php';

    session_start();
    if (!array_key_exists('cpf', $_SESSION))
    {
        header('location: index.php');
        exit;
    }

    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");
    //Display de página que utiliza template "template"
    if (array_key_exists('cpf', $_SESSION)) {
        $siga = new Siga;
        $usuario = $siga->getUsuario($_SESSION['cpf']);
        $s->assign('usuario', $usuario);
    }
    if (array_key_exists('login', $_POST) && $_POST['senha'] != "" && $_POST['check_senha'] != ""){
        if ($_POST['senha'] == $_POST['check_senha']){
            $ldap = new Ldap;

            $obj = (object) $_POST;

            if ($obj->telefone) $obj->telefones[] = Siga::check_telefone($obj->telefone);
            if ($obj->celular) $obj->telefones[] = Siga::check_telefone($obj->celular);
            $obj->mail_alternativo = $obj->mail;
            $obj->mail = $obj->login . '@ufvjm.edu.br';

            unset($obj->check_senha);
            unset($obj->telefone);
            unset($obj->celular);

            $usuarioLdap = new Usuario;
            $usuarioLdap->setUsuario($obj);

            if ($ldap->gravar($usuarioLdap, Config::get('baseSolicitacoes'))){
                header('location: logout.php');
            }
        }else{
            $s->display('info_siga.html');
        }
    }else{
        $s->display('info_siga.html');
    }