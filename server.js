/* 	filename : server.js
	nim/nama : 13512093 / Jonathan Sudibya */
var cheerio = require("cheerio");
var api = require("express");
var apps = api();
var https = require("https");

//define port
const port = 2121;

//https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=332&semester=1&tahun=2015&th_kur=2013
apps.get('/', function(req, res){
	var matkul = request.query.mk;
	var kelas = request.query.kelas;
	var prodi = request.query.ps;

	if (matkul === undefined || kelas === undefined || prodi === undefined)
		res.status(400).json({
			error: "Request tidak seusai format"
		});
	else {
		var options = {
			host: 'six.akademik.itb.ac.id',
			port: 443,
			path: '/publik/daftarkelas.php?ps=' + prodi + '&semester=1&tahun=2015&th_kur=2013'
		};

		var html_res = '';

		https.get(options, function(res){

			res.on('data',function(d){
				html_res += d;
			}).on('end', function(d){
				html_res += d;
				$ = cheerio.load(html);
				if ($('li').html() === null){
					res.status(404).json({
						error: "Tidak ditemukan Prodi dengan nomor "+prodi
					});
				} else {
					var matakuliah = $('li:contains("'+matkul+'")').html();
					if (matakuliah === null){
						res.status(404).json({
							error: "Tidak ditemukan kelas"+matkul
						});
					} else {
						$ = cheerio.load(matakuliah);
						var no_kelas = $('a:contains("'+kelas+'")').attr('href');
						if (no_kelas === undefined){
							res.status(404).json({
								error: "Tidak nomor kelas :" + kelas + " di matkul " + matkul
							});
						} else {

							var html_res2 = '';
							var options2 = {
								host: 'six.akademik.itb.ac.id',
								port: 443,
								path: '/publik/'+no_kelas
							};

							https.get(options2, function(res){
								res.on('data', function(dat){
									links += dat;
								}).on('end',function(dat){
									links += dat;
									$ = cheerio.load(links);
									var dpk = $('pre').html();
									var data = parsing_dpk(dpk);
									if (data.error)
								});
							});
						}
					}
				}
			});
		});
	}
});

apps.listen(port, function(){
	console.log ("Server starting @ http://localhost:%s", port);
});

