<?php
require 'vendor/autoload.php';

// create new Slim instance
$app = new \Slim\Slim();

$app->error(function (\Exception $e) use ($app) {
    $app->response()->header("Content-Type", "application/json");
    echo json_encode(
    	array(
    		"error" => "Terjadi kesalahan pada server"
    ));
});

// add new Route 
$app->get("/", function () use ($app) {

    $app->response()->header("Content-Type", "application/json");
	
	$ps = $app->request()->get('ps');
	$kode = $app->request()->get('kode');
	$kelas = $app->request()->get('kelas');
    
	//success request
	$app->response->setStatus(200);
	$body = array(
		"fakultas" => "Sekolah Teknik Elektro dan Informatika",
	    "prodi" => "Teknik Informatika",
	    "semester" => "1",
	    "tahun" => 2015,
	    "kode" => "IF4050",
	    "mata_kuliah" => "Pembangunan Perangkat Lunak Berorientasi Service",
	    "sks" => "3",
	    "kelas" => "01",
	    "dosen" => "Adi Mulyanto",
	    "jumlah_peserta" => "50",
	    "peserta" => [
	        [
	            "nim" => "13511018",
	            "nama" => "Tito D Kesumo Siregar"
	        ],
	    ]
	);

	//wrong request format
	// $app->response->setStatus(400);
	// $body = array(
	// 	"error" => "Request tidak sesuai format"
	// );

	//`kelas` not found
	// $app->response->setStatus(404);
	// $body = array(
	// 	"error" => "Tidak ditemukan kelas dengan kode IF4051"
	// );

    $book =  array(
            "id" => $app->request()->get('id'),
            "title" => $app->request()->get('title'),
            "author" => $app->request()->get('author'),
            "summary" => "summary"
    	);
    echo json_encode($body);
});

// run the Slim app
$app->run();