var express = require('express');
var app = express();
var router = express.Router();

var port = process.env.PORT || 8080;
var host = 'https://six.akademik.itb.ac.id';
var path = '/publik/';

var request = require('request');
var cheerio = require('cheerio');

var all = /(.*)\n+.*:\s+(.*)\n+.*:\s+(\d+)\/(\d+)\n+.*:\s+(.*)\s+\/\s+(.*),\s+(\d+)\s+SKS\n+.*:\s*(\d+)\s*\/\s+(.*)\n+-*\n+.*\n+-*\n+((.*\n)*)-+\n+Total Peserta = (\d+)/g;
var allStudents = /\d+\s+(\d+)\s+(.*)/gm;

function parser(dpk) {
	var result = {};
	var match = all.exec(dpk);
	if (match === null) {
		return {
			error: "Error while parsing dpk"
		};
	} else {
		console.log(match[12]);
		result.fakultas = match[1];
		result.prodi = match[2];
		result.semester = match[3];
		result.tahun = 2000 + parseInt(match[4]);
		result.kode = match[5];
		result.mata_kuliah = match[6];
		result.sks = match[7];
		result.kelas = match[8];
		result.dosen = match[9];
		result.peserta = [];
		result.jumlah_peserta = match[12];

		var students = allStudents.exec(match[10]);
		while (students !== null) {
			result.peserta.push({
				nim: students[1],
				nama: students[2].trim()
			});
			students = allStudents.exec(match[10]);
		}
		return result;
	}
}

router.get('/', function (req, res) {
  	var query = req.query;
  	if (query.ps === undefined || query.kode === undefined || query.kelas === undefined) {
		res.status(400).json({
			error: "Query tidak valid"
		});
	} else {
		var URL = host + path + 'daftarkelas.php?ps=' + query.ps + '&semester=1&tahun=2015&th_kur=2013';
		request(URL, function(error, response, html) {
			if(!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				if ($('li').html() !== null) {
					var courses = $('li:contains("'+ query.kode +'")').html();
					if (courses) {
						$ = cheerio.load(courses);
						var href = $('a:contains("'+ query.kelas +'")').attr('href');
						if (href) {
							URLDPK = host + path + href;
							request(URLDPK, function(error, response, html) {
								if(!error && response.statusCode == 200) {
									$ = cheerio.load(html);
									var dpk = $('pre').html();
									var JSON = parser(dpk);
									res.status(200).json(JSON);
								} else {
									res.status(500).json(error);
								}
							});
						} else {
							res.status(404).json({
								error: "No matching class was found"
							});
						}
					} else {
						res.status(404).json({
							error: "No matching courses was found"
						});
					}
				} else {
					res.status(404).json({
						error: "No matching major was found"
					});
				}
			} else {
				res.status(500).json(error);
			}
		})
	}
});

app.use('/dpk', router);
app.listen(port);
console.log('DPK app is ready on port ' + port);