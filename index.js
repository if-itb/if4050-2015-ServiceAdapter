var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var six = express();

six.set('port', (process.env.PORT || 5000));

six.use(express.static(__dirname + '/public'));

six.set('views', __dirname + '/views');
six.set('view engine', 'ejs');

six.get('/', function(req, res){
	kodematkul = req.query.kode;	
	prodi = req.query.ps;
	kelas = req.query.kelas;

	url = 'https://six.akademik.itb.ac.id/publik/'
	urlkelas = 'daftarkelas.php?ps='+prodi+'&semester=1&tahun=2015&th_kur=2013'

	request (url+urlkelas,function(error, response, html){
		if (!error && response.statusCode == 200) {
			//masuk ke halaman untuk memilih program studi
			var $ = cheerio.load(html)				
			var text = '';

			$('ol').children('li').each(function(index){
				var text = $(this).contents().filter(function(){
					return this.nodeType==3;
				})[0].nodeValue;


				if(text.substr(0, text.indexOf(" ")).toLowerCase() === kodematkul.toLowerCase()){
					urlkelas = $(this).find('ul > li:nth-child('+kelas.substr(1,1)+') > a').attr('href');

					request(url+urlkelas, function(error, response, html){
						//masuk ke halaman untuk memilih kelas
						var $ = cheerio.load(html)	;
						text = $('pre').text();

						metadata_regex = /(.*?)\n(?:Program Studi\s\s:\s)(.*)\n(?:Semester\s\s:\s)(.{1})(?:\/)(.*)\n\n(?:Kode\/Mata Kuliah\s:\s)(.{6})(?:\s\/\s)(.*)(?:,)(\s.)(?:\sSKS)\n(?:No\.\sKelas\/Dosen\s\s:\s)(.{2})(?:\s\/\s)(.*)\n\n(?:-----------------------------------------------------------)\n(?:No\.   NIM         NAMA)\n(?:-----------------------------------------------------------)\n(?:.\n*)*\n(?:-----------------------------------------------------------)\n(?:Total\sPeserta\s=\s)(.{2})/g;
            			nim_regex = /([\d]{8})   (.*)/g;

            			var result = metadata_regex.exec(text);

            			var infoMatkul = {};

            			//retrieve informasi di header
            			infoMatkul['fakultas'] = result[1];
            			infoMatkul['prodi'] = result[2];
            			infoMatkul['semester'] = result[3];
            			infoMatkul['tahun'] = result[4];
            			infoMatkul['kode'] = result[5];
            			infoMatkul['matakuliah'] = result[6];
            			infoMatkul['sks'] = result[7];
            			infoMatkul['kelas'] = result[8];
            			infoMatkul['dosen'] = result[9];
            			infoMatkul['jumlahpeserta'] = result[10];
            			infoMatkul['peserta'] = [];

            			//retrieve informasi nama dan nim
            			do {
            				match = nim_regex.exec(text);
            				if (match){
            					infoMatkul['peserta'].push({
            						nim:match[1],
            						nama:match[2].trim()
            					});
            				}
            			}
            			while(match);
            			res.send(infoMatkul);
					})
				}
			})
		}
		else if(!error && response.statusCode==404){
			res.status(404).send("Mata kuliah"+kodematkul+"tidak ditemukan");
		}
		else if(response.statusCode==500){
			res.status(500).send("Server error");
		}
	})
});

six.listen(six.get('port'), function() {
  console.log('Node app is running on port', six.get('port'));
});
