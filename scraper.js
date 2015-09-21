var request = require("request"),
	cheerio = require("cheerio"),
	// https = require("https"),
	express = require("express"),
	app = express();


app.get('/', function(req, res){
	var	ps=req.query.ps,
		kode=req.query.kode,
		kelas=req.query.kelas,
		url = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+ps+"&semester=1&tahun=2015&th_kur=2013";
	function scraper(callback, statuscode){
		if(ps!=null && kode!= null && kelas!=null){
			request(url, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body),
						href = $("li:contains('"+kode+"')").find("li:contains('"+kelas+"')").find('a').attr('href');
					if(href!=null){
						console.log("href : "  + href);
						url2 = "https://six.akademik.itb.ac.id/publik/"+href;
						request(url2, function(error, response, body){
							if(!error){
								var $ = cheerio.load(body),
								lines = $("pre").html().split("\n");
								var result = new Object();
								// array peserta
								var pesertaArray = new Array();
								lines.forEach(function(item){
									// console.log(item);
									if(lines.indexOf(item)==0){
										result.fakultas = item;
									}
									if(item.indexOf('Program Studi')!=-1){
										result.prodi = item.substr(17);
									}
									else if(item.indexOf('Semester')!=-1){
										result.semester = item.substr(-4,1);
										result.tahun = 20+item.substr(-2);
									}
									else if(item.indexOf('Kode')!=-1){
										result.kode = item.substr(19,6);
										result.mata_kuliah = item.substring(28, item.length-7);
										result.sks = item.substr(item.length-5,1);
									}
									else if(item.indexOf('Dosen')!=-1){
										result.kelas = item.substr(19,2);
										result.dosen = item.substr(item.indexOf('/',12)+2);
									}
									else if(item.indexOf('Peserta')!=-1){
										result.jumlah_peserta = item.substr(item.indexOf('=')+2);
									}
									else if(lines.indexOf(item)>9 && lines.indexOf(item)<lines.length-2){
										// console.log(lines.length);
										var peserta = new Object(); 
										peserta.nim = item.substr(4,8);
										peserta.nama = item.substr(15);
										pesertaArray.push(peserta);

									}
								})

								result.peserta = pesertaArray;
								console.log(result);

								// res.status(200).send({ error: 'Something blew up!' });
								statuscode = 200;
								callback(result,statuscode);

							}
							else{
								var result = new Object();
								result.error = "Terjadi kesalahan pada server"
								console.log(result);
								statuscode = 500;
								callback(result,statuscode);
							}
						})
					}else{
						// console.log('ga ada matkulnya');
						var result = new Object();
						result.error = "Tidak ditemukan kelas dengan kode " + kode;
						console.log(result);
						statuscode = 404;
						callback(result,statuscode);
					}
				} else {
					console.log("We’ve encountered an error: " + error);
					var result = new Object();
					result.error = "Terjadi kesalahan pada server";
					console.log(result);
					statuscode = 500;
					callback(result,statuscode);
				}

			});
		} else{
			console.log("request salah");
			var result = new Object();
			result.error = "Request tidak sesuai format";
			console.log(result);
			statuscode = 400;
			callback(result,statuscode);
		}
	}
	scraper(function (result,statuscode){
		res.status(statuscode).send(result);	
	});
});


var server = app.listen(8000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('port : ' + port);
});