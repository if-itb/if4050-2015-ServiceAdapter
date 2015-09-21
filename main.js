var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();


app.get('/', function (req, res){
	request('https://news.ycombinator.com', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    console.log(html);
	  }
	});
});

app.listen('80');
console.log('Server is running');