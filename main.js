var http = require('http');
var url = require('url');
var cheerio = require('cheerio');
var request = require('request');
const PORT = 8080;

function requestHandler(req,res){
	var urlParts = url.parse(req.url, true);
	var query = urlParts.query;
	res.setHeader('Content-Type','application/json');
	var response = {};
	if(query.ps && query.kode && query.kelas){
		request('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='+query.ps+'&semester=1&tahun=2015&th_kur=2013', function (error, crawlRes, html) {
			if (!error && crawlRes.statusCode == 200) {
				var $ = cheerio.load(html);
				if($('ol').children('li').length != 0){
						if($('ol').children('li:contains("'+query.kode+'")').length != 0){							
							$('ol').children('li:contains("'+query.kode+'")').each(function(i,x){
								var href = $('a:contains("'+query.kelas+'")', this).attr('href');
								if(href){
									var listUrl = "https://six.akademik.itb.ac.id/publik/"+href;
									request(listUrl, function (error2,crawlRes2,html2){
										if(!error2 && crawlRes2.statusCode == 200){
											var regexString1 = "<pre>([A-Za-z ]+)\\nProgram Studi\\t\\t: ([A-Za-z ]+)\\nSemester\\t\\t: (\\d+)/(\\d+)\\n\\nKode/Mata Kuliah\\t: ([A-Z]{2}\\d+) / ([A-Za-z &.]+), (\\d) SKS\\nNo. Kelas/Dosen\\t\\t: (\\d+) / ([A-Za-z .]+)\\n\\n-+\\nNo\\.[ ]+NIM[ ]+NAMA\\n-+\\n[A-Za-z\\d \\n'-\\.]+Total Peserta = (\\d+)\\n</pre>";
											var regexString2 = /(\d+) (\d+)   ([-A-Za-z \.']+)\n/g;
											var regexResult = html2.match(regexString1);
											response["fakultas"] = regexResult[1];
											response["prodi"] = regexResult[2];
											response["semester"] = regexResult[3];
											response["tahun"] = "20"+regexResult[4];
											response["kode"] = regexResult[5];
											response["mata_kuliah"] = regexResult[6];
											response["sks"] = regexResult[7];
											response["kelas"] = regexResult[8];
											response["dosen"] = regexResult[9];
											response["jumlah_peserta"] = regexResult[10];
											response["peserta"] = [];

											for(var i=0;i<parseInt(regexResult[10]);i++){
												var result = regexString2.exec(html2);
												response["peserta"].push({nim : result[2] , nama : result[3] });
											}
											console.log(response);
											res.end(JSON.stringify(response));
										}
									});
								}
								else{
									response = {"error" : "Terjadi kesalahan pada server"};
									res.end(JSON.stringify(response));
								}
							});

						}
						else{
							response =  {"error" : "Tidak ditemukan kelas dengan kode "+query.kode};
							res.end(JSON.stringify(response));
						}	
					}
					else{
						response = {"error" : "Terjadi kesalahan pada server"};
						res.end(JSON.stringify(response));
				
					}
			} else {
				response = {"error" : "Terjadi kesalahan pada server"};
				res.end(JSON.stringify(response));
			}
		});
	} else {
		response = {"error" : "Request tidak sesuai format"};
		res.end(JSON.stringify(response));
	}
	//res.end(JSON.stringify(response));
}

var server = http.createServer(requestHandler).listen(PORT);