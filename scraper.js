var express = require('express');
var app = express();
var request = require("request");
var cheerio = require("cheerio");
var url = require('url');

app.get('/', function(req, res){
	var ps = req.query.ps;
	var kode = req.query.kode;
	var kls = req.query.kelas;
	var sem = req.query.sem;
	var thn = req.query.tahun;
	
	var result = {};
	
	if(!sem) sem = 1; if(!thn) thn = 2015; if(!kls) kls = '01';
	
	if(!ps || !kode){
		result.error = "Request tidak sesuai format";
		res.type('application/json');
		res.status(400).send(JSON.stringify(result));
	}

	else {
		var source = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+ps+"&semester="+sem+"&tahun="+thn+"&th_kur=2013";
		request({ uri: source, }, function(error, response, body) {
			var isKelasAda = false;
			if(!error && response.statusCode == 200){
				var $ = cheerio.load(body);
				$("ol > li").each(function() {
					var item = $(this);
					var kdParse = item.text().substr(0, 6);
					
					if(kdParse.toLowerCase() == kode.toLowerCase()){
						var hasil = {};
						item.find("li > a:first-child").each(function() {
							var noKelas = $(this).text();
							var lastLink = $(this).attr("href");
							var link = "https://six.akademik.itb.ac.id/publik/"+lastLink;
							if(kls == noKelas){
								isKelasAda = true;
								request({ uri: link, }, function(error, response, body){
									var $ = cheerio.load(body);
									var content = $("pre").text();
									
									var lines = content.split('\n');
									
									hasil.fakultas = lines[0];
									hasil.prodi = lines[1].substr(lines[1].indexOf(":")+2);
									hasil.semester = lines[2].substr(lines[2].indexOf(":")+2, 1);
									hasil.tahun = "20"+lines[2].substr(lines[2].indexOf("/")+1);
									hasil.kode = lines[4].substr(lines[4].indexOf(":")+2, 6);
									hasil.mata_kuliah = lines[4].substring(lines[4].indexOf(" / ")+3, lines[4].indexOf(","));
									hasil.sks = lines[4].substr(lines[4].indexOf(",")+2, 1);
									hasil.kelas = lines[5].substr(lines[5].indexOf(":")+2, 2);
									hasil.dosen = lines[5].substr(lines[5].indexOf(" / ")+3);
									hasil.jumlah_peserta = lines[lines.length-2].substr(lines[lines.length-2].indexOf("=")+2);
									hasil.peserta = [];
									
									
									for(var i = 10; i < lines.length-3; i++){
										var nim = lines[i].substr(lines[i].indexOf(" ")+1, 8);
										var nama = lines[i].substr(lines[i].indexOf("   ")+3).trim();
										
										hasil.peserta.push({ nim: nim, nama: nama});
									}
									
									res.type('application/json');
									res.status(200).send(JSON.stringify(hasil));
								});
							}
						});
					}
				});
				if(!isKelasAda){
					result.error = "Tidak ditemukan kelas dengan kode "+kode.toUpperCase()+" dan nomor kelas "+kls
					res.type('application/json');
					res.status(404).send(JSON.stringify(result));
				}
			}
			else{
				result.error = "Terjadi kesalahan pada server"
				res.type('application/json');
				res.status(500).send(JSON.stringify(result));
			}
		});
	}
});
app.listen(3000);