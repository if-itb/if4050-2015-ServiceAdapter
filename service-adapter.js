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
		var hasil = {};
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
										regex-non-peserta = "<pre>([A-Za-z ]+)\\nProgram Studi\\t\\t: ([A-Za-z ]+)\\nSemester\\t\\t: (\\d+)/(\\d+)\\n\\nKode/Mata Kuliah\\t: ([A-Z]{2}\\d+) / ([A-Za-z &.]+), (\\d) SKS\\nNo. Kelas/Dosen\\t\\t: (\\d+) / ([A-Za-z .]+)\\n\\n-+\\nNo\\.[ ]+NIM[ ]+NAMA\\n-+\\n[A-Za-z\\d \\n'-\\.]+Total Peserta = (\\d+)\\n</pre>";
										regex-peserta = "(\\d+) (\\d+)   ([-A-Za-z \\.']+)\\n";
										var hasil-regex = body.match(regex-non-peserta);
										result["fakultas"] = hasil-regex[1];
										result["prodi"] = hasil-regex[2];
										result["semester"] = hasil-regex[3];
										result["tahun"] = "20"+hasil-regex[4];
										result["kode"] = hasil-regex[5];
										result["mata_kuliah"] = hasil-regex[6];
										result["sks"] = hasil-regex[7];
										result["kelas"] = hasil-regex[8];
										result["dosen"] = hasil-regex[9];
										result["jumlah_peserta"] = hasil-regex[10];
										result["peserta"] = [];

										var rgx = /(\d+) (\d+)   ([-A-Za-z \.']+)\n/g;
										for(var i=0;i<parseInt(hasil-regex[10]);i++){
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
					result = {"error" : "Kode jurusan tidak ditemukan"};
					res.writeHeader(404,{"Content-Type":"application/json"});
					res.end(JSON.stringify(result));
				}
			} else{
				result = {"error" : "URL menuju program studi tidak dapat ditemukan atau diakses"};
				res.writeHeader(404,{"Content-Type":"application/json"});
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