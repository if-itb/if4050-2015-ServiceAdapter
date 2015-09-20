var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');
var app     = express();

app.get('/', function (req, res) {
    var ps = req.query.ps;
    var kode = req.query.kode;
    var kelas = req.query.kelas;
    
    //create default value of kelas
    if (!kelas) { 
        kelas = "01";
    };
    
    if( !ps || !kode){
       res.status(400).json({
           error: "request tidak sesuai format"
       });
    } else {
        var url = "https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+ps+"&semester=1&tahun=2015&th_kur=2013";
        //request url content
        request(url, function(error, response, html){
            if(!error && response.statusCode==200 ){
                var $ = cheerio.load(html);
                var foundClass = false; //to mark if any Nomor Kelas is match with kelas
                var foundCourse = false; //to mark if any Kode Mata Kuliah is match with kode
                var tempKode;
                var tempKelas;
                var urlDpk;
                var dpk = {};
                var feedback;
                //crawl to find 'li' which is the child of 'ol'
                $('ol > li').each(function(){
                    var data = $(this);
                    tempKode = data.text().substr(0,6); //assign Kode Mata Kuliah from crawled data
                    if (tempKode.toLowerCase() == kode.toLowerCase()){
                        foundCourse = true; //Mata Kuliah found
                        //crawl to find url
                        data.find('a').each(function(){
                            tempKelas = $(this).text(); //temporary Nomor Kelas
                            urlDpk = $(this).attr('href'); //url to the list of class participant (DPK)
                            if(tempKelas == kelas){
                                foundClass = true; //Class found
                                url = "https://six.akademik.itb.ac.id/publik/"+urlDpk;
                                //request DPK url
                                request(url, function(error, response, html){
                                    var $ = cheerio.load(html);
                                    var courseinfo = $("pre").text().split('\n'); //split text content to be more machine-friendly
                                    
                                    //asigning value into relevant variable
                                    dpk.fakultas = courseinfo[0];
                                    dpk.prodi = courseinfo[1].substr(17);
                                    dpk.semester = courseinfo[2].substr(12,1);
                                    dpk.tahun = "20"+courseinfo[2].substr(14);
                                    dpk.kode = courseinfo[4].substr(19,6);
                                    dpk.mata_kuliah = courseinfo[4].substring(28,courseinfo[4].indexOf(','));
                                    dpk.sks = courseinfo[4].substr(courseinfo[4].length-5,1);
                                    dpk.kelas = courseinfo[5].substr(19,2);
                                    dpk.dosen = courseinfo[5].substr(24);
                                    dpk.jumlah_peserta = courseinfo[courseinfo.length-2].substr(16);
                                    dpk.infopeserta = [];
                                    
                                    for (var i = 10 ; i<courseinfo.length-3 ; i++){
                                        var peserta = {};
                                        peserta.nim = courseinfo[i].substr(4,8);
                                        peserta.nama = courseinfo[i].substr(15);
                                        dpk.infopeserta.push(peserta);
                                    }
                                    //parse into JSON
                                    res.type('application/json');
                                    res.status(200).send(JSON.stringify(dpk));
                                });
                            } ;
                            
                        });
                        if (!foundClass) {
                                feedback = "Tidak ditemukan kelas dengan kode "+kode+" nomor kelas "+kelas;
                                res.status(404).json({
                                    error: feedback
                                });
                        };
                    }; 
                });
                if (!foundCourse) {
                        feedback = "Tidak ditemukan kelas dengan kode "+kode+" nomor kelas "+kelas;
                        res.status(404).json({
                            error: feedback
                        });
                };
            } else {
                res.status(500).json({
                    error: "terjadi kesalahan pada server"
                });
            }
        }
   )};  
});
        
app.listen('8081');

console.log('App is listening at port 8081');

exports = module.exports = app;