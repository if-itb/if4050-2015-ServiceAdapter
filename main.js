var https = require("https");

// Download html dari url
function download(url, callback) {
	https.get(url, function(res) {
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function(){
		callback(null);
	});
}

var express = require('express');
var exp = express();
exp.use(express.static('public'));

exp.get('/', function(req, res){
	var cheerio = require("cheerio");
    var url = "https://six.akademik.itb.ac.id/publik/displayprodikelas.php?semester=1&tahun=2015&th_kur=2013";
	download(url, function(data){
		if(data){
			var $prd = cheerio.load(data);
			var $prdFound=0;
			if((req.query["prodi"]==null || req.query["kode"]==null) || req.query["kelas"]==null){
				console.log("Query Format Problem");
				var json = {};
				res.status(400);
				json["Error"]= "Tidak sesuai format";
				console.log(json);
				res.send(json);
			} 
			else {
			// Crawl Prodi
			$prd("li").each(function(i,e){
				var link = $prd(e).find("a");
                var jrsn = link.html();
                if (jrsn.indexOf(req.query["prodi"]) > -1 && $prdFound==0){
					$prdFound=1;
					var newUrl = "https://six.akademik.itb.ac.id/publik/"+link.attr("href");
					download(newUrl, function(data){
                        if (data){
							var $matkulFound=0;
							var $subject = cheerio.load(data);
							// Crawl matkul
                            $subject("ul").each(function(i, e){
								var matkul = $subject(e).parent()
								var matkultext= matkul.text();
								if(matkultext.indexOf(req.query["kode"]) > -1 && $matkulFound==0){
									$matkulFound=1;
									var $kls = cheerio.load(matkul.html());
									var $klsFound=0;
									$kls("li").each(function(i, e){
										var linkKelas = $kls(e).find("a");
										var linkNomorKelas = linkKelas.html();
										var finalUrl = "https://six.akademik.itb.ac.id/publik/"+linkKelas.attr("href");
										if(linkNomorKelas.indexOf(req.query["kelas"]) > -1 && $klsFound==0){
											$klsFound=1;
											download(finalUrl, function(data){
												var row = data.split("\n");
                                                var json = {};
												res.status(200);
												json["prodi"] = row[1].substring(row[1].indexOf(":")+2);
                                                json["semester"] = row[2].substring(row[2].indexOf(":")+2);
                                                json["kode"] = row[4].substring(row[4].indexOf(":")+2,row[4].lastIndexOf("/")-1);
                                                json["mata kuliah"] = row[4].substring(row[4].lastIndexOf("/")+2, row[4].indexOf(","));
                                                json["sks"] = row[4].substring(row[4].indexOf(",")+2);
                                                json["kelas"] = row[5].substring(row[4].indexOf(":")+2, row[5].lastIndexOf("/")-1);
                                                json["dosen"] = row[5].substring(row[5].lastIndexOf("/")+2);
                                                json["jumlah peserta"] = 0;
												json["peserta"] = [];
												
												var mahasiswa = {};
												var jumlah=0;
                                                for (var i =10; i < row.length-4 ; i++)
                                                {	
													jumlah=jumlah+1;
                                                    row[i]=row[i].trim();
                                                    json["peserta"].push(mahasiswa["nim"]= row[i].substr(4,8)); 
                                                    json["peserta"].push(mahasiswa["nama"]= row[i].substr(15));
                                                }
												json["jumlah peserta"] = jumlah;
                                                console.log(json);
                                                res.send(json);
											});
										}     
									});
									// Kelas not found
									if($klsFound==0){
										var json = {};
										res.status(404);
										console.log("Kelas not found");
										json["Error"]= "Tidak ditemukan kelas "+req.query["kelas"]+" Dalam matakuliah "+req.query["kode"];
										console.log(json);
                                        res.send(json);
									}
								}
							});
							// Matkul not found
							if($matkulFound==0){
								console.log("Matkul not found");
								var json = {};
								res.status(404);
								json["Error"]= "Tidak ditemukan kelas dengan kode "+req.query["kode"];
								console.log(json);
                                res.send(json);
							}
						}
					});
				}
			});
			// Prodi not found
			if($prdFound==0){
				console.log("Matkul not found");
				var json = {};
				res.status(404);
				json["Error"]= "Tidak ditemukan Prodi dengan kode : "+req.query["prodi"];
				console.log(json);
                res.send(json);
			}
			}
		} else{
			console.log("Server Problem");
			var json = {};
			res.status(500);
			json["Error"]= "Terjadi masalah dalam server";
			console.log(json);
            res.send(json);
		}
	
	});
});

var server = exp.listen(8081, function() {
    console.log("Server at localhost:8081");
	var host = server.address().address
    var port = server.address().port 
})