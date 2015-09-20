var https = require("https");
var jsdom = require("jsdom");
var express = require('express');
var app = express();
var jquery = require('jQuery');


jsdom.env('<html></html>', function(error, window) {
	if (error) {
		console.log("Error while creating jsdom window: " + error);
	} else {
		$ = jquery(window);
		$.support.cors = true;
	}
});


app.get('/', function (req, res) {
	var ps = req.query.ps;
	var kode = req.query.kode;
	var kelas = req.query.kelas;
	if (ps === undefined || kode === undefined || kelas === undefined) {
		res.status(400).json({
			error: "Query tidak valid"
		});
	} else {
		$.get('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='+ps+'&semester=1&tahun=2015&th_kur=2013', function(html){ 
			var found = false;
			
			$(html).find('li').each(function(){
					if($(this).text().substring(0,6)==kode){
						found = true;
						var found2 = false;
						$(this).find('li').each(function(){
							if($(this).text().substring(8,10)==kelas){
								found2 = true;
								var link = $(this).find('a').attr('href');
								$.get('https://six.akademik.itb.ac.id/publik/'+link, function(html){
									var result = $(html).text().split("\n");
									var ret = {};
									ret["fakultas"] = result[0];
									ret["prodi"] = result[1].substr(17);
									ret["semester"] = result[2].substr(12,1);
									ret["tahun"] = "20"+result[2].substr(14,2);
									ret["kode"] = result[4].substr(19,6);
									ret["mata_kuliah"] = result[4].substring(28,result[4].length-7);
									ret["kelas"] = result[5].substr(19,2);
									ret["dosen"] = result[5].substr(24);
									ret["jumlah_peserta"] = result[result.length-2].substr(16);
									var peserta = [];
									for(var i=10;i<result.length-3;i++){
										var temp = {};
										temp["nim"] = result[i].substr(4,8);
										var j=result[i].length-1;
										for(;result[i].substr(j,1)==' ';j--){
											
										}
										temp["nama"] = result[i].substring(15,j);
										peserta.push(temp);
									}
									ret["peserta"] = peserta;
									found = true;
									res.send(ret);
								});
							}
						});
						if(!found2){
							res.status(404).json({
								error: "Kelas tidak ditemukan"
							});
						}
					}
				});
			if(!found){
				res.status(404).json({
					error: "Tidak ditemukan kelas dengan kode "+kode
				});
			}
		}).fail(function(err) {
			res.status(500).json(err); // or whatever
		});
	}
	
	
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});