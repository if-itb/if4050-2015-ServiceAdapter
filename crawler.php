<?php
require 'vendor/autoload.php';

// It may take a while to crawl a site ... 
set_time_limit(10000); 

// Extend PHPCrawler class and override the handleDocumentInfo()-method  
class MyCrawler extends PHPCrawler { 
	public $kode;
	public $kelas;
	public $foundDoc = false;
	
	function handleDocumentInfo($DocInfo) {	     
	    if (($DocInfo->received == true) 
	    	&& ($DocInfo->content_type == "text/html")){	

	    	// Check if we are already in the "leaf"
	        if (count($DocInfo->links_found) == 0) {
	            $url_parts = parse_url($DocInfo->url);
	            parse_str($url_parts['query'], $query);

	            if ($query['p']) {
	            	if (checking($DocInfo->content, $this->kode, 
	            		$this->kelas)){
	            		$this->foundDoc = $DocInfo->content;
	            		return -1;
	            	}
	            }
	        }
	    }
    	// flush(); 
	}  
}

//Check if the $doc contains $kode and $kelas
function checking($doc, $kode, $kelas) {
	$separator = PHP_EOL;
	$found = false;
	$line = strtok($doc, $separator);
	$line = strtok($separator);
	$line = strtok($separator);
	$line = strtok($separator);
	var_dump($line);
	if(strripos($line, $kode, 17) !== false){
		$found = true;
	}
	$line = strtok($separator);
	if(strripos($line, $kelas, 17) === false){
		$found = false;
	}
	return $found;
} 

class Finder {
	public $ps;
	public $kode;
	public $kelas;
	public $tahun = "2015";
	public $semester = "1";
	public $th_kur = "2013";
	private $doc;

	public function validate() {
		return (!empty($this->ps) && !empty($this->kode) && !empty($this->kelas));
	}

	public function find() {
		$crawler = new MyCrawler();

		// Set paramater
		$crawler->kode = $this->kode;
		$crawler->kelas = $this->kelas; 

		// URL to crawl 
	    $url = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="
	    	. $this->ps . "&semester=" . $this->semester . "&tahun="
	        . $this->tahun . "&th_kur=" . $this->th_kur;
		$crawler->setURL($url); 

		// Only receive content of files with content-type "text/html" 
		$crawler->addContentTypeReceiveRule("#text/html#"); 

		// Ignore links to pictures, dont even request pictures 
		$crawler->addURLFilterRule("#\.(jpg|jpeg|gif|png)$# i");
	    
	    // Don't let it back to the main page
	    $crawler->addURLFilterRule("#displayprodikelas.php# i");

		// Thats enough, now here we go 
		$crawler->go();

		if ($crawler->foundDoc !== false){
			$this->doc = $crawler->foundDoc;
			return true;
		}
		return false; 
	} 

	//Parse doc into array
	public function parse() {
		$separator = PHP_EOL;
		
		$line = strtok($this->doc, $separator);
		$fakultas = substr($line, 5);
		
		$line = strtok($separator);
		$prodi = preg_split('/\s:\s/', $line, 2)[1];

		$line = strtok($separator);
		$line = strtok($separator);
		$mata_kuliah = preg_split('/\s:\s/', $line, 2)[1];

		$matkul = array();
		$splits = preg_split('#\s/\s#', $mata_kuliah, 2);
		$matkul['kode'] = $splits[0];
		preg_match('#(.*),\s(\d+)\sSKS#', $splits[1], $splits);
		$matkul['sks'] = $splits[2];
		$matkul['nama'] = $splits[1];

		$line = strtok($separator);
		$dosen = preg_split('/\s+/', $line, 6)[5];

		$line = strtok($separator);
		$line = strtok($separator);
		$line = strtok($separator);
		$line = strtok($separator);

		$peserta = array();
		while (($line !== false) && (substr($line, 0, 1) !== "-")) {
			$mhs = array();
			preg_match('#\d+\s+(\d+)\s+(.*)#', $line, $mhs);
			$peserta[] = [
				"nim" => $mhs[1],
				"nama" => $mhs[2]
			];
			$line = strtok($separator);
		}

		$line = strtok($separator);
		$jumlah_peserta = preg_split('/\s+=\s+/', $line)[1];
		
		return [
			"fakultas" => $fakultas,
		    "prodi" => $prodi,
		    "semester" => $this->semester,
		    "tahun" => $this->tahun,
		    "kode" => $matkul['kode'],
		    "mata_kuliah" => $matkul['nama'],
		    "sks" => $matkul['sks'],
		    "kelas" => $this->kelas,
		    "dosen" => $dosen,
		    "jumlah_peserta" => $jumlah_peserta,
		    "peserta" => $peserta,
		];
	}
}
?>
