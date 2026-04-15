<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$file = '../vystavy.csv';
$out = [];

if (file_exists($file)) {
    if (($h = fopen($file, "r")) !== FALSE) {
        while (($r = fgetcsv($h, 1000, ",")) !== FALSE) {
            if (!empty($r[0])) {
                $out[] = [
                    'nazev' => htmlspecialchars($r[0]),
                    'desc'  => htmlspecialchars($r[1]),
                    'kat'   => htmlspecialchars($r[2]),
                    'img'   => htmlspecialchars($r[3])
                ];
            }
        }
        fclose($h);
    }
}
echo json_encode($out);
?>