var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();


app.get('/', function (req, res){
	var prodi = req.query.ps;
	var matkul = req.query.kode;
	var kelas = req.query.kelas

	//console.log(prodi);
	//console.log(matkul);
	//console.log(kelas);

	if (!prodi || !matkul || !kelas) {
		var result = {};
		result.error = "Request tidak sesuai format";
		res.status(400).json(result);
	} else {
		var url = 'https://six.akademik.itb.ac.id/publik/daftarkelas.php';
		var param = '?ps='+prodi+'&semester=1&tahun=2015&th_kur=2013';

		request(url + param, function(error, response, html){
			if(!error && response.statusCode == 200){
				var $ = cheerio.load(html);
				var found = false;
				$('li').each(function(){
					if($(this).text().substring(0, 6)===matkul){
						found = true;
						$(this).find('a').each(function(){
							if($(this).text().substring(0, 2)===kelas){
								var href = $(this).attr('href');
								request(url+href, function(error,response,html){
									$ = cheerio.load(html);
									text = $('pre').text().split('\n');
									var result = parse(text);
									res.status(200).json(result);
								});		
							}
						});	
					}
				});

				if(!found) {
					var result = {};
					result.error = "Tidak ditemukan kelas dengan kode "+matkul;
					res.status(404).json(result);
				}
			} else {
				//console.log(response.statusCode);
				var result = {};
				result.error = "Terjadi kesalahan pada server";
				res.status(500).json(result);
			}
			
		});
	}
});


function parse(text){
	var result = {};
	result.fakultas = text[0];
	result.prodi = text[1].substr(17);
	result.semester = text[2].substr(12, 1);
	result.tahun = "20" + text[2].substr(14);
	result.kode = text[4].substr(19, 6);
	result.nama_matkul = text[4].substr(28).split(',')[0];
	result.sks = text[4].substr(text[4].length-5, 1);
	result.kelas = text[5].substr(19, 2);
	result.dosen = text[5].substr(24);
	result.jumlah_peserta = text[text.length-2].substr(16);
	result.peserta = [];
	for(var i = 10; i < text.length-3 ; i++){
		result.peserta.push({
			"nim" : text[i].substr(4, 6),
			"nama" : text[i].substr(15).trim()
		});
	}
	return result;
};

app.listen('8000');
console.log('Server is running');