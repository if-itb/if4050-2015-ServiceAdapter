var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function (req, res){
	var prodi = req.query.prodi;
	var kode = req.query.kode;
	var kelas = req.query.kelas

	var baseurl = 'https://six.akademik.itb.ac.id/publik/';
	var prodiurl = 'daftarkelas.php?ps='+prodi+'&semester=1&tahun=2015&th_kur=2013';

	request(baseurl + prodiurl, function(error, response, html){
		if(!error && response.statusCode == 200){
			var $ = cheerio.load(html);
			$('li').each(function(){
				if($(this).text().substring(0,6)===kode){
					$(this).find('a').each(function(){
						if($(this).text().substring(0,2)===kelas){
							var href = $(this).attr('href');
							request(baseurl+href, function(error,response,html){
								$ = cheerio.load(html);
								text = $('pre').text().split('\n');
								var result = parsing(text);
								res.status(200).json(result);
							});		
						}
					});	
				}
			});
		}
		
	});
});

function parsing(text){
	var result = {};
	result.fakultas = text[0];
	result.prodi = text[1].substr(17);
	result.semester = text[2].substr(12,1);
	result.tahun = "20" + text[2].substr(14);
	result.kodematkul = text[4].substr(19,6);
	result.namamatkul = text[4].substr(28).split(',')[0];
	result.sks = text[4].substr(text[4].length-5,1);
	result.kelas = text[5].substr(19,2);
	result.dosen = text[5].substr(24);
	result.jumpeserta = text[text.length-2].substr(16);
	result.peserta = [];
	//console.log(result.length-3);
	for(var i = 10; i < text.length-3 ; i++){
		result.peserta.push({
			"nim" : text[i].substr(4,6),
			"nama" : text[i].substr(15).trim()
		});
	}
	return result;
};

app.listen('80');
console.log('Server is running');
exports = module.exports = app;