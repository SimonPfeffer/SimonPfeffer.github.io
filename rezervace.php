<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validace (jednoduchá)
    if (empty($_POST['email']) || empty($_POST['datum'])) {
        echo "Prosím vyplňte všechna pole.";
        exit;
    }

    $tarif = $_POST['tarif'];
    $datum = $_POST['datum'];
    $cas   = $_POST['cas'];
    $pocet = $_POST['pocet'];
    $email = $_POST['email'];
    $cas_zapisu = date("Y-m-d H:i:s");

    $soubor = 'rezervace.csv';
    $existuje = file_exists($soubor);
    
    $f = fopen($soubor, 'a');

    // UTF-8 podpora pro Excel
    if (!$existuje) {
        fprintf($f, chr(0xEF).chr(0xBB).chr(0xBF));
        fputcsv($f, array('Datum zápisu', 'Tarif', 'Datum akce', 'Čas', 'Počet', 'E-mail'), ';');
    }

    // Zápis řádku
    fputcsv($f, array($cas_zapisu, $tarif, $datum, $cas, $pocet, $email), ';');
    fclose($f);

    // Důležité: Vrátíme jen "OK", aby to JavaScript poznal
    echo "OK";
} else {
    echo "Nepovolený přístup.";
}
?>