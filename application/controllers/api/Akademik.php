<?php defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Akademik extends REST_Controller {
	
	function __construct()
	{
		parent::__construct();
	}
	
	public function dpk_get()
	{
		$ps = $this->get('ps');
		$kode = $this->get('kode');
		$kelas = $this->get('kelas');
		
		if($ps)
		{
			$aink = $this->getKelas($ps);
			
			$this->response([
				'fakultas' => 'Sekolah Teknik Elektro dan Informatika',
				'prodi' => $aink
			], REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
		}
		else{
			$this->response([
				'status' => FALSE,
				'message' => 'No users were found'
			], REST_Controller::HTTP_NOT_FOUND); // NOT_FOUND (404) being the HTTP response code
		}
	}
	
	public function getKelas($ps)
	{
		$user = json_decode(
			file_get_contents('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='.$ps.'&semester=1&tahun=2015&th_kur=2013')
		);
		return $user;
	}
}