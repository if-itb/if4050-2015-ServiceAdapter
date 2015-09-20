//Import the necessary modules
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var url = require('url');

//Define a port the server listens to
const PORT=8080; 

//Function which handles requests and send response
function handleRequest(req, response){
	//baca request
    try{
        var kode,kelas,ps;
        if(url.parse(req.url,true).query.kelas)
            kelas = url.parse(req.url,true).query.kelas;
        if(url.parse(req.url,true).query.kode)
            kode = url.parse(req.url,true).query.kode;
        if(url.parse(req.url,true).query.ps)
            ps = url.parse(req.url,true).query.ps;

        if(kelas && kode && ps){
            request('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=' + ps + '&semester=1&tahun=2015&th_kur=2013', function (error, resp, html) {
              if (!error && resp.statusCode == 200) {
                var $ = cheerio.load(html);
                var found = false;
                $('ol').children('li').each(function(i, element){
                    var kode1 = $(this).text().substr(0,6);
                    if (kode1 == kode){
                        $(this).children().children('li').each(function(k, element){
                            var kelas1 = $(this).text().substr(8,2);
                            if (kelas1 == kelas){
                                found = true;
                                var link = $(this).children('a').eq(0).attr('href');
                                request('https://six.akademik.itb.ac.id/publik/' + link, function (error, resp1, html1) {
                                    if (!error && resp1.statusCode == 200) {
                                        var $$ = cheerio.load(html1);
                                        var rawdata = $$('pre').text().split('\n');
                                        var json = {};
                                        json.fakultas = rawdata[0];
                                        json.prodi = rawdata[1].substr(17);
                                        json.semester = rawdata[2].substr(12,1);
                                        json.tahun = rawdata[2].substr(14)*1+2000;
                                        json.kode = kode;
                                        json.mata_kuliah = rawdata[4].substr(28).split(',')[0];
                                        json.sks = rawdata[4].substr(28).split(',')[1].split(' ')[1];
                                        json.kelas = kelas;
                                        json.dosen = rawdata[5].substr(24);
                                        json.jumlah_peserta = rawdata[rawdata.length-2].substr(16);
                                        json.peserta = [];
                                        for (var j=10; j<rawdata.length-3; j++){
                                            json.peserta.push({
                                                "nim" : rawdata[j].substr(4,6),
                                                "nama" : rawdata[j].substr(15).trim()
                                            });
                                        }

                                        response.writeHead(200, {'Content-Type':'application/json'});
                                        response.end(JSON.stringify(json));
                                    }		  						
                                });

                            } 
                        })
                    }
                });
                if (!found){
                    response.writeHead(404, {'Content-Type':'application/json'});
                    response.end('{"error":"Tidak ditemukan kelas K' + kelas + ' dengan kode ' + kode +'"}');
                }
              }
            });
        } else {
            response.writeHead(400, {'Content-Type':'application/json'});
            response.end('{"error":"Request tidak sesuai format"}');
        }
    } catch (error){
            response.writeHead(500, {'Content-Type':'application/json'});
            response.end('{"error":"Terjadi kesalahan pada server"}');
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Start the server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
