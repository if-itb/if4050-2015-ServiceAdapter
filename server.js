
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();



//The web scraping thingy
app.get('/', function(req,res) {
	
	var kodeProdi = req.query.prodi;
	var kodeMatkul = req.query.matkul;
	var noKelas = req.query.kelas;

	var baseurl = 'https://six.akademik.itb.ac.id/publik/';
	var urlprodi = 'daftarkelas.php?ps=' +kodeProdi+ '&semester=1&tahun=2015&th_kur=2013';
	var urlkelas = '';

	//All the web scraping
	request(baseurl + urlprodi, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			$('li').each(function() {
				if ($(this).text().substring(0,6) == kodeMatkul) {
					$(this).find('a').each(function() {
						//console.log($(this).attr('href'));

						if($(this).text().substring(0,2) == noKelas) {
							urlkelas = $(this).attr('href');

							request(baseurl + urlkelas, function (error, response, html) {
								var $ = cheerio.load(html);
								var dokumenKelas = $('pre').text().split('\n');
								var jsonOutput = {};

								jsonOutput['fakultas'] = dokumenKelas[0];
								jsonOutput['program_studi'] = dokumenKelas[1].split(':')[1].substring(1);
								jsonOutput['semester'] = dokumenKelas[2].split(':')[1].substring(1,2);
								jsonOutput['tahun'] = '20'+dokumenKelas[2].split('/')[1].substring(0,2);
								jsonOutput['kode_kuliah'] = dokumenKelas[4].substring(19,25);
								jsonOutput['mata_kuliah'] = dokumenKelas[4].substring(28).split(',')[0];
								jsonOutput['jum_sks'] = dokumenKelas[4].split(',')[1].substring(1,2);
								jsonOutput['no_kelas'] = dokumenKelas[5].split(':')[1].substring(1,3);
								jsonOutput['dosen'] = dokumenKelas[5].split(':')[1].substring(6);
								jsonOutput['peserta'] = [];
								for (var row = 10; row<dokumenKelas.length-3; row++) {
									jsonOutput['peserta'].push({
										no: dokumenKelas[row].substring(0,3),
										nim: dokumenKelas[row].substring(4,12),
										nama: dokumenKelas[row].substring(15).trim()
									});
								}
								//console.log(dokumenKelas[0]);
								//console.log(dokumenKelas[11].substring(15).trim());

								res.send(jsonOutput);

							});
						
						}

					});
				}
			});
		}

		else if (!error && response.statusCode==404) {
			res.status(404).send({ error: "Halaman tidak ditemukan, cek input" });
		}

		else if (!error && response.statusCode==500) {
			res.status(500).send({ error: "Server error, coba lagi" });
		}

	});

})


app.listen('8081')
console.log('Listening on port 8081...');

exports = module.exports = app;