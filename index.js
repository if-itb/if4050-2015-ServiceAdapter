var express = require('express');
var App = express();
var HTTPS = require('https');
var Cheerio = require("cheerio");


//Handler functions
var apiHandler = function (req, res) {
  getKelasListPage(req, res, getDpkPage)
};

//Helper functions
var sendJsonResponse = function(req, res, dpk_page_body, cb) {
  var html = dpk_page_body;
  var $ = Cheerio.load(html);
  var dpkString = $('pre').html();

  var re_infos = /\s*([^\n\r]*)\nProgram Studi\s*: \s*([^\n\r]*)\nSemester\s*:\s*([0-9])\/([^\n\r]{2})\n*Kode\/Mata Kuliah\s*:\s*([^\n\r]{6}) \/ \s*([^\n\r]*),\s*([0-9])\s*\S*\nNo\. Kelas\/Dosen\s*:\s*([^\n\r]{2})\s\/\s([^\n\r]*)[\s\S\n]*Total Peserta = ([0-9]{2})/;
  var re_pesertas = /([0-9]{3})\s*([0-9]{8})\s*([^\n\r]*)/g;

  var infos = re_infos.exec(dpkString);
  if(!infos){
    res.status(404).json({"error": "Kelas tidak ditemukan"});
    return;
  }

  var peserta = re_pesertas.exec(dpkString);
  var arrPeserta = [];
  while (peserta != null) {
      // console.log(peserta[1]);
      arrPeserta.push({
        "nim": peserta[2],
        "nama": peserta[3].trim()
      });
      peserta = re_pesertas.exec(dpkString);
  }

  var jsonObj = {
    Content: {
      "fakultas": infos[1],
      "prodi": infos[2],
      "semester":infos[3],
      "tahun": '20'+infos[4],
      "kode": infos[5],
      "mata_kuliah": infos[6],
      "sks": infos[7],
      "kelas": infos[8],
      "dosen": infos[9],
      "jumlah_peserta": infos[10],
      "peserta": arrPeserta
    }
  };

  res.json(jsonObj);
}

var getDpkPage = function(req, res, kelas_list_page_body, cb) {
  var kode;
  if(req.query.kode){
    kode = req.query.kode;
  }else{
      
    return;
    // kode = 'IF2110';
  }

  var html = kelas_list_page_body;
  var $ = Cheerio.load(html);
  var liMatkul = $('li:contains("'+kode+'")');

  var kelas;
  if(req.query.kelas){
    kelas = req.query.kelas;
  }else{
    res.status(400).json({"error": "Request tidak sesuai format"});
    return;
    // kelas = '01'
  }
  
  var liKelas = liMatkul.find('li:contains("'+kelas+'")');

  var dpkPath = liKelas.find('a').attr('href');

  var reqUrl = 'https://six.akademik.itb.ac.id/publik/'+dpkPath;
  HTTPS.get(reqUrl, function(httpRes) {
    console.log("Got response: " + httpRes.statusCode);

    var httpResBody = '';
    httpRes.on('data', function(chunk) {
      httpResBody += chunk;
    });
    httpRes.on('end', function() {
      cb(req, res, httpResBody)
    });
  }).on('error', function(e) {
    res.status(500).json({"error": "Terjadi kesalahan pada server"});
  });

  // res.send(liKelas.html());
};

var getKelasListPage = function(req, res, cb) {
  var ps;
  if(req.query.ps){
    ps = req.query.ps;
  }else{
    res.status(400).json({"error": "Request tidak sesuai format"});
    return;
    // ps = '135';
  }

  var reqUrl = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+ps+"&semester=1&tahun=2015&th_kur=2013";
  HTTPS.get(reqUrl, function(httpRes) {
    console.log("Got response: " + httpRes.statusCode);

    var httpResBody = '';
    httpRes.on('data', function(chunk) {
      httpResBody += chunk;
    });
    httpRes.on('end', function() {
      cb(req, res, httpResBody, sendJsonResponse)
      // res.send(httpResBody);
    });

  }).on('error', function(e) {
    res.status(500).json({"error": "Terjadi kesalahan pada server"});
  });

};

//Router
App.get('/api', apiHandler);



//Main
var server = App.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port; 

  var welcomeMessage = "\n";
  welcomeMessage += " '########  '########  '##   '## \n";
  welcomeMessage += "  ##     ##  ##     ##  ##  '##  \n";
  welcomeMessage += "  ##     ##  ##     ##  ## '##   \n";
  welcomeMessage += "  ##     ##  ########   #####    \n";
  welcomeMessage += "  ##     ##  ##         ##  ##   \n";
  welcomeMessage += "  ##     ##  ##         ##   ##  \n";
  welcomeMessage += "  ########   ##         ##    ## \n";
  welcomeMessage += "                                 \n";
  welcomeMessage += " '######## '#### '##    ## '########  '######## '########  \n";
  welcomeMessage += "  ##         ##   ###   ##  ##     ##  ##        ##     ## \n";
  welcomeMessage += "  ##         ##   ####  ##  ##     ##  ##        ##     ## \n";
  welcomeMessage += "  ######     ##   ## ## ##  ##     ##  ######    ########  \n";
  welcomeMessage += "  ##         ##   ##  ####  ##     ##  ##        ##   ##   \n";
  welcomeMessage += "  ##         ##   ##   ###  ##     ##  ##        ##    ##  \n";
  welcomeMessage += "  ##       '####  ##    ##  ########   ########  ##     ## \n";
  
  console.log(welcomeMessage);
  console.log('By Tirta Wening Rachman - 13512004');
  console.log('listening at port '+ port);
});

