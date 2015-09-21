var request = require("request"),
	cheerio = require("cheerio"),
	express = require("express"),	
	app = express();

app.get('/', function(req,resp){
	var prodi = req.query.ps,
		kode_kuliah = req.query.kode,
		kelas = req.query.kelas,
		url = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+prodi+"&semester=1&tahun=2015&th_kur=2013";
	//function getResponse(callback){
		if( prodi != null && kode_kuliah != null && kelas != null){
			request(url, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body),
						getURL = $('li:contains("'+kode_kuliah+'")').find('li:contains("'+kelas+'")').find('a').attr('href');
						newURL = 'https://six.akademik.itb.ac.id/publik/' + getURL;
					
					request(newURL, function (error, response, body) {
						if (!error) {
							if(getURL == null){
								var json = {};
								json.error = "Tidak ditemukan kelas dengan kode "+kode_kuliah;
								console.log("Status Code: 404");
								resp.status(404).send(json);
								//callback(json);
							}else{
								var $ = cheerio.load(body),
									data = $('pre').text().split('\n'),
									json = {};
									json.fakultas = data[0];
									json.prodi = data[1].substr(17);
									json.semester = data[2].substr(12,1);
						    		json.tahun = "20" + data[2].substr(14);
						    		json.kode = data[4].substr(19,6);
						    		
						    		var mata_kuliah = data[4].substr(28).split(',');
						    		json.mata_kuliah = mata_kuliah[0];
						    		json.sks = mata_kuliah[1].substr(1,1);
						    		
						    		json.kelas = data[5].substr(19,2);
						    		json.dosen = data[5].substr(24);
						    		json.jumlah_peserta = data[data.length-2].substr(16);
									
									var peserta_kelas = [];
									for(i = 0; i < json.jumlah_peserta; i++){
										jsonPK = {};
										jsonPK.nim = data[10+i].substr(4,8);
										jsonPK.nama = data[10+i].substr(15);
										peserta_kelas.push(jsonPK);
									}
									json.peserta = peserta_kelas;
									console.log("Status Code: 200");
									resp.status(200).send(json);
									//callback(json);
								}
						} else {
							var json = {};
							json.error = "Terjadi kesalahan pada server";
							console.log("Status Code: 500");
							resp.status(500).send(json);
							//callback(json);
						}
					});

				} else {
					var json = {};
					json.error = "Terjadi kesalahan pada server";
					console.log("Status Code: 500");
					resp.status(500).send(json);
					//callback(json);
				}
			});
		}
		else{
			var json = {};
			json.error = "Request tidak sesuai format";
			console.log("Status Code: 400");
			resp.status(400).send(json);
			//callback(json);
		}
	//}
	/*getResponse(function (hasil){
		resp.send(hasil);
	});*/
});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("listening on port: " + port);
});