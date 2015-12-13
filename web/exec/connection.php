<?
require("auth.php");

function getConnection(){
    $con = new mysqli(getServer(),getUsername(),getPassword(),getDatabase());
    return $con;
}

// TODO: create Tables if they don't exist
// TODO: add statistics via AJAX, when gameState.stopgame() is called
// TODO: add table to main page (or link it)
// TODO: Markus will generate plots for it

?>
