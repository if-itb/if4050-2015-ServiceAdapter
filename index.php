<?php
require 'vendor/autoload.php';
include("crawler.php");

// create new Slim instance
$app = new \Slim\Slim();
header("Content-Type: application/json");

// add route 
$app->get("/", function () {
    $app = \Slim\Slim::getInstance();
	$finder = new Finder();
	$finder->ps = $app->request()->get('ps');
	$finder->kode = $app->request()->get('kode');
	$finder->kelas = $app->request()->get('kelas');

	if (!$finder->validate()){//wrong request format
		$status = 400;
		$body = [
			"error" => "Request tidak sesuai format"
		];
	} else {//success request
			if ($finder->find()) {
				$status = 200;
				try{
					$body = $finder->parse();
				} catch (Exception $e) {
					$status = 500;
					$body = [
						"error" => "Terjadi kesalahan pada server"
					];
				}
			} else {
				$status = 404;
				$body = [
					"error" => "Tidak ditemukan kelas dengan kode " . $finder->kode
				];
			}
	}

    $app->response()->status($status);
    echo json_encode($body);
});

// run the Slim app
$app->run();