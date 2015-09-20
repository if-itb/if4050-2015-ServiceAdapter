//var request = require("request");
var cheerio = require("cheerio");
var api = require("express");
var apps = api();
var https = require('https');


//Lets define a port we want to listen to
const PORT=8080; 

  
apps.get('/api', function (request, response) {
  
//We need a function which handles requests and send response
	var Matkul = request.query.mk
	var Kelas = request.query.kelas
	var Prodi = request.query.ps
	
	if (Matkul === undefined || Kelas === undefined || Prodi === undefined)
		response.status(400).json({
				error: "Request tidak sesuai format"
			});
	else {
		var options = {
			host: 'six.akademik.itb.ac.id',
			port: 443,
			path: '/publik/daftarkelas.php?ps='+Prodi+'&semester=1&tahun=2015&th_kur=2013'
		};

		var html = '';
		
		https.get(options, function(res) {
		 
		  res.on('data', function(d) {
		    html += d;
		  }).on('end', function(d) {
		  	 html += d;
		  	 $ = cheerio.load(html);
			 if ($('li').html() === null){
			 	response.status(404).json({
					error: "Tidak ditemukan Prodi dengan nomor "+Prodi
				});
			 } else {
				 var matakuliah = $('li:contains("'+Matkul+'")').html();
			     if (matakuliah === null){
			     	response.status(404).json({
						error: "Tidak ditemukan kelas"+Matkul
					});
			     } else {
				     $ = cheerio.load(matakuliah);
				     var no_kelas = $('a:contains("'+Kelas+'")').attr('href');
				     if (no_kelas === undefined){
				     	response.status(404).json({
						error: "Tidak no kelas "+Kelas+" pada Mata Kuliah "+Matkul
					});
				     
				     }else {

				     	var links = '';
				     	var options2 = {
							host: 'six.akademik.itb.ac.id',
							port: 443,
							path: '/publik/'+no_kelas
						};

						https.get(options2, function(resp) { 
						  resp.on('data', function(dat) {
						    links += dat;
						  }).on('end', function(dat){
						  	 links += dat;
						  	 $ = cheerio.load(links);				
						     var dpk = $('pre').html();
						     var data = parsing_dpk(dpk);
						     if (data.error !== undefined) {
									response.status(500).json(data);
							} else {
									response.status(200).json(data);
							}				    
						  });
					  
						}).on('error', function(e) {
					 	 console.error(e);
						});
					}
				}
			}
		  });

		}).on('error', function(e) {
		  response.status(500).json({
		  	error : "terjadi kesalahan pada server"});
		});
	}
});

function parsing_dpk(dpk) {
		var result = {};
		var REGEX_ALL = /(.*)\n.*:\s(.*)\n.*:\s+(\d+)\/(\d+)\n\n.*:(.*)\s+\/\s+(.*),\s+(\d+)\s+SKS\n.*:\s+(\d+)\s+\/\s+(.*)\n\n-+\n.*\n-+\n((.*\n)*)-+\nTotal Peserta = (\d+)/g
		var REGEX_PESERTA_KELAS = /\d+\s+(\d+)\s+(.*)/gm;
		
		var hasil = REGEX_ALL.exec(dpk);
		if (hasil == null) {
			return {
				error: "Error while parsing dpk"
			};
		} else {
			result.fakultas = hasil[1];
			result.prodi = hasil[2];
			result.semester = hasil[3];
			result.tahun = 2000 + parseInt(hasil[4]);
			result.kode = hasil[5];
			result.mata_kuliah = hasil[6];
			result.sks = hasil[7];
			result.kelas = hasil[8];
			result.dosen = hasil[9];
			result.peserta = [];
			result.jumlah_peserta = hasil[12];

			var matchPesertaKelas = REGEX_PESERTA_KELAS.exec(hasil[10]);
			while (matchPesertaKelas !== null) {
				result.peserta.push({
					nim: matchPesertaKelas[1],
					nama: matchPesertaKelas[2].trim()
				});
				matchPesertaKelas = REGEX_PESERTA_KELAS.exec(hasil[10]);
			}
			return result;
		}
}

apps.listen(PORT, function(){
   // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});