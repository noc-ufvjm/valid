<?php 
    require_once 'smarty3/Smarty.class.php';
        
    $s = new Smarty;
    
    //Diretório de templates
    $s->addTemplateDir("../view/templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("../view/com_templates");

    //Criação de variável
    //$s->assign('titulo', 'Bem Vindo!');

    //Display de página que utiliza template "template"
    $s->display('index.html');
    
?>