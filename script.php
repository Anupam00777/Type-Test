<?php

$v = $_REQUEST["v"];
$a = $_REQUEST["a"];
$e = $_REQUEST["e"];

$v = json_decode($v);
if ($a === "set") {
    if (!file_exists("leaderboard.json")) {
        $file = fopen("leaderboard.json", 'w');
        fclose($file);
    }
    $jsonStr = file_get_contents("leaderboard.json");
    set($v->rank, $v->name, $v->WPM);
} else if ($a === "get") {
    if (!file_exists("leaderboard.json")) {
        echo "Empty";
        exit;
    } else {
        global $jsonStr;
        $jsonStr = file_get_contents("leaderboard.json");
        echo get();
    }
}

function get()
{
    $temp = json_decode($GLOBALS['jsonStr']);
    return json_encode($temp);
}



function set(int $rank, string $name, int $WPM = null)
{
    $temp = new ArrayObject(json_decode(($GLOBALS['jsonStr'])));
    if (!is_object($temp[$rank])) {
        $temp[$rank] = array("name" => $name, "WPM" => $WPM);
        $rank++;
        $placeholder = $temp[$rank];
    } else {
        $placeholder = $temp[$rank];
        $temp[$rank] = array("name" => $name, "WPM" => $WPM);
        $rank++;
    }
    while (!is_null($placeholder)) {
        if (!is_object($temp[$rank])) {
            $temp[$rank] = array("name" => $placeholder->name, "WPM" => $placeholder->WPM);
            $rank++;
            $placeholder = $temp[$rank];
        } else {
            $placeholder2 = $temp[$rank];
            $temp[$rank] = array("name" => $placeholder->name, "WPM" => $placeholder->WPM);
            $placeholder = $placeholder2;
            $rank++;
        }
    };
    $temp["length"] = $rank - 1;
    $file = fopen("leaderboard.json", "w");
    fwrite($file, json_encode($temp));
    fclose($file);
}
