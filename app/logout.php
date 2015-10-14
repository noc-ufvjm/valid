<?php

//Simplesmente destrói a sessão atual e retorna para o index.php
session_start();
session_unset();
session_destroy();
header('location: index.php');