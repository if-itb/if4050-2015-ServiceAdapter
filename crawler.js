var htmlparser = require("htmlparser2");
var https = require('https');

//Web server

var http = require('http');
var dispatcher = require('httpdispatcher');

const PORT = 8880;

function handleRequest(request, response){
	try {
		console.log("client is accessing: " + request.url);
		//Dispatch
		dispatcher.dispatch(request,response);
	} catch(err) {
		console.log(err);
	}
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server is starting on http://localhost:%s",PORT);
});


//Dispatcher
dispatcher.setStatic('resources');

//GET request    
dispatcher.onGet("/", function(req, res) {
	var indexer = [];
	var result = {};
	var found = false;

    if(req.params.ps)
    	level2("daftarkelas.php?ps=" + req.params.ps + "&semester=1&tahun=2015&th_kur=2013",req.params.kode, req.params.kelas,res,false,0);
    else if(req.params.kelas && req.params.kode)
    	level1(req.params.kode, req.params.kelas,res);
    else{
    	res.writeHead(400, {'Content-Type': 'application/json'});
    	res.end('{"error":"Request tidak sesuai format"}');
    }


//crawler

function level1(kode,kelas,resp){
	https.get('https://six.akademik.itb.ac.id/publik/displayprodikelas.php?semester=1&tahun=2015&th_kur=2013',function(res){
		var rawHtml = "";

		res.on('data',function(d){
			rawHtml = rawHtml + d.toString();
		});

		res.on('end', function(){
			var handler = new htmlparser.DomHandler(function (error, dom) {
		        lv1Dom = dom[0].children[1].children;

		        for(var i = 0; i < lv1Dom.length; i++){
		        	if(lv1Dom[i].type == 'tag'){
		        		if(lv1Dom[i].name == 'ul'){
		        			lv2Dom = lv1Dom[i].children;
		        			for(var j = 0; j < lv2Dom.length; j++){
		        				if(lv2Dom[j].type == 'tag'){
		        					console.log("Parsing: " + lv2Dom[j].children[0].children[0].data);
		        					indexer.push(lv2Dom[j].children[0].attribs.href);
		        				}
		        			}
		        		}
		        	}
		        }

		        level2(indexer[0],kode,kelas,resp,true,0);
			});

			var parser = new htmlparser.Parser(handler);
			parser.write(rawHtml);
			parser.done();
		});
	});
}

function level2(href,kode,kelas,resp,req,ind){
	https.get('https://six.akademik.itb.ac.id/publik/' + href,function(res){
		var rawHtml = "";
		res.on('data',function(d){
			rawHtml = rawHtml + d.toString();
		});

		res.on('end', function(){
			var handler = new htmlparser.DomHandler(function (error, dom) {
		        lv1Dom = dom[0].children[1].children;
		        for(var i = 0; i < lv1Dom.length; i++){
		        	if(lv1Dom[i].type == 'tag'){
		        		if(lv1Dom[i].name == 'ol'){
		        			lv2Dom = lv1Dom[i].children;
		        			for(var j = 0; j < lv2Dom.length; j++){
		        				if(lv2Dom[j].type == 'tag'){
		        					console.log("Parsing: " + lv2Dom[j].children[0].data.substr(0,6));
		        					lv3Dom = lv2Dom[j].children[1].children;
		        					for(var k = 0; k < lv3Dom.length; k++){
		        						if(lv3Dom[k].type == 'tag'){
		        							nomorKelas = lv3Dom[k].children[1].children[0].data;
		        							hrefKelas = lv3Dom[k].children[1].attribs.href;

		        							if(lv2Dom[j].children[0].data.substr(0,6) == kode && nomorKelas == kelas){
		        								found = true;
		        								level3(hrefKelas,kode,kelas,resp);
		        								return;
		        							}
		        						}
		        					}
		        					result.error = "Tidak ditemukan kelas dengan kode " + kode;
		        				}
		        			}
		        		}
		        	}
		        }
			});

			var parser = new htmlparser.Parser(handler);
			parser.write(rawHtml);
			parser.done();
			if(!found){
				if(req && ind < indexer.length)
					level2(indexer[ind+1],kode,kelas,resp,req,ind+1);
				else {
					resp.writeHead(404, {'Content-Type': 'application/json'});
					resp.end(JSON.stringify(result));
				}
			}
		});
	});
}

function level3(href,kode,kelas,resp){
	https.get('https://six.akademik.itb.ac.id/publik/' + href,function(res){
		var rawHtml = "";
		res.on('data',function(d){
			rawHtml = rawHtml + d.toString();
		});

		res.on('end', function(){
			var handler = new htmlparser.DomHandler(function (error, dom) {
				var hasil = dom[0].children[0].data.split('\n');
				delete result.error;
				result.fakultas = hasil[0];
				result.prodi = hasil[1].substr(17);
				result.semester = hasil[2].substr(12).split('/')[0];
				result.tahun = hasil[2].substr(12).split('/')[1]*1+2000;
				result.kodeMK = kode;
				result.mata_kuliah = hasil[4].substr(28).split(',')[0];
				result.sks = hasil[4].split(',')[1].split(' ')[1];
				result.kelas = kelas;
				result.dosen = hasil[5].substr(24);
				result.jumlah_peserta = hasil.length - 13;
				result.peserta = [];
				for(var i = 10; i < hasil.length-3; i++){
					result.peserta.push({
						"nim" : hasil[i].substr(4,8),
						"nama" : hasil[i].substr(15).trim()
					})
				}

				resp.writeHead(200, {'Content-Type': 'application/json'});
				resp.end(JSON.stringify(result));
			});

			var parser = new htmlparser.Parser(handler);
			parser.write(rawHtml);
			parser.done();
		});
	});
}

});    