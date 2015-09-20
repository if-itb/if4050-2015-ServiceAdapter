//Lets require/import the HTTP module
var http = require('http');
//var request = require("request");
var cheerio = require("cheerio");
var api = require("express");


//Lets define a port we want to listen to
const PORT=8080; 


  

//We need a function which handles requests and send response
function handleRequest(request, response){
	var Matkul = decodeURIComponent((new RegExp('[?|&]' + 'mk' + '=' + '([^&;]+?)(&|#|;|$)').exec(request.url)||[,""])[1].replace(/\+/g, '%20'))||null
	var Kelas = decodeURIComponent((new RegExp('[?|&]' + 'kelas' + '=' + '([^&;]+?)(&|#|;|$)').exec(request.url)||[,""])[1].replace(/\+/g, '%20'))||null
	var Prodi = decodeURIComponent((new RegExp('[?|&]' + 'ps' + '=' + '([^&;]+?)(&|#|;|$)').exec(request.url)||[,""])[1].replace(/\+/g, '%20'))||null
	
	if (Matkul === null || Kelas === null || Prodi === null)
		response.end('Parameter Tidak Lengkap');
	else {
		var https = require('https');
		var cheerio = require('cheerio');

		var options = {
			host: 'six.akademik.itb.ac.id',
			port: 443,
			path: '/publik/daftarkelas.php?ps='+Prodi+'&semester=1&tahun=2015&th_kur=2013'
		};

		var html = '';
		var links = '';
		https.get(options, function(res) {
		 
		  res.on('data', function(d) {
		    //process.stdout.write(d);
		    html += d;
		  }).on('end', function(d) {
		  	 $ = cheerio.load(html);
			 var haha = $('li:contains("'+Matkul+'")').html();
			 //var huhu = html.find("informatika");
		     $ = cheerio.load(haha);
		     var hihi = $('a:contains("'+Kelas+'")').attr('href');
		     var options2 = {
				host: 'six.akademik.itb.ac.id',
				port: 443,
				path: '/publik/'+hihi
			};
				https.get(options2, function(resp) { 
				  resp.on('data', function(dat) {
				    //process.stdout.write(d);
				    links += dat;
				  }).on('end', function(dat){
				  	 $ = cheerio.load(links);				
				     var dpk = $('pre').html().split("\n");
				     var data = {};
				     response.end(dpk[0] + "\n" + dpk[1] + "\n" + dpk[2] + "\n" +dpk[3] + "\n" + dpk[4] + "\n");
				  });
				  
				}).on('error', function(e) {
				  console.error(e);
				});
		  });

		}).on('error', function(e) {
		  console.error(e);
		});
		//response.end('It Works!! Path Hit: ' + request.url +" ==> "+  + " " + Matkul + " " + Kelas);
	}
}



//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
   // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});