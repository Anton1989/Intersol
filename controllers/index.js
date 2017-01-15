var express = require('express');
var redis = require("redis");
var Widget = require("../models/widget");
var config = require('../config');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/:id/', function(req, res, next) {
	var client = redis.createClient()
	//client.del('widget.'+req.params.id)
	client.on("error", function (err) {
	    console.log("Error " + err);
	});

	client.get('widget.'+req.params.id, function (err, widget) {
		if(err)
			res.status(500).send('Error!')
	    
	    if(widget) {
	    	widget = JSON.parse(widget);
	    	console.log('REDIS');
	    	console.log(widget);
	    	getWeather(req, res, widget, client)
	    } else {
	    	Widget.findById(req.params.id).lean().exec((err, widget) => {
	    		if(err)
	    			res.status(500).send('Error!')
	    		console.log('MONGO');
	    		console.log(widget);
				client.set('widget.'+widget._id, JSON.stringify(widget));
				getWeather(req, res, widget, client)
	    	})
	    }
	});
	//client.hset("hash key", "hashtest 1", "some value");
	
	
	/*
	var client = redis.createClient();
	client.on("error", function (err) {
	    console.log("Error " + err);
	});
	//client.set("test1", "string val");
	client.get("test1", function (err, reply) {
	    console.log('RES = '+reply); // Will print `OK`
	});
	client.quit(function (err, res) {
	    console.log('Exiting from quit command.');
	});
	*/

	
});
const getWeather = function(req, res, widget, client) {
	var REQUEST_URL = 'https://api.darksky.net/forecast/f9692f348ca032a9f8a5aada5b542f71/'+config.cities[widget.city].location+'?lang=ru';
	client.del(REQUEST_URL)
	client.get(REQUEST_URL, function (err, weather) {
		if(weather) {
			weather = JSON.parse(weather);
			console.log("REDIS")
			console.log(weather)
			var data = {
				cities: config.cities,
				widget: widget,
				weather: weather
			}
			res.render('index', data);
			closeRedis(client)
		} else {
		  	request(REQUEST_URL, function (error, response, weather) {
	  			if (!error && response.statusCode == 200) {
	  				weather = JSON.parse(weather);
	  				var days = [];
	  				for (var i = 0; i<widget.days; i++) {
	  					days[i] = {
	  						temperatureMin: Math.round((weather.daily.data[i].temperatureMin-32)*5/9),
	  						temperatureMax: Math.round((weather.daily.data[i].temperatureMax-32)*5/9),
	  						summary: weather.daily.data[i].summary,
	  						date: ParseData(new Date(weather.daily.data[i].time * 1000))
	  					}
	  				}
	  				weather = {
	   					temperature: Math.round((weather.currently.temperature-32)*5/9),
	   					summary: weather.currently.summary,
	   					daily: days
	   				}
	  				console.log("API")
	   				console.log(weather)
	   				var data = {
	   					cities: config.cities,
						widget: widget,
						weather: weather
					}
					res.render('index', data)
	   				client.set(REQUEST_URL, JSON.stringify(weather))
					client.expire(REQUEST_URL, 60*60)
					closeRedis(client)
				}
			})
		}
	})
}
const closeRedis = function(client) {
	client.quit(function (err, res) {
	    console.log('Exiting from quit command.');
	});
}
const ParseData = function(date) {
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	return day + "." + month + "." + year
}

module.exports = router;