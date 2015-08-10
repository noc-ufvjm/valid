<?php 
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Siga.php';
    require_once dirname(__file__).'/../model/Ldap.php';

    session_start();
    
    if (!array_key_exists('login', $_SESSION)){
        header('Location: index.php');
        exit;
    }

    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");
    
    //Display de página que utiliza template "template"
    if (array_key_exists('login', $_SESSION)) {
        $ldap = new Ldap;
        $usuario = $ldap->getUsuario($_SESSION['login']);
        
        if ($usuario->foto) {
            file_put_contents("imagens/" . $usuario->login . ".jpg", $usuario->foto);
            
            $s->assign('foto', true);
        }
        else{
            $s->assign('foto', false);
        }
        
        $s->assign('usuario', $usuario);
        
    }
    
    $s->display('home.html');
    