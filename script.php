<?php
$v = $_REQUEST["v"];
$a = $_REQUEST["a"];
$e = $_REQUEST["e"];

$v = json_decode($v); 
if ($a === "set") {
    echo set($v->rank, $v->name, $v->WPM, $v->Error);
    exit;
} else if ($a === "get") {
    if (!file_exists("leaderboard.json")) {
        echo "Empty";
        exit;
    } else {      
        echo get();
        exit;
    }
}else if($a === "code_reset_all"){ 
        $file = fopen("leaderboard.json", 'w');
        fwrite($file, json_encode(array("length"=> 0)));
        fclose($file);
        echo get();
        exit; 
}

function get()
{ 
    return file_get_contents("leaderboard.json");
}



function set(int $rank, string $name, int $WPM = 0, int $err = 0)
{
    $temp = json_decode(get()); 
    if (!is_object($temp->$rank)) {
        $temp->$rank =array("name" => $name, "WPM" => $WPM, "Error" => $err);
        $rank++;
        $placeholder = $temp->$rank;
    } else {
        $placeholder = $temp->$rank;
        $temp->$rank =array("name" => $name, "WPM" => $WPM, "Error" => $err);
        $rank++;
    }
    
    while (!is_null($placeholder)) {
        if (!is_object($temp->$rank)) {
            $temp->$rank =array("name" => $placeholder->name, "WPM" => $placeholder->WPM, "Error" => $placeholder->Error);
            $rank++;
            $placeholder = $temp->$rank;
        } else {
            $placeholder2 = $temp->$rank;
            $temp->$rank =array("name" => $placeholder->name, "WPM" => $placeholder->WPM, "Error" => $placeholder->Error);
            $placeholder = $placeholder2;
            $rank++;
        }
    };
    $temp->length = $rank-1;
    $file = fopen("leaderboard.json", "w");
    fwrite($file, json_encode($temp));
    fclose($file);
    return get();
} 