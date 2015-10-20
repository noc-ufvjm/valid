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
    
    //Ao se clicar no botão confirmar, é verificado se o login, senha e confirmação de senha foram digitados
    if (array_key_exists('login', $_POST) && $_POST['senha'] != "" && $_POST['check_senha'] != ""){
        
        //Se as senhas forem iguais...
        if ($_POST['senha'] == $_POST['check_senha']){
            $ldap = new Ldap;

            //Variável recebe conteúdo do post e o converte para formato de objeto
            $obj = (object) $_POST;

            //Se existir telefones, padronizá-los 
            if ($obj->telefone) $obj->telefones[] = Siga::check_telefone($obj->telefone);
            if ($obj->celular) $obj->telefones[] = Siga::check_telefone($obj->celular);
            
            //Definição dos e-mails
            $obj->mail_alternativo = $obj->mail;
            $obj->mail = $obj->login . '@ufvjm.edu.br';

            //Destruição das variáveis que não serão utilizadas
            unset($obj->check_senha);
            unset($obj->telefone);
            unset($obj->celular);

            $usuarioLdap = new Usuario;
            
            // Povoa a variavel $value da classe Usuario com o $obj
            $usuarioLdap->setUsuario($obj);
            
            // Chama a função gravar da classe Ldap e passa o objeto usuario e DN
            if ($ldap->gravar($usuarioLdap, Config::get('baseSolicitacoes'))){
                header('location: logout.php');
            }
        //Se as senhas não forem iguais...
        }else{
            $s->display('info_siga.html');
        }
    //Mostra a página
    }else{
        $s->display('info_siga.html');
    }