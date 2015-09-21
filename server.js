// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var jsdom = require('jsdom');
var jquery = require('jquery');
var https = require('https');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
/* router.get('/retrieve', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
}); */

jsdom.env('<html></html', function(error, window) {
	if(error) {
		console.log("Error while creating jsdom window" + error);
	}
	else {
		$ = jquery(window);
		$.support.cors = true;
	}
});

// var options = {
// 	host: 'six.akademik.itb.ac.id',
// 	port: 443,
// 	path: '/publik/daftarkelas.php?ps=135&semester=1&tahun=2015&th_kur=2013'
// };

var html = '';
router.route('')
/*	.post(function(req, res) {

		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err) {
			if(err) 
				res.send(err);
			
			res.json({message: 'Bear created !'});

		}); */

	.get(function(req, res) {

	var prodi = req.query.ps;
	var kode = req.query.kode;
	var kelas = req.query.kls;
	var valid = true;
	var exist = true;
	
	if((prodi==undefined) || (kode==undefined) || (kelas==undefined)) {
		//console.log("not valid");
		valid = false;
	}

	function getDPKPath(link, kode, kelas, callback) {
		var request = require("request"),
			cheerio = require("cheerio"),
			url = link;
		

		request(url, function (error, response, body) {
			var kode_found = false;
			var kls_found = false;
			var huba = '';
			if (!error) {
				var $ = cheerio.load(body),
				links = $("li");
				links.each(function() {
						if($(this).text().substring(0,6)==kode) {
							kode_found = true;
							$(this).find('li').each(function() {
								if($(this).text().substring(8,10)==kelas) {
									huba = $(this).find('a').attr('href');
									kls_found = true;
								}
							});
						}
					});
				if(!kode_found || !kls_found) {
					if(!valid) {
						huba = "Request tidak sesuai format"
					}
					else {
						huba = "Tidak ditemukan kelas "+kelas+" untuk mata mata kuliah "+kode+" dengan kode prodi "+prodi;
						exist = false;
					}
					callback(huba);
				}
				else {
					callback(huba);
				}
									
			} else {
				console.log("We’ve encountered an error: " + error);
			}
		});
	}

	function getDPK(link, kode, kelas, callback) {
		
		getDPKPath(link, kode, kelas, function(huba) {
		if(huba.substring(0,15)=="Tidak ditemukan") {
			var json_obj = {};
			json_obj["error"] = huba;
			callback(json_obj);
		}
		else if(huba.substring(0,7)=="Request") {
			var json_obj = {};
			json_obj["error"] = huba;
			callback(json_obj);
		}
		else {	
			var request = require("request"),
			cheerio = require("cheerio"),
			url = "https://six.akademik.itb.ac.id/publik/"+ huba;
			request(url, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body),
					links = $("pre").html().split("\n");

					var json_obj = {};
					var my_regex = /(\w+) \/ (.+), (\d+) SKS/g;
					var my_regex2 = /: (.+)/g;
					var my_regex3 = /:(.+)\/(\d+)/g
					var my_regex4 = /: (\d+) \/ (.+)/g
					var my_regex5 = /= (\d+)/g
					var my_regex6 = /\s+$/

					//links.replace("&amp", "");
					var prodi = my_regex2.exec(links[1]);
					var indeks = my_regex.exec(links[4]);
					var smt = my_regex3.exec(links[2]);
					var kls = my_regex4.exec(links[5]);
					var siswa = my_regex5.exec(links[links.length-2]);

					json_obj["fakultas"] = links[0];
					json_obj["prodi"] = prodi[1];
					json_obj["semester"] = smt[1].replace(" ", "");
					json_obj["tahun"] = "20"+smt[2];
					json_obj["kode"] = indeks[1];
					json_obj["mata_kuliah"] = indeks[2].replace("&amp;", "");
					json_obj["sks"] = indeks[3];
					json_obj["kelas"] = kls[1];
					json_obj["dosen"] = kls[2];
					json_obj["jumlah_peserta"] = siswa[1];

					var mhs = []
					for(var i=10; i<links.length-3; i++) {
						var temp = {};
						temp["nim"] = links[i].substring(4,12);
						temp["nama"] = links[i].substring(15).replace(my_regex6, "");
						mhs.push(temp);
					}
					json_obj["peserta"] = mhs;
					callback(json_obj);
					//console.log(json_obj);
				} else {
					console.log("We’ve encountered an error: " + error);
					// json_obj["message"] = error;
					// callback(json_obj);
				}
			});
		}
		})		
	}

	getDPK("https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+prodi+"&semester=1&tahun=2015&th_kur=2013", kode, kelas, function(json_obj) {
		if(json_obj != null) {
			if(!valid) {
				res.statusCode = 400;	
			}
			else if(!exist){
				res.statusCode = 404;
			}
			else {
				res.statusCode = 200;
			}
			res.setHeader("Content-Type", "application/json");
			res.send(json_obj);
		}
		else {
			//res.json(err);
		}
	});

		//res.json({message: 'Data retrieval success'});
	});

router.route('/info')
	.get(function(req, res) {
		res.json({message: 'Data retrievel cancelled'});
	});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);