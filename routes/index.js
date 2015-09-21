var express = require('express');
var jsdom = require('jsdom');
var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var ps = req.query.ps;
	var kode = req.query.kode;
	var kelas = req.query.kelas;
    if (req.query.ps==null||req.query.ps==""||req.query.kode==null||req.query.kode==""||req.query.kelas==null||req.query.kelas=="") {
        console.log("error format");
        res.status(400).json({
            "error": "Request tidak sesuai format"
        });
        return;
    }
	console.log("ps = "+ps+", kode = "+kode+", kelas = "+kelas);
	request({
		uri: 'https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='+ps+'&semester=1&tahun=2015&th_kur=2013'
	}, function(err, response, body) {
		if(err) {
            console.log("error server");
        	res.status(500).json({
                "error": "Terjadi kesalahan pada server"
            });
        }
        jsdom.env({
        	html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
            done: function(err, window){
                var $ = cheerio.load(body);
                if ($('title:contains("Internal ITB only")')) {
                    console.log("error server");
                    res.status(500).json({
                        "error": "Terjadi kesalahan pada server"
                    });
                    return;
                }
                var URLkelas = $('li:contains('+kode+')').find('li:contains('+kelas+')').find('a').attr('href');
                if (URLkelas==null) {
                    console.log("error not found");
                    res.status(404).json({
                        "error": "Tidak ditemukan kelas nomor "+kelas+" dengan kode prodi "+ps+" dan kode kuliah "+kode
                    });
                    return;
                }
                else {
                    console.log('https://six.akademik.itb.ac.id/publik/'+URLkelas);
                    request({
                        uri: 'https://six.akademik.itb.ac.id/publik/'+URLkelas
                    }, function(err, response, body){
                        if(err && response.statusCode !== 200) {
                            console.log("error server");
                            res.status(500).json({
                                "error": "Terjadi kesalahan pada server"
                            });
                        }
                        jsdom.env({
                            html: body,
                            scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
                            done: function(err, window){
                                var $ = cheerio.load(body);
                                var data = $('pre').text().split("\n");
                                var totalpeserta = $('pre').text().split(" = ");
                                var output = {};
                                output.fakultas = data[0];
                                var prodi = data[1].split(": ");
                                output.prodi = prodi[1];
                                var semester = data[2].split(": ");
                                output.semester = semester[1].substring(0,1);
                                output.tahun = "2015";
                                output.kode = kode;
                                var matkul = data[4].split(" / ");
                                output.mata_kuliah = matkul[1].substring(0,matkul[1].indexOf(","));
                                output.sks = matkul[1].substring(matkul[1].indexOf(",")+2,matkul[1].indexOf("SKS")-1);
                                output.kelas = kelas;
                                var dosen = data[5].split(" / ");
                                output.dosen = dosen[1];
                                output.jumlah_peserta = totalpeserta[1].substring(0,totalpeserta[1].indexOf("\n"));
                                output.peserta = [];
                                for (var i = 0; i<output.jumlah_peserta; i++) {
                                    var peserta = {};
                                    peserta.nim = data[i+10].substring(4,12);
                                    peserta.nama = data[i+10].substring(15);
                                    output.peserta.push(peserta);
                                }
                                res.status(200).json(output);
                            }
                        });
                    });
                }
            }
        });
    });
});

module.exports = router;
