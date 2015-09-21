var https = require("https");


//Download a URL and Invoke
// callback with the data
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
var app = express();
app.use(express.static('public'));

app.get('/', function(req, res)
{
	var cheerio = require("cheerio");
	var url = "https://six.akademik.itb.ac.id/publik/displayprodikelas.php?semester=1&tahun=2015&th_kur=2013";

	download(url, function(data){
		if (data) {
			var $prodi = cheerio.load(data);
			$prodi("li").each(function(i, e){
					var link = $prodi(e).find("a");
					var jurusan = link.html();
					if (jurusan.indexOf(req.query["ps"]) > -1) 
					{
						var newUrl = "https://six.akademik.itb.ac.id/publik/"+link.attr("href");
						download(newUrl, function(data)
						{
							if (data) 
							{
								var $subject = cheerio.load(data);
								$subject("ul").each(function(i, e)
								{
									var makul = $subject(e).parent()
									var makultext= makul.text();							
									if(makultext.indexOf(req.query["kode"]) > -1)
									{
										var $kelas = cheerio.load(makul.html());
										$kelas("li").each(function(i, e)
										{
											var link_kelas = $kelas(e).find("a");
											var link_nomor_kelas = link_kelas.html();
											var urlFinal = "https://six.akademik.itb.ac.id/publik/"+link_kelas.attr("href");
											if(link_nomor_kelas.indexOf(req.query["kelas"]) > -1)
											{
												download(urlFinal, function(data)
												{
													var row = data.split("\n");
													var json = {};
													json["Fakultas"] = row[0].replace("<pre>", "" );
													json["Prodi"] = row[1].substring(row[1].indexOf(":")+2);
													json["Semester"] = row[2].substring(row[2].indexOf(":")+2);
													json["Kode"] = row[4].substring(row[4].indexOf(":")+2,row[4].lastIndexOf("/")-1);
													json["Mata_Kuliah"] = row[4].substring(row[4].lastIndexOf("/")+2, row[4].indexOf(","));
													json["Kredit"] = row[4].substring(row[4].indexOf(",")+2);
													json["No_Kelas"] = row[5].substring(row[4].indexOf(":")+2, row[5].lastIndexOf("/")-1);
													json["Dosen"] = row[5].substring(row[5].lastIndexOf("/")+2);
													json["Mahasiswa"] = [];
													var mahasiswa = {};
													for (var i =10; i < row.length-4 ; i++)
													{
														row[i]=row[i].trim();
														json["Mahasiswa"].push(mahasiswa["No_Urut"]= row[i].substr(0,3));
														json["Mahasiswa"].push(mahasiswa["NIM"]= row[i].substr(4,8)); 
														json["Mahasiswa"].push(mahasiswa["Nama"]= row[i].substr(15));
													}
													//console.log(json);

													res.send(json);
													return false;
												});
											} 
										});
									} /*else {
											var message = {};
											message.error = "Error kode kuliah "+req.query["Kode"]+" tidak ditemukan";
											res.send(message);
											return false;
										}*/
								
							});
							}
						});
					} /*if(!foundP) {
						var message = {};
						message.error = "Error program studi "+req.query["ProgramStudi"]+" tidak ditemukan";
						res.send(message);
						return false;
					}*/
			});
		}
	});
});

var server = app.listen(8081, function() {
	var host = server.address().address
	var port = server.address().port 
})