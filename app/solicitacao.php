<?php 
    require_once 'smarty3/Smarty.class.php';
        
    $s = new Smarty;
    
    //Diretório de templates
    $s->addTemplateDir("templates");
    
    //Diretório de templates compilados
    $s->setCompileDir("com_templates");

    //Display de página que utiliza template "template"
    $s->display('solicitacao.html');
    
?>