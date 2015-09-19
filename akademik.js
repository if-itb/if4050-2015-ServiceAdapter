// ITB COURSE FINDER API

var express = require('express'),
	tools = require('./jurusantools.js');
	
var app = express();


	
app.get('/', function (req, res) {
	var kodeMK = req.query.kode;
	var kelas = req.query.kelas;
	
	if (kodeMK == undefined || kelas == undefined){
		var response = {};
		response.error = "Request tidak sesuai format";
		res.status(400).end(JSON.stringify(response));
	}else{
		tools.getJadwalFromKodeMK(kodeMK, kelas, function (hasil){
			if (hasil == null){
				var response = {};
				response.error = "Tidak ditemukan kelas dengan kode " + kodeMK + " kelas " + kelas;
				res.status(404).end(JSON.stringify(response));
			}else{
				hasil.semester = tools.semester;
				hasil.tahun = tools.tahun;
				hasil.kode = kodeMK;
				hasil.kelas = kelas;
				
				res.end(JSON.stringify(hasil));
			}
		});
	}
});

var server = app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ITB Course Finder API v1.0\nDeveloped by Andre Susanto\n==========================');
});