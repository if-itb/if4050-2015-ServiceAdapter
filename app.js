/**
 * Created by lalalla on 15/06/2015.
 */
/*
 * REQUIREMENT
 * */
var express = require('express'),
	bodyparser = require('body-parser');
/*
 * INITIALIZATION
 * */
//var db = mongoose.connect('mongodb://127.0.0.1:23232/servicematkul');
var port = process.env.PORT || 8000;
var app = express();

app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(bodyparser.json());

/*
 * MODEL ASSIGNMENT
 */
//var User = require('./models/userModel');

/*
 * ROUTE ASSIGNMENT
 */
pesertaRoute = require('./routes/pesertaRoute')();
app.use('/api/peserta', pesertaRoute);

app.listen(port, function () {
	console.log('Server is running on port:' + port);
});
