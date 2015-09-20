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
		
		if($ps)
		{
			$aink = $this->getKelas($ps, $kode, $kelas);
			
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
	
	public function getKelas($ps, $kode, $kelas)
	{
		$key = $this->getMatkul($ps, $kode, $kelas);
		
		// Create a DOM object
		$html = new simple_html_dom();
		
		$html->load_file('https://six.akademik.itb.ac.id/publik/'.$key);
		
		echo $html;
	}
	
	public function getMatkul($ps, $kode, $kelas)
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
						// echo $child->children(0)->plaintext.'<br>';
						// echo $kelas.'<br>';
						
						// $nom[$i] = $child->children(0)->plaintext;
						// $list[$i] = $child->children(0)->href;
						
						if(!strcmp($child->children(0)->plaintext,$kelas))
						{
							return $child->children(0)->href;
							break;
						}
						$i++;
					}
				
					// $si_text = $li;
					// //echo $li;
					
					// $i=0;
					// foreach($si_text->find('a') as $element)
					// {
						// if($i%2 == 0)
						// {
							// $list[$i] = $element->href;
							// $nom[$i] = $element->plaintext;
						// }
						// $i++;
					// }
					
					// for($j=0; $j<=$i; $j++)
					// {
						// if($j%2 == 0)
						// {
							// if(!strcmp($kelas, $nom[$j]))
							// {
								 // echo $nom[$j];
								 // echo $list[$j];
								// break;
							// }
						// }
					// }

				}
			}
		}
	}
}