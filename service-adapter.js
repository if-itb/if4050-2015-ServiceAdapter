/*
 * Nama : Ichwan Haryo Sembodo
 * Nim	: 13512008
 * Format Request : /?ps=<kode jurusan>&kode=<kode mata kuliah>&kelas=<kelas mata kuliah>
 */

var request = require('request');
var cheerio = require('cheerio');
var url = require("url");
var http = require("http");

var server = http.createServer(function(req, res) {
	var query = url.parse(req.url, true).query;
	if(query.ps && query.kode && query.kelas){
		var programStudi = query.ps;
		var mataKuliah = query.kode;
		var kelas = query.kelas;
		var URL = 'https://six.akademik.itb.ac.id/publik/';
		var formatURL = URL+'daftarkelas.php?ps='+programStudi+'&semester=1&tahun=2015&th_kur=2013';
		var result = {};
		request(formatURL, function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var htmlBody = cheerio.load(html);
				if(htmlBody('ol').children('li').length != 0){
					if(htmlBody('ol').children('li:contains("'+mataKuliah+'")').length != 0){
						htmlBody('ol').children('li:contains("'+mataKuliah+'")').each(function(i,x){
							var href = htmlBody('a:contains("'+kelas+'")',this).attr('href');
							if(href){
								var URLdpk = URL+href;
								request(URLdpk, function(e, r, body){
									if(!e && r.statusCode == 200){
										regexNonPeserta = "<pre>([A-Za-z ]+)\\nProgram Studi\\t\\t: ([A-Za-z ]+)\\nSemester\\t\\t: (\\d+)/(\\d+)\\n\\nKode/Mata Kuliah\\t: ([A-Z]{2}\\d+) / ([A-Za-z &.]+), (\\d) SKS\\nNo. Kelas/Dosen\\t\\t: (\\d+) / ([A-Za-z .]+)\\n\\n-+\\nNo\\.[ ]+NIM[ ]+NAMA\\n-+\\n[A-Za-z\\d \\n'-\\.]+Total Peserta = (\\d+)\\n</pre>";
										regexPeserta = "(\\d+) (\\d+)   ([-A-Za-z \\.']+)\\n";
										var hasilRegex = body.match(regexNonPeserta);
										result["fakultas"] = hasilRegex[1];
										result["prodi"] = hasilRegex[2];
										result["semester"] = hasilRegex[3];
										result["tahun"] = "20"+hasilRegex[4];
										result["kode"] = hasilRegex[5];
										result["mata_kuliah"] = hasilRegex[6];
										result["sks"] = hasilRegex[7];
										result["kelas"] = hasilRegex[8];
										result["dosen"] = hasilRegex[9];
										result["jumlah_peserta"] = hasilRegex[10];
										result["peserta"] = [];

										var rgx = /(\d+) (\d+)   ([-A-Za-z \.']+)\n/g;
										for(var i=0;i<parseInt(hasilRegex[10]);i++){
											var hasil = rgx.exec(body);
											result["peserta"].push({nim : hasil[2] , nama : hasil[3] });
										}
										res.writeHeader(200,{"Content-Type":"application/json"});
										res.end(JSON.stringify(result));
									} else {
										result = {"error" : "URL menuju DPK tidak dapat ditemukan atau diakses"};
										res.writeHeader(404,{"Content-Type":"application/json"});
										res.end(JSON.stringify(result));
									}
								});
							} else {
								result = {"error" : "Kelas "+kelas+" tidak ditemukan"};
								res.writeHeader(404,{"Content-Type":"application/json"});
								res.end(JSON.stringify(result));
							}
						});
					} else{
						result =  {"error" : "Tidak ditemukan kelas dengan kode "+mataKuliah};
						res.writeHeader(404,{"Content-Type":"application/json"});
						res.end(JSON.stringify(result));		
					}	
				} else{
					result = {"error" : "Program studi tidak ditemukan"};
					res.writeHeader(404,{"Content-Type":"application/json"});
					res.end(JSON.stringify(result));
				}
			} else{
				result = {"error" : "Terjadi kesalahan pada server"};
				res.writeHeader(500,{"Content-Type":"application/json"});
				res.end(JSON.stringify(result));
			}
		});
	} else{
		result = {"error" : "Request tidak sesuai format"};
		res.writeHeader(400,{"Content-Type":"application/json"});
		res.end(JSON.stringify(result));	
	}
});
server.listen(80);