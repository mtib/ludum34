<?
    require("connection.php");

    $pts      = $_POST['points'];
    $mistakes = $_POST['mistakes'];
    $tm       = $_POST['time_taken'];

    if(!(isset($pts) && isset($mistakes) && isset($tm))){
        die('Invalid post request');
    }

    $con = getConnection();

    $prep = $con->prepare("INSERT INTO `shipload`.`scores` (
    `id` ,
    `points` ,
    `mistakes` ,
    `time_taken`
    )
    VALUES (
    NULL, ?, ?, ?
    );");

    $prep->bind_param('iii', $pts, $mistakes, $tm);
    $prep->execute();

    $con->close();
?>
