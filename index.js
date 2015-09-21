/**
 * IF4050 Service Adapter
 * Nama : Fahziar Riesad Wutono
 * NIM : 13512012
 * Github Id : fahziar
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

//Base URL untuk mencari dpk
var BASE_URL = "https://six.akademik.itb.ac.id/publik/";

var app = express();

/**
 * Mengambil daftar DPK kemudian mengirimkan respon berisi daftar peserta kelas. Mengirimkan response error
 * jika terjadi kesalahan atau kelas tidak ditemukan.
 * @param ps kode program studi
 * @param kode kode mata kuliah
 * @param kelas nomor kelas
 * @param res Expresss response
 */
function getDPK(ps, kode, kelas, res){
    findClass(ps, 1, 2015, 2013, kode, kelas, function (url) {
        parseDPK(url, function (result) {
            res.send(result);
        }, function (status, error) {
            res.status(status);
            res.send({error: error});
        })
    }, function (status, error) {
        res.status(status);
        res.send({error: error});
    });
}

/**
 * Mencari url dpk dari sebuahh kelas
 * @param ps kode program studi
 * @param semester semester
 * @param tahun tahun ajaran
 * @param kur tahun kurikulum
 * @param kodeMk kode mata kuliah
 * @param kelas nomor kelas
 * @param successCb Fungsi callback jika sukses mencari url. Bentuk fungsi callback: successCb(url)
 * @param errorCb Fungsi callback jika gagal mencari url. Bentuk fungsi callback: errorCb(status, pesanError)
 */
function findClass(ps, semester, tahun, kur, kodeMk, kelas, successCb, errorCb){
    var url= BASE_URL + "daftarkelas.php?ps=" + ps + "&semester=" + semester +
    "&tahun=" + tahun + "&th_kur=" + kur;

    //Perbaiki format kelas
    kelas = kelas + "";
    if (kelas.length == 1){
        kelas = '0' + kelas;
    }
    request(url, function(error, response, html){
        if (!error){
            var out;
            var $ = cheerio.load(html);

            //cek apakah elemen ol ada
            if ($('ol').length == 0){
                errorCb(404, "Tidak ditemukan kelas dengan kode " + kodeMk);
            } else {
                $('ol').each(function (i, element) {

                    //Cek apakah kode mata kuliah ditemukan
                    if ($(this).text().indexOf(kodeMk) == -1) {
                        errorCb(404, "Tidak ditemukan kelas dengan kode " + kodeMk);
                    } else {

                        $(this).children('li').each(function (i, element) {

                            if ($(this).text().substr(0, 6) == kodeMk) {
                                //Cek apakah kelas ditemukan
                                if ($(this).text().indexOf(kelas) == -1) {
                                    errorCb(404, "Tidak ditemukan kelas dengan kode " + kodeMk);
                                } else {
                                    $(this).find('li').each(function (i, element) {

                                        var currKelas = $(this).text().substr(8, 2);
                                        if (currKelas == kelas) {
                                            out = BASE_URL + $(this).children('a').attr('href');
                                            successCb(out);
                                            return false;
                                        }
                                    });
                                }
                            }
                        })
                    }
                });
            }
        } else {
            errorCb(500, "Terjadi kesalahan pada server");
        }
    });
}

/**
 * Mengubah DPK ke dalam bentuk JSON
 * @param url url DPK
 * @param successCb Fungsi callback jika sukses. Parameter fungsi: successCb(json)
 * @param errorCb Fungsi callback jika error. Paramter fungsi: errorCb(status, error)
 */
function parseDPK(url, successCb, errorCb){
    request(url, function (error, response, html) {
        var out;

        if (!error) {
            out = {};
            var $ = cheerio.load(html);
            var lines = $('pre').text().split('\n');
            out.fakultas = lines[0];
            out.prodi = lines[1].substr(17);
            out.semester = lines[2].substr(12, 1);
            out.tahun = parseInt(lines[2].substr(14)) + 2000;
            out.kode = lines[4].substr(19, 6);
            out.mata_kuliah = lines[4].substr(28).split(',')[0];
            out.sks = lines[4].substr(28).split(',')[1].split(' ')[1];
            out.kelas = lines[5].substr(19).split(' ')[0];
            out.dosen = lines[5].substr(19).split('/')[1].substr(1);
            out.jumlah_peserta = lines[lines.length - 2].split('=')[1].substr(1);

            var i;
            out.peserta = [];
            for (i = 10; i< lines.length - 3; i++){
                var peserta = {};
                peserta.nim = lines[i].substr(4, 8);
                peserta.nama = lines[i].substr(15).trim();
                out.peserta.push(peserta);
            }

            successCb(out);
        } else {
            errorCb(500, "Terjadi kesalahan pada server");
        }


    });
}

/**
 * Mengecek apakah parameter masukan benar
 * @param ps parameter kode program studi
 * @param kode parameter kode mata kuliah
 * @param kelas parameter nomor kelas
 * @returns {boolean} true jika benar, false jika salah
 */
function cekParameter(ps, kode, kelas){
    //Cek apakah ada paramter kosong
    if ((typeof ps == "undefined") || (typeof kode == 'undefined') || (typeof kelas == 'undefined')){
        return false;
    }

    if (ps.length != 3){
        return false;
    }

    if (kode.length != 6){
        return false;
    }

    if (!(!isNaN(kelas) &&
        parseInt(Number(kelas)) == kelas &&
        !isNaN(parseInt(kelas, 10)))){
        return false;
    }

    return true;
}

//Router
app.get('/', function (req, res) {
    if (cekParameter(req.param('ps'), req.param('kode'), req.param('kelas'))){
        getDPK(req.param('ps'), req.param('kode'), req.param('kelas'), res);
    } else {
        res.status(400);
        res.send({error: "Request tidak sesuai format"});
    }
});

//Start server
app.listen('80');

console.log("Service running at port 80");