var http = require("http");
var https = require("https");
var express = require("express");
var app = express();
var fs = require("fs");
//Utility functin that downloads a URL and invokes
// callback with the data.



function download(url, callback) {
	https.get(url, function(res){
		var data ='';
		res.on('data', function (chunk){
			data += chunk;
		});
		res.on("end", function(){
			callback(data);
		})
	}).on("error", function(){
		callback(null);
	})
}


app.get('/', function(req,res){
  var url = "https://six.akademik.itb.ac.id/publik/displayprodikelas.php?semester=1&tahun=2015&th_kur=2013"
  var cheerio = require("cheerio");
  if((req.query['ps'] != null) && (req.query['kode'] != null) && (req.query['kelas'] != null)){
     download(url, function(data) {
      if (data) {
        var $ = cheerio.load(data);
        $("li").each(function(i, e) {
          var link_jurusan = $(e).find("a");
          var jurusan = link_jurusan.html(); //variabel sementara u/ nyimpen judul
          if(jurusan.indexOf(req.query['ps']) > -1){ //prodi 101s
            var newURL = "https://six.akademik.itb.ac.id/publik/"+link_jurusan.attr("href");
            download(newURL, function(data){
              if (data) {
                var $$ = cheerio.load(data);
                $$("ul").each(function(i,f){ //iterasi per tag <ul>, tag <ul> mengandung mata kuliah
                  var link_kodekul = $$(f).parent(); //masuk ke tag ul dan get element parent dari <ul>
                  var kodekul = link_kodekul.text(); //tempat menampung text dari link1
                  if(kodekul.indexOf(req.query['kode']) > -1){ //matkul MA1101
                      var $$$ = cheerio.load(link_kodekul.html()); //mengambil text html dari matkul yang terkait
                      $$$("li").each(function(i,e){ //iterasi setiap <li> dalam html link1
                        var link_kelas = $$$(e).find("a");
                        var kelas = link_kelas.html();
                        if(kelas.indexOf(req.query['kelas']) > -1){ //kelas 01
                          var reqURL = "https://six.akademik.itb.ac.id/publik/"+link_kelas.attr("href");
                          download(reqURL, function(data){
                            if (data){
                              var hasil = data.split("\n");
                              var json = {};
                              json["Fakultas"] = hasil[0].replace("<pre>","");
                              json["Program_Studi"] = hasil[1].substring(hasil[1].indexOf(":")+2);
                              json["Semester"] = hasil[2].substring(hasil[2].indexOf(":")+2);
                              json["Kode"] = hasil[4].substring(hasil[4].indexOf(":")+2, hasil[4].lastIndexOf("/")-1);
                              json["Mata_Kuliah"] = hasil[4].substring(hasil[4].lastIndexOf("/")+2, hasil[4].indexOf(",")-1 );
                              json["SKS"] = hasil[4].substring(hasil[4].lastIndexOf(",")+2);
                              json["Kelas"] = hasil[5].substring(hasil[5].indexOf(":")+2, hasil[5].lastIndexOf("/")-1 );
                              json["Dosen"] = hasil[5].substring(hasil[5].lastIndexOf("/")+2);
                              json["Peserta"] = []
                              var mhs ={};
                              for(var i = 10; i < hasil.length -4;i++){
                                hasil[i] = hasil[i].trim();
                                //json["Peserta"].push(mhs["No"] = hasil[i].substr(0,3) ); 
                                json["Peserta"].push(mhs["NIM"] = hasil[i].substr(4,8) );
                                json["Peserta"].push(mhs["Nama"] = hasil[i].substr(15));
                              }
                              res.send(json);
                            }
                          })
                        }
                      })
                  }
                })
              }
            })
          }
        });
      }
    });
  }else{
    var message = {};
    message.error = "Request tidak sesuai format";
    res.send(message);
  }
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

})