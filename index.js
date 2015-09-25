var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var app     = express();

app.use(function(req, res, next) {
	if (!req.query.ps || !req.query.kode || !req.query.kelas) {
		res.type('application/json');
		res.status(400).json({'error': 'Request tidak sesuai format'});
	} else {
		next();
	}
});

app.get('/', function(req, res) {
	var base_url = 'https://six.akademik.itb.ac.id/publik/';

	var ps = req.query.ps;
	var code = req.query.kode.toUpperCase();
	var class_no = req.query.kelas;

	async.waterfall([
		function(callback) {
			var classlist_url = 'daftarkelas.php?ps=' + ps + '&semester=1&tahun=2015&th_kur=2013';
			
			request(base_url + classlist_url, function(error, response, html) {
				var dpk_url = '';
				var err = null;

				if (!error) {
					var $ = cheerio.load(html);
					
					$('ol li').filter(function(i, el) {
						var text = $(this).text();
						return (text.substring(0, text.indexOf(' ')) == code);
					}).children('ul').children('li').each(function(i, el) {
						var text = $(this).children('a').first().html();
						if (text == class_no) {
							dpk_url = $(this).children('a').first().attr('href');
						}
					});

					if (!dpk_url) {
						err = 404;
					}
				} else {
					err = 500;
				}

				callback(err, base_url + dpk_url);
			});
		},
		function(dpk_url, callback) {
			request(dpk_url, function(error, response, html) {
				var json = {};
				var err = null;

				if (!error) {
					var $ = cheerio.load(html);

					var data              	= $('pre').text().replace('"','').split('\n');
					json['fakultas']      	= data[0];
					json['prodi']			= data[1].substring(data[1].indexOf(':')+2);
					json['semester']      	= data[2].substring(data[2].indexOf(':')+2,data[2].indexOf('/'));
					json['tahun']         	= parseInt('20' + data[2].substring(data[2].indexOf('/')+1));
					json['kode']          	= data[4].substring(data[4].indexOf(':')+2,data[4].lastIndexOf('/')-1);
					json['mata_kuliah']   	= data[4].substring(data[4].lastIndexOf('/')+2,data[4].indexOf(','));
					json['sks']           	= data[4].substr(data[4].indexOf(',')+2,1);
					json['kelas']         	= data[5].substring(data[5].indexOf(':')+2,data[5].lastIndexOf('/')-1);
					json['dosen']         	= data[5].substring(data[5].lastIndexOf('/')+2);
					json['jumlah_peserta']	= data[data.length-2].substring(data[data.length-2].indexOf('=')+2);
					json['peserta']     	= [];

					for (var i=10; i<data.length-3; i++) {
						data[i] = data[i].trim();

						var peserta     = {};
						peserta['nim']  = data[i].substring(data[i].indexOf(' ')+1,data[i].indexOf('   '));
						peserta['nama'] = data[i].substring(data[i].indexOf('   ')+3);

						json['peserta'].push(peserta);
					}
				} else {
					err = 500;
				}

				callback(err, json);
			});
		}
	], function (err, result) {
		res.type('application/json');
		if (!err) {
			res.status(200).json(result);
		} else if (err == 404) {
			res.status(404).json({'error': 'Tidak ditemukan kelas dengan kode ' + code});
		} else if (err = 500) {
			res.status(500).json({'error': 'Terjadi kesalahan pada server'});
		} else {
			res.status(500).json({'error': 'Terjadi kesalahan pada server'});
		}
	});
});

app.listen('8000');
console.log('Magic happens on port 8000');

exports = module.exports = app;
