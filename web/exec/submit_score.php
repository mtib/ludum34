<?
    require("connection.php");

    $username = $_POST['username'];
    $pts      = $_POST['points'];
    $mistakes = $_POST['mistakes'];
    $tm       = $_POST['time_taken'];
    $version  = $_POST['version'];

    if(!(isset($username) && isset($pts) && isset($mistakes) && isset($tm) && isset($version))){
        die('Invalid post request');
    }

    $con = getConnection();

    $prep = $con->prepare("INSERT INTO `shipload`.`scores` (
    `id` ,
    `name`,
    `points`,
    `mistakes`,
    `time_taken`,
    `version`
    )
    VALUES (
    NULL, ?, ?, ?, ?, ?
    );");

    $prep->bind_param('siiis', $username, $pts, $mistakes, $tm, $version);
    $prep->execute();
    $prep->close();

    $con->close();

    echo "true";
?>
