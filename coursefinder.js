/* NIM : 13512018 */
/* Nama : Tony */
/* Github ID : TonyWijaya */
/* Tugas Service Adapter Daftar Peserta Kelas akademik.itb.ac.id */

var express = require('express');
var https = require('https');
var app = express();

// sending get request
app.get('/', function (req, res) 
{
  var ps = req.query.ps;
  var kode = req.query.kode;
  var kelas = req.query.kelas;
  var semester = "1";
  var tahun = 2015;

  if (kode == undefined || kode == undefined || kelas == undefined) { // request is not matched with format
  	var response = {};
  	response.error = "Request tidak sesuai format";
  	res.status(400).end(JSON.stringify(response));
  	console.log("Status Code: 400");
  }
  else { // request is matched
  	var linkDaftarKelas = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?" + "ps=" + ps + "&semester=" + semester + "&tahun=" + tahun + "&th_kur=2013";
  	console.log("Connecting to " + linkDaftarKelas + ". . .");

  	https.get(linkDaftarKelas,function (res1) {

  		var data = "";

  		if (res.statusCode === 500) { // internal server error
  			var response ={};
			response.error = "Terjadi kesalahan pada server";
			res.status(500).end(JSON.stringify(response));
			console.log("Status Code: 500");
  		}
  		else {
			res1.on('data', function(chunk) {
				data += chunk; // adding each chunk to data
			});

			res1.on('end',function() { // after all data is already gathered
				var result = data.split(kode); // upper boundary of separation by kode mata kuliah

				if (result.length < 2) { // kode mata kuliah not found
					var response ={};
					response.error = "Tidak ditemukan kelas dengan kode " + kode;
					res.status(404).end(JSON.stringify(response));
					console.log("Status Code: 404");
				}
				else { // kode mata kuliah found (splitted)
					result = result[1].split("</ul>"); // bottom boundary of separation by </ul> tag

					var regex = new RegExp("<a href=\"([\\w.?=%]+)\" >" + kelas + "<\\/a>","i"); 
					var regexResult = regex.exec(result);
					if (regexResult == null) { // kode mata kuliah not found
						var response = {};
						response.error = "Tidak ditemukan kelas dengan kode " + kode;
						res.status(404).end(JSON.stringify(response));
						console.log("Status Code: 404");
						}
					else { // link has been found
						var linkDisplayDPK = "https://six.akademik.itb.ac.id/publik/" + regexResult[1];
						console.log("Connecting to " + linkDisplayDPK + ". . .");

						https.get(linkDisplayDPK, function(res2) {
							data = ""
							res2.on('data', function(chunk) {
								data += chunk; //adding each chunk to data
							});

							res2.on('end',function() { // after all data is already gathered
								var result = {};
								
								// regex for all data related to mata kuliah except students
								regex = /([\w ]+)\nProgram Studi\t\t: ([\w ]+)\n.+\n\nKode\/Mata Kuliah\t: [\w]+ \/ (.+), (\d) SKS\nNo\. Kelas\/Dosen\t\t: \d\d \/ ([\w ]+)\n[\w\W]+Total Peserta = ([\d]+)\n/i;
								regexResult = regex.exec(data);
								result.fakultas = regexResult[1];
								result.prodi = regexResult[2];
								result.mata_kuliah = regexResult[3];
								result.sks = regexResult[4];
								result.dosen = regexResult[5];
								result.jumlah_peserta = regexResult[6];

								// regex for students
								regex = /\d{3} (\d{8})   (.+)\n/gi;
								var allStudent = [];
								while ((regexResult = regex.exec(data)) !== null) { // iterate to find each student with regex
									var student = {};
									student.nim = regexResult[1];
									student.nama = regexResult[2].trim();
									allStudent.push(student);
								}
								result.peserta = allStudent;

								// static information
								result.semester = semester;
								result.tahun = tahun;
								result.kode = kode;
								result.kelas = kelas;

								res.end(JSON.stringify(result)); //show response
								console.log("Status Code: 200");
								console.log(result);
							});

						});
					}
				}
			});
		}
	});
  }
});

// listening
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('=== Tugas Service Adapter Daftar Peserta Kelas akademik.itb.ac.id ===');
});