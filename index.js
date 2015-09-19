var express = require('express');
var https = require("https");
var cheerio = require("cheerio");

var app = express();

var base_url = "https://six.akademik.itb.ac.id/publik/";
var sem = 1; 
var th = 2015;
var kur = 2013;
var regPesertaKelas = /([0-9]{8})(.*)/g;
var regAll = /(^(.*)$)\n.+Studi\s+:\s+(.*$)\n.+:\s(\d)\/(\d+)\n+.+:\s+(\w+)\s\/\s(.*),\s(\d).+\n.+:\s(\d+)\s\/\s(.*)(.|\n)*-\n.+=\s(.*)/m;
var regNama = /\s{3}(.*$)/gm;

var download = function (url, callback) {
	https.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
	var ps = req.query.ps;
	var kd = req.query.kode;
	var kls = req.query.kelas;

	if ((ps != null) && (kd != null) && (kls != null)) {
		var url = base_url + "daftarkelas.php?ps=" + ps + "&semester=" + sem + "&tahun=" + th + "&th_kur=" + kur;

		download(url, function(data) {
			if (data) {
				var $ = cheerio.load(data, {
				    ignoreWhitespace: false,
				    xmlMode: false,
				    lowerCaseTags: false});
				var ada = false;
				var class_links = [];
				$("ol > li").each(function(i, e) {
		        	var mk = $(e).text();
		        	if (mk.indexOf(kd) > -1) {
		        		ada = true;

		        		$(e).find("li>a").each(function(j, elem) {
		        			class_links[j] = $(elem).attr("href");
		        		});
		        	}
		      	});

				if (kls > class_links.length/2) {
					ada = false;
					console.log("kelas ga ada");
				}

		      	if (!ada) {
		      	 	console.error("kelas ga ketemu");
		      	 	res.status(404).send("Tidak ditemukan kelas dengan kode : " + kd);
		      	} else {
		      	 	class_url = base_url + class_links[(kls*2)-2];
		      	 	console.log(class_url);

		      	 	var arr = [];
		      	 	var arr2 = [];
		      	 	var jsonArr = { };

		      	 	download(class_url, function(data) {
		      	 		if (data) {
		      	 			$ = cheerio.load(data);
		      	 			data = $("pre").text();

		      	 			arr = data.match(regAll);
		      	 			arr2 = data.match(regPesertaKelas);

		      	 			if (arr.length == 0 || arr2.length == 0) {
				      	 		console.error("error get dpk");
				      	 	} else {

				      	 		jsonArr.fakultas = arr[1];
				      	 		jsonArr.prodi = arr[3];
				      	 		jsonArr.semester = arr[4];
				      	 		jsonArr.tahun = arr[5];
				      	 		jsonArr.kode = arr[6];
				      	 		jsonArr.mata_kuliah = arr[7];
				      	 		jsonArr.sks = arr[8];
				      	 		jsonArr.kelas = arr[9];
				      	 		jsonArr.dosen = arr[10];
				      	 		jsonArr.jumlah_peserta = arr[12];
				      	 		
				      	 		var peserta = [];

				      	 		for (var i = 0; i< arr2.length; ++i) {
				      	 			var item = arr2[i];
				      	 			peserta.push ({
				      	 				"nim" : item.split(/\s{3}/)[0],
				      	 				"nama" : item.split(/\s{3}/)[1]
				      	 			});
				      	 		}

				      	 		jsonArr.peserta = peserta;

				    //   	 		var temp1 = "";
				    //   	 		for (var i = 1; i< arr.length; ++i) {
				    //   	 			temp1 += i + ": " + arr[i] + "<br>";
				    //   	 		}

				      	 		res.status(200).send(JSON.stringify(jsonArr));
				      	 	}
		      	 		} else {
		      	 			console.log("error downloading2");
		      	 		}
		      	 	});
				}
			} else {
				console.error("error downloading1");
			}
		});
	} else {
		res.status(400).send("Request tidak sesuai format");
	}

});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server');
});