<?php
require 'vendor/autoload.php';

// It may take a while to crawl a site ... 
set_time_limit(10000); 

// Include the phpcrawl-mainclass 
include("libs/PHPCrawler.class.php"); 

// Extend the class and override the handleDocumentInfo()-method  
class MyCrawler extends PHPCrawler { 
	public $kode;
	public $kelas;
	public $foundDoc = false;
	
	function handleDocumentInfo($DocInfo) {	     
	    // Print if the content of the document was be recieved or not 
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
    	flush(); 
	}  
}

//Check if the $doc contains $kode and $kelas
function checking($doc, $kode, $kelas) {
	$i=1;
	$separator = PHP_EOL;
	$found = false;
	$line = strtok($doc, $separator);
	while ($line !== false) {
		$i++;
		if ($i == 5) {
			if(strripos($line, $kode, 19) !== false){
				$found = true;
			}
			break; 
		}
		$line = strtok($separator);
	}
	$line = strtok($separator);
	if(strripos($line, $kelas, 18) === false){
		$found = false;
	}
	return $found;
} 

class Crawler {
	public $ps;
	public $kode;
	public $kelas;
	public $tahun = "2015";
	public $semester = "1";
	public $th_kur = "2013";

	public function validate() {
		return (preg_match('([1-3][0-9]{2})', $this->ps) === 1) 
			&& (preg_match('([A-Za-z]{2}[0-6][0-2][0-9]{2})', 
				$this->kode) === 1) 
			&& (preg_match('([0-9]{2})', $this->kelas) === 1));
	}

	public function crawling() {
		// Now, create a instance of your class, define the behaviour 
		// of the crawler
		// and start the crawling-process.  
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
		// At the end, after the process is finished, 
		// we parse the document found
		// then return it as array
			return $this->parsing($crawler->foundDoc);
		}
		return false; 
	} 

	//Parsing doc into array
	private function parsing($doc) {
		$separator = PHP_EOL;
		
		$line = strtok($doc, $separator);
		$fakultas = substr($line, 5);
		
		$line = strtok($separator);
		$prodi = substr($line, 17);

		$line = strtok($separator);
		$line = strtok($separator);
		$mata_kuliah = preg_split('/\s+/', $line, 6)[5];
		$sks = 3;

		$line = strtok($separator);
		$dosen = preg_split('/\s+/', $line, 6)[5];

		$line = strtok($separator);
		$line = strtok($separator);
		$line = strtok($separator);
		$line = strtok($separator);

		$peserta = array();
		while (($line !== false) && (substr($line, 0, 1) !== "-")) {
			$mhs = preg_split('/\s+/', $line, 3);
			$peserta[] = [
				"nim" => $mhs[1],
				"nama" => $mhs[2]
			];
			$line = strtok($separator);
		}

		$line = strtok($separator);
		$jumlah_peserta = preg_split('/\s+/', $line, 3)[2];
		
		return [
			"fakultas" => $fakultas,
		    "prodi" => $prodi,
		    "semester" => $this->semester,
		    "tahun" => $this->tahun,
		    "kode" => $this->kode,
		    "mata_kuliah" => $mata_kuliah,
		    "sks" => $sks,
		    "kelas" => $this->kelas,
		    "dosen" => $dosen,
		    "jumlah_peserta" => $jumlah_peserta,
		    "peserta" => $peserta,
		];
	}
}
?>
