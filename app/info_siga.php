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
            unset($_POST['check_senha']);
            $ldap = new Ldap;
            $usuarioLdap = new Usuario;

            //Dados provisorios
            $usuarioLdap->sobrenome = "teste";
            $usuarioLdap->apelido = "teste";

            foreach ($_POST as $key => $value){
                $usuarioLdap->$key = $value;
            }
            if ($ldap->gravar($usuarioLdap)){
                echo "passou";
            }
        }else{
            $s->assign('error', true);
        }
    }
    $s->display('info_siga.html');