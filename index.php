<!DOCTYPE HTML>
<html>
<head>
	<title>
		eheu
	</title>
</head>
<body>
<?php

//function library

require('shd.php');

//get parameters

$prodi = $_GET['ps'];
$matkul = $_GET['matkul'];
$kelas = $_GET['kelas'];

//fetch link from first page

$link = 'https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='.$prodi.'&semester=1&tahun=2015&th_kur=2013';
$html = file_get_html($link);

//search matkul

$i = 0;
while (1) {
	$e = $html->find('li', $i);
	$i++;
	if (strpos($e,$matkul) !== false) {
		break;
	}
}

//search kelas

$i = 0;
while (1) {
	$f = $e->find('a', $i);
	$i++;
	if (strpos($f,$kelas) !== false) {
		break;
	}
}

//get all peserta kelas

$file = $f->href;
$file = "https://six.akademik.itb.ac.id/publik/".$file;

$file = fopen($file,"r");

//create array and fill

$arr = array();
$i = 0;
while(!feof($file)) {
	$a = fgets($file);
	if ($i >= 10) {
		if (strpos($a,"---") !== false) {
			break;
		}
		$content = explode(" ", $a, 3);
		$mhs = array();
		$mhs['Nomor'] = $content[0];
		$mhs['NIM'] = $content[1];
		$mhs['Nama'] = str_replace("\n", "", $content[2]);
		$arr[] = $mhs;
	}
	$i++;
}

fclose($file);

//make json from array

$json = json_encode($arr);

echo $json;

?>
<body>
<html>