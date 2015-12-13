<?
    require("connection.php");

    $username = $_POST['username'];
    $pts      = $_POST['points'];
    $mistakes = $_POST['mistakes'];
    $tm       = $_POST['time_taken'];

    if(!(isset($username) && isset($pts) && isset($mistakes) && isset($tm))){
        die('Invalid post request');
    }

    $con = getConnection();

    $prep = $con->prepare("INSERT INTO `shipload`.`scores` (
    `id` ,
    `name`,
    `points`,
    `mistakes`,
    `time_taken`
    )
    VALUES (
    NULL, ?, ?, ?, ?
    );");

    $prep->bind_param('siii', $username, $pts, $mistakes, $tm);
    $prep->execute();
    $prep->close();

    $con->close();

    echo "true";
?>
