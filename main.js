/*
 * Nama : Muhammad Reza Irvanda
 * Nim	: 13512042
 * Format Request : /ps=<kode_jurusan>&kode=<kode>&kelas=<kelas>
 */
var http = require('http'); //untuk membuat webserver
var url = require('url'); //untuk mengambil nilai dari setiap parameter
var cheerio = require('cheerio'); //untuk melakukan parsing terhadap data pada web asli
var request = require('request'); //untuk mengirimkan request kepada URL penyedia data asli
const SERVER_PORT = 8081;


function handleRequest(request1,response1){
	var url_parts = url.parse(request1.url, true);
	var query = url_parts.query;
	response1.setHeader('Content-Type','application/json');

	if(query.ps && query.kode && query.kelas){
		var baseURL  = 'https://six.akademik.itb.ac.id/publik/'
		var allClassURL = baseURL+'daftarkelas.php?ps='+query.ps+'&semester=1&tahun=2015&th_kur=2013';
		var result = {};
		request(allClassURL,function (error,response2,body){
				if(!error && response2.statusCode == 200)
				{ //indexOf("=") membedakan request gagal (kode kelas tidak ditemukan)
					var $ = cheerio.load(body);
					if($('ol').children('li').length != 0){
						if($('ol').children('li:contains("'+query.kode+'")').length != 0){							
							$('ol').children('li:contains("'+query.kode+'")').each(function(i,x){
								var href = $('a:contains("'+query.kelas+'")', this).attr('href');
								if(href){
									var dpkURL = baseURL+href;
									request(dpkURL, function (error3,response3,body3){
										if(!error3 && response3.statusCode == 200){
											regex_non_peserta = "<pre>([A-Za-z ]+)\\nProgram Studi\\t\\t: ([A-Za-z ]+)\\nSemester\\t\\t: (\\d+)/(\\d+)\\n\\nKode/Mata Kuliah\\t: ([A-Z]{2}\\d+) / ([A-Za-z &.]+), (\\d) SKS\\nNo. Kelas/Dosen\\t\\t: (\\d+) / ([A-Za-z .]+)\\n\\n-+\\nNo\\.[ ]+NIM[ ]+NAMA\\n-+\\n[A-Za-z\\d \\n'-\\.]+Total Peserta = (\\d+)\\n</pre>";
											regex_peserta = "(\\d+) (\\d+)   ([-A-Za-z \\.']+)\\n";
											var hsl_regex = body3.match(regex_non_peserta);
											result["fakultas"] = hsl_regex[1];
											result["prodi"] = hsl_regex[2];
											result["semester"] = hsl_regex[3];
											result["tahun"] = "20"+hsl_regex[4];
											result["kode"] = hsl_regex[5];
											result["mata_kuliah"] = hsl_regex[6];
											result["sks"] = hsl_regex[7];
											result["kelas"] = hsl_regex[8];
											result["dosen"] = hsl_regex[9];
											result["jumlah_peserta"] = hsl_regex[10];
											result["peserta"] = [];

											var rgx = /(\d+) (\d+)   ([-A-Za-z \.']+)\n/g;
											for(var i=0;i<parseInt(hsl_regex[10]);i++){
												//console.log(body3.match(regex_peserta)[1]," ",body3.match(regex_peserta)[2]," ",body3.match(regex_peserta)[3]);
												var hsl = rgx.exec(body3);
												result["peserta"].push({nim : hsl[2] , nama : hsl[3] });
												//console.log(rgx.exec(body3)[2]);
											}
											response1.end(JSON.stringify(result));
										}
									});
								}
								else{
									result = {error : "kode kelas tidak ditemukan"};
									response1.end(JSON.stringify(result));
								}
							});

						}
						else{
							result =  {error : "Tidak ditemukan kelas dengan kode "+query.kode};
							response1.end(JSON.stringify(result));		
						}	
					}
					else{
						result = {error : "kode jurusan tidak ditemukan"};
						response1.end(JSON.stringify(result));
					}
					
					
				}
				else{
					result = {error : error};
					response1.end(JSON.stringify(result));
				}
		});
	}
	else{
		response1.end(JSON.stringify({error : "Request tidak sesuai format"}));	
	}
	
}

var server = http.createServer(handleRequest);

server.listen(SERVER_PORT, function(){
	console.log("Server is living on : http://localhost:%s", SERVER_PORT);
});
