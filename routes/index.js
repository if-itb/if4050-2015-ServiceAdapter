var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var ps = req.query.ps;
	var kode = req.query.kode;
	var kelas = req.query.kelas;
	console.log("ps = " + ps + ", kode = " + kode + ", kelas = " + kelas);
	request({
		uri: 'https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='+ps+'&semester=1&tahun=2015&th_kur=2013'
	}, function(err, response, body) {
		var self = this;
        self.items = new Array();
        if(err && response.statusCode !== 200) {
        	console.log('Request error.');
        }
        jsdom.env({
        	html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js'];
        }, function(err, window){
        	var $ = window.jQuery;
            res.end($('title').text());
        });
    });
});

module.exports = router;
