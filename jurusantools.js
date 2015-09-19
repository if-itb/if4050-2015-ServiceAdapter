var https = require('https');

module.exports = {
	semester: 1,
	tahun: 2015,
	th_kur: 2013,
	
	jurusanToKode:	function (kode){
		switch(kode){
			case 'MA': return '101';
			case 'FI': return '102';
			case 'AS': return '103';
			case 'KI': return '105';
			
			case 'BM': return '104';
			case 'BI': return '106';
			case 'BA': return '114';
			case 'BW': return '115';
			
			case 'FA': return '107';
			case 'FK': return '116';
			
			case 'TA': return '121';
			case 'TM': return '122';
			case 'TG': return '123';
			case 'MG': return '125';
			
			case 'MR': return '144';
			case 'TK': return '130';
			case 'TF': return '133';
			case 'TI': return '134';
			
			case 'EL': return '132';
			case 'IF': return '135';
			case 'EP': return '180';
			case 'ET': return '181';
			case 'II': return '182';
			
			case 'MS': return '131';
			case 'AE': return '136';
			case 'MT': return '137';
			
			case 'SI': return '150';
			case 'TL': return '153';
			case 'KL': return '155';
			case 'IL': return '157';
			case 'SA': return '158';
			
			case 'AR': return '152';
			case 'PL': return '154';
			
			case 'SR': return '170';
			case 'KR': return '172';
			case 'DI': return '173';
			case 'DK': return '174';
			case 'DP': return '175';
			case 'KU': return '179';
			
			case 'MB': return '190';
			case 'MK': return '192';
		}
	},
	
	httpGetAkademik: function (url, callback){
		console.log('Creating Request To : https://six.akademik.itb.ac.id/publik/' + url);
		https.get('https://six.akademik.itb.ac.id/publik/' + url ,function (res) {
			var str = '';
			
			res.on('data', function (chunk) {
				str += chunk;
			});
			res.on('end', function () {
				callback(str);
			});
			res.on('error', function (e) {
				console.error(e);
			});
		});
	},
	
	getJadwalFromKodeMK: function (kodeMK, kelas, callback){
		var kode = this.jurusanToKode(kodeMK.substring(0, 2));
		var url = 'daftarkelas.php?ps=' + kode + '&semester=' + this.semester + '&tahun=' + this.tahun + '&th_kur=' + this.th_kur;
		var httpGetAkademik = this.httpGetAkademik;
		
		httpGetAkademik(url, function(hasil){
			var arrHasil = hasil.split(kodeMK);
			if (arrHasil.length < 2)
				callback(null);
			else{
				arrHasil = arrHasil[1].split('</ul>');
				var regexURL = /<[\w ]+=\"[\w\.]+\?p=([\w%]+)\" >01<\/a>/i;
				var regexURL = new RegExp("<[\\w ]+=\\\"[\\w\\.]+\\?p=([\\w%]+)\\\" >0?" + kelas + "<\\/a>", "i");
				var hasilRegex = regexURL.exec(arrHasil[0]);
				
				if (hasilRegex == null)
					callback(null);
				else{
					httpGetAkademik('displaydpk.php?p=' + hasilRegex[1], function (dpk){
						var peserta_kelas = [];
						var regexDataKelas = /([\w ]+)\nProgram Studi\t\t: ([\w ]+)\n.+\n\nKode\/Mata Kuliah\t: [\w]+ \/ (.+), (\d) SKS\nNo\. Kelas\/Dosen\t\t: \d\d \/ ([\w ]+)\n[\w\W]+Total Peserta = ([\d]+)\n/i;
						var regexMahasiswa = /\d{3} (\d{8})   (.+)\n/gi;
						
						var hasilRegex = regexDataKelas.exec(dpk);
						
						while( (hasilMahasiswa = regexMahasiswa.exec(dpk)) !== null ){
							var mahasiswa = {};
							mahasiswa.nim  = hasilMahasiswa[1];
							mahasiswa.nama = hasilMahasiswa[2].trim();
							peserta_kelas.push(mahasiswa);
						}
						
						
						var hasilProses = {};
						hasilProses.fakultas = hasilRegex[1];
						hasilProses.prodi = hasilRegex[2];
						hasilProses.mata_kuliah = hasilRegex[3];
						hasilProses.sks = hasilRegex[4];
						hasilProses.dosen = hasilRegex[5];
						hasilProses.jumlah_peserta = hasilRegex[6];
						hasilProses.peserta = peserta_kelas;
						callback(hasilProses);
					});
				}
			}
		});
	}
};