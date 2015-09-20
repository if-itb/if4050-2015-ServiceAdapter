var https = require('https');
var cheerio = require('cheerio');
var ps = '135';

var options = {
	host: 'six.akademik.itb.ac.id',
	port: 443,
	path: '/publik/daftarkelas.php?ps='+ps+'&semester=1&tahun=2015&th_kur=2013'
};

var html = '';
var links = '';
https.get(options, function(res) {
 
  res.on('data', function(d) {
    //process.stdout.write(d);
    html += d;
  }).on('end', function(d) {
  	 $ = cheerio.load(html);
	 var haha = $('li:contains("IF4041")').html();
	 //var huhu = html.find("informatika");
     $ = cheerio.load(haha);
     var hihi = $('a:contains("01")').attr('href');
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
		     var dpk = $('pre').text();
		     console.log(dpk);
		  });

		}).on('error', function(e) {
		  console.error(e);
		});
  });

}).on('error', function(e) {
  console.error(e);
});

