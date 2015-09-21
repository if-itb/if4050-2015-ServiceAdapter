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
	var matkul = req.query.mk;
	var kelas = req.query.kelas;
	var prodi = req.query.ps;

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

		https.get(options, function(r){

			r.on('data',function(d){
				html_res += d;
			}).on('end', function(d){
				html_res += d;
				$ = cheerio.load(html_res);
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

							https.get(options2, function(resd){
								resd.on('data', function(dat){
									html_res2 += dat;
								}).on('end',function(dat){
									html_res2 += dat;
									$ = cheerio.load(html_res2);
									var dpk = $('pre').html();
									var data = parsing_dpk(dpk);
									if (data.error !== undefined){
										res.status(500).json(data);
									} else {
										res.status(200).json(data);
									}
								});
							}).on('error', function(e){
								res.status(500).json({
									error: "Terjadi kesalahan pada server" 
								});
							});
						}
					}
				}
			});
		}).on('error', function(e) {
			res.status(500).json({
				error: "Terjadi kesalahan pada server"
			});
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

apps.listen(port, function(){
	console.log ("Server starting @ http://localhost:%s", port);
});

