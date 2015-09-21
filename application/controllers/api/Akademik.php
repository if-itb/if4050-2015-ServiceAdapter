<?php defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
require APPPATH . '/libraries/Simple_html_dom.php';

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
		
		if($this->checkFormat($ps, $kode, $kelas))
		{
			$dataDpk = $this->getDpk($ps, $kode, $kelas);
			
			if($dataDpk)
			{
				if(strcmp($dataDpk, 'not found'))
				{
					$this->response($dataDpk, REST_Controller::HTTP_OK); // OK (200) being the HTTP response code
				}
				else
				{
					$this->response([
						'error' => 'Tidak ditemukan kelas dengan kode '.$kode
					], REST_Controller::HTTP_NOT_FOUND); // 404
				}
			}
			else
			{
				$this->response([
					'error' => 'Terjadi kesalahan pada server'
				], REST_Controller::HTTP_INTERNAL_SERVER_ERROR); // 500
			}
		}
		else
		{
			$this->response([
				'error' => 'Request tidak sesuai format'
			], REST_Controller::HTTP_BAD_REQUEST); // 400
		}
	}
	
	private function checkFormat($ps, $kode, $kelas)
	{
		if($ps)
		{
			if($kode)
			{
				if($kelas)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	
	public function getDpk($ps, $kode, $kelas)
	{
		$key = $this->getKelas($ps, $kode, $kelas);
		
		if($key)
		{
			// load dpk from six.akademik.itb.ac.id
			$dataDpk = file('https://six.akademik.itb.ac.id/publik/'.$key);
			
			// menyimpan hasil data total
			$json_data = array();
			
			// menyimpan data mahasiswa
			$tempMhs = array();
			
			$iPos = 0;	// text line
			foreach($dataDpk as $dpk)
			{
				$dpk = str_replace(array("\n", "\t", "\r"), '',$dpk);
				if($iPos == 0){
					$json_data['fakultas'] = strip_tags($dpk);
				}else if($iPos == 1){
					$raw = explode(":",$dpk);
					$json_data['prodi'] = strip_tags($raw[1]);
				}else if($iPos == 2){
					$raw = explode(":",$dpk);
					$json_data['semester'] = substr(trim(strip_tags($raw[1])),0,1);
					$json_data['tahun'] = "20".substr(trim(strip_tags($raw[1])),2,2);
				}else if($iPos == 4){
					$raw = explode(":",$dpk);
					$rawKode = explode("/",$raw[1]);
					$json_data['kode'] = trim(strip_tags($rawKode[0]));
					$json_data['sks'] = substr(trim(explode(",",$rawKode[1])[1]),0,2);
					$json_data['mata_kuliah'] = explode(",",$rawKode[1])[0];
				}else if($iPos == 5){
					$raw = explode(":",$dpk);
					$rawKode = explode("/",$raw[1]);
					$json_data['kelas'] = $rawKode[0];
					$json_data['dosen'] = $rawKode[1];
				}
				
				// mencari jumlah peserta
				if(preg_match("/Peserta/",$dpk)){
					$raw = explode("=",$dpk);
					$json_data['jumlah_peserta'] = $raw[1];
				}
				// mencari data mahasiswa
				if(is_numeric(substr($dpk,0,3))){
					$tmparray = array(
									'nim'=> substr($dpk,4,8),
									'nama'=>substr($dpk,15)
								);
					array_push($tempMhs,$tmparray);
				}
				$iPos++;
			}
			$json_data['peserta'] = $tempMhs;
			
			return $json_data;
		}
		else
		{
			return 'not found';
		}
	}
	
	public function getKelas($ps, $kode, $kelas)
	{
		// Create a DOM object
		$html = new simple_html_dom();
		
		// Load HTML from a URL 
		$html->load_file('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='.$ps.'&semester=1&tahun=2015&th_kur=2013');
		
		foreach($html->find('ol') as $ul) 
		{
			foreach($ul->find('li') as $li) 
			{
				// Mencari mata kuliah berdasarkan kode kuliah
				if(preg_match('/^'.$kode.'/', $li->plaintext))
				{
					$i=0;
					foreach($li->find('li') as $child) 
					{
						if(!strcmp($child->children(0)->plaintext,$kelas))
						{
							//return $child->children(0)->href;
							$nom = $child->children(0)->plaintext;
							$link = $child->children(0)->href;
							break;
						}
						$i++;
					}

				}
			}
		}
		
		if(!$nom,$kelas))
		{
			return $link;
		}
		else
		{
			return 'not found';
		}
	}
}