<?php
require 'vendor/autoload.php';

include("crawler.php");

// create new Slim instance
$app = new \Slim\Slim();

// add new Route 
$app->get("/", function () use ($app) {
    $app->response()->header("Content-Type", "application/json");
	
	try {
		$crawler = new Crawler();
		$crawler->ps = $app->request()->get('ps');
		$crawler->kode = $app->request()->get('kode');
		$crawler->kelas = $app->request()->get('kelas');

		//wrong request format
		if (!$crawler->validate()){
			$app->response->setStatus(400);
			$body = [
				"error" => "Request tidak sesuai format"
			];
		} else {
			//success request
			$body = $crawler->crawling();
			if ($body !== false) {
				$app->response->setStatus(200);
			}

			//`kelas` not found
			if ($body === false){
				$app->response->setStatus(404);
				$body = array[
					"error" => "Tidak ditemukan kelas dengan kode IF4051"
				];
			}
		}
	} catch (\Exception $e) {
		$app->response->setStatus(500);
		$body = [
			"error" => "Terjadi kesalahan pada server"
		];
	}
    echo json_encode($body);
});

// run the Slim app
$app->run();