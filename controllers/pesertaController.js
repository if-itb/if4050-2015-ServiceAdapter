/**
 * Created by baharudinafif on 9/19/15.
 */
/*
 * REQUIREMENT
 * */
var request = require('request'),
	cheerio = require('cheerio');

var pesertaController = function () {

	//------- FUNCTION ------//
	var getPeserta = function (req, res) {
		if (req.query.ps != undefined && req.query.kode != undefined && req.query.kelas != undefined) {
			var ps = req.query.ps.toUpperCase();
			var kode = req.query.kode.toUpperCase();
			var kelas = req.query.kelas.toUpperCase();
			// DUMMY DULU PAKE DATA LOCAL
			//var url = "http://127.0.0.1/sample/136.html";
			var url = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=" + ps + "&semester=1&tahun=2015&th_kur=2013";
			console.log(url);
			console.log(kode + " " + kelas)
			getDaftarPeserta(url, kode, kelas, res);
		} else {
			res.status(400);
			res.json({
					task: "Get Daftar Peserta Kelas",
					status: "400",
					error: "Request tidak sesuai format"
				}
			)
		}
	}

	return {
		getPeserta: getPeserta
	}
}
// MODULE EXPORTS
module.exports = pesertaController;

// FUNCTION
function getDaftarPeserta(url, kode, kelas, res) {
	var output = {};
	var rootAddr = "https://six.akademik.itb.ac.id/publik/";
	request(url, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			console.log("berhasil mengakses halaman daftar kelas")
			var elmt = cheerio.load(html);
			kode = kode.toUpperCase();
			var data = "";
			var available = 0;
			elmt('ul').each(function (i, element) {
				var li = elmt(this).parent();
				var liKelas = elmt(this).children();
				var aLink = liKelas.children();
				var liText = li.text();
				var matkul = (liText.split("\n"))[0];
				var linkPesertaKelas = "";
				if (matkul.indexOf(kode) >= 0) {
					for (var i = 0; i < aLink.length; i++) {
						if (aLink[i].children[0].data == kelas) {
							available = 1;
							linkPesertaKelas = rootAddr + aLink[i].attribs.href;
							console.log(matkul)
							console.log(aLink[i].children[0].data)
							console.log(linkPesertaKelas);
							request(linkPesertaKelas, function (err, response, html) {
								if (!err && (response.statusCode == 403 || response.statusCode == 200)) {
									if (response.statusCode == 200) {
										var elmt = cheerio.load(html);
										var data = elmt('pre').text();
										var splitedData = data.split("\n");
										var fakultas = splitedData[0];
										var prodi = splitedData[1].substring(17, splitedData[1].length);
										var semester = splitedData[2].substring(12, 13);
										var tahun = "20" + splitedData[2].substring(14, splitedData[2].length);
										var mata_kuliah = splitedData[4].substring(28, splitedData[4].indexOf(","));
										var sks = splitedData[4].substring(splitedData[4].indexOf(",") + 2, splitedData[4].indexOf(",") + 4)
										var dosen = splitedData[5].substring(24, splitedData[5].length)
										console.log(data);
										data = html.substring(html.indexOf("-----------------------------------------------------------"));
										data = data.split("-----------------------------------------------------------\n");
										data = data[2];
										data = data.split("\n")
										var daftarPeserta = [];
										var jumlah = 0;
										for (var i = 0; i < data.length; i++) {
											var peserta = data[i];
											var nim = peserta.substring(4, 12);
											var nama = peserta.substring(15, peserta.length);
											if (nim != "") {
												peserta = {
													nim: nim,
													nama: nama
												}
												jumlah++;
												daftarPeserta.push(peserta);
											}
										}
										output = {
											"fakultas": fakultas,
											"prodi": prodi,
											"semester": semester,
											"tahun": tahun,
											"kode": kode,
											"mata_kuliah": mata_kuliah,
											"sks": sks,
											"kelas": kelas,
											"dosen": dosen,
											jumlah_peserta: jumlah,
											peserta: daftarPeserta
										}
										res.status(200);
										res.json(output)
									} else {
										output = {
											task: "Get Daftar Peserta Kelas",
											kode: kode,
											kelas: kelas,
											status: "Error",
											message: "Pengaksesan harus dilakukan didalam kampus atau menggunakan VPN"
										}
										res.status(200);
										res.json(output)
									}
								} else {
									output = {
										task: "Get Daftar Peserta Kelas",
										kodeKelas: kode,
										kelas: kelas,
										status: "Error",
										message: "Gagal mengakses halaman daftar peserta kelas dengan kode matakuliah " + kode
									}
									res.status(404);
									res.json(output)
								}
							})
						}
					}
				}
			});
			if (!available) {
				output = {
					task: "Get Daftar Peserta Kelas",
					kode: kode,
					kelas: kelas,
					status: "Error, Mata Kuliah/Kelas Tidak Tersedia",
					message: "Gagal mengakses daftar peserta kelas dengan kode matakuliah " + kode
				}
				res.status(404);
				res.json(output)

			}
		} else {
			console.log(response.statusCode)
			output = {
				task: "Get Daftar Peserta Kelas",
				kode: kode,
				kelas: kelas,
				status: response.statusCode,
				message: "Gagal mengakses halaman daftar kelas"
			}
			res.status(200);
			res.json(output)
		}
	});
}