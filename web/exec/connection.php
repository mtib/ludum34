<?
require("auth.php");

function getConnection(){
    $con = new mysqli(getServer(),getUsername(),getPassword(),getDatabase());
    return $con;
}

// TODO: add table to main page (or link it)
// TODO: Markus will generate plots for it

?>
