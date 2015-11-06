<?php 
    require_once 'smarty3/Smarty.class.php';
    require_once dirname(__file__).'/../model/Siga.php';
    require_once dirname(__file__).'/../model/Ldap.php';

    session_start();

    if (!array_key_exists('cpf', $_SESSION))
    {
        header('Location: index.php');
        exit;
    }

    $s = new Smarty;

    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");
    
    //Se o cpf existir na sessão (Tiver solicitado com sucesso - CPF existe no siga, mas não no ldap)
    if (array_key_exists('cpf', $_SESSION)) {
        $siga = new Siga;
        
        //Variável usuario recebe um vetor com as informações do usuário logado
        $usuario = $siga->getUsuario($_SESSION['cpf']);
        
        //O vetor de informações é vinculado à variável usuário do smarty
        $s->assign('usuario', $usuario);
    }
    
        $s->display('solicitar-acesso.html');
    