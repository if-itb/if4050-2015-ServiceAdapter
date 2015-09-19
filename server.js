var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsdom = require('jsdom');
var jQuery = require('jQuery');
var $ = null;
var parseDpk = require('./parse-dpk');
var stringifyObject = require('stringify-object');

jsdom.env('<html></html>', function(error, window) {
	if (error) {
		console.log("Error while creating jsdom window: " + error);
	} else {
		$ = jQuery(window);
		$.support.cors = true;
	}
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

function getUrl(query) {
	var ps = query.ps ? query.ps :
			(query.program_studi ? query.program_studi : '135');
	var semester = query.semester ? query.semester : '1';
	var tahun = query.tahun ? query.tahun : '2015';
	var th_kur = query.th_kur ? query.th_kur :
			(tahun < '2013' ? '2008' : '2013');
	return 'https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=' + ps +
			'&semester=' + semester + '&tahun=' + tahun + '&th_kur=' +th_kur;
}

function getDpkUrl(href) {
	return 'https://six.akademik.itb.ac.id/publik/' + href;
}

function isTextMatchingCode(text, query) {
	return text.match(new RegExp(query.kode, "gi")) !== null;
}

router.route('/')
	.get(function(request, response) {
		var query = request.query;
		console.log("processing query: " + stringifyObject(query));

		if (query.ps === undefined || query.kode === undefined || query.kelas === undefined) {
			response.status(400).json({
				error: "Query tidak valid"
			});
		} else {
			var url = getUrl(query);

			$.get(url)
				.done(function(html) {
					var found = false;
					$(html).find('li').each(function() {
						var text = $(this).text();

						if (isTextMatchingCode(text, query)) {
							$(this).find('a').each(function() {
								var kelas = $(this).text();

								if (parseInt(kelas) === parseInt(query.kelas)) {
									var href = $(this).attr('href');

									found = true;
									$.get(getDpkUrl(href))
										.done(function(dpk) {
											var result = parseDpk(dpk);
											if (result.error !== undefined) {
												response.status(500).json(result);
											} else {
												response.status(200).json(result);
											}
										})
										.fail(function(error) {
											response.status(500).json(error);
										});
								}
							});
						}
					});
					if (!found) {
						response.status(404).json({
							error: "No matching class was found"
						});
					}
				})
				.fail(function(xhr, error) {
					response.status(500).json(error);
				});
		}
	});

app.use('/', router);
app.listen(port);
console.log('App is ready on port ' + port);
