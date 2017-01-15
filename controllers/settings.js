var express = require('express');
var passport = require('passport')
var router = express.Router();
var config = require('../config');
var User = require("../models/user");
var Widget = require("../models/widget");

/* LOGIN */
router.get('/', function(req, res, next) {
	var data = {
		menu: getMenu(isAuth(req)),
		menu_active: 0,
		title: 'Вход в настройки виджета',
		error: req.flash('message')[0]
	}
 	res.render('login', data);
});
router.post('/',
  	passport.authenticate(
	  	'local',
	  	{
	  		successRedirect: '/settings/',
	   		failureRedirect: '/',
	        failureFlash: true
	    }
    )
);

/* REGISTRATION */
router.get('/reg/', function(req, res, next) {
	var data = {
		menu: getMenu(isAuth(req)),
		menu_active: 1,
		title: 'Регистрация',
		error: req.flash('error')[0]
	}
 	res.render('reg', data);
});
router.post('/reg/', function(req, res, next) {
	var newUser = new User(req.body);
	newUser.save((error, user) => {
		if (error) {
			console.log(error)
			if (error.errors.username) {
				req.flash('error',error.errors.username.message)
				return res.redirect('/reg/');
			}
			req.flash('error','system db error')
			return res.redirect('/reg/');
		}
		req.login({username: user.username, password: user.password}, function(err) {
			if (err) {
				console.log(err)
				req.flash('error','auth error')
				return res.redirect('/reg/');
			}
			return res.redirect('/settings/');
		});
	})
});

/* LOGOUT */
router.get('/logout/', function(req, res, next) {
	req.logout();
  	res.redirect('/');
});

/* SETTINGS */
router.get('/settings/', isAuthMiddleware(), function(req, res, next) {
	console.log(req.user);
	Widget.find({ 'owner': req.user._id }, function (err, widgets) {
		var data = {
			menu: getMenu(isAuth(req)),
			menu_active: 0,
			title: 'Виджеты',
			widgets: widgets,
			cities: config.cities,
			//error: req.flash('message')[0]
		}
		console.log(data)
	 	res.render('settings', data);
	});
});
router.get('/settings/add/', isAuthMiddleware(), function(req, res, next) {
	var newWidget = new Widget({
		title: "",
		days: config.days[0].num,
		city: Object.keys(config.cities)[0],
		owner: req.user._id
	});
	newWidget.save((error, widget) => {
		if (error) {
			console.log(error)
			return res.redirect('/settings/');
		}
		//return res.redirect('/settings/'+widget._id+"/");
		var data = {
			menu: getMenu(isAuth(req)),
			menu_active: 0,
			title: 'Виджеты - create new',
			cities: config.cities,
			days: config.days,
			widget: widget
		}
		console.log(data)
	 	res.render('add-widget', data);
	})
});
router.get('/settings/:id/', isAuthMiddleware(), function(req, res, next) {
	Widget.findById(req.params.id, function (err, widget) {
		if (err) {
			console.log(err)
			return res.redirect('/settings/');
		}
		//return res.redirect('/settings/'+widget._id+"/");
		var data = {
			menu: getMenu(isAuth(req)),
			menu_active: 0,
			title: 'Виджеты - редактировать',
			cities: config.cities,
			days: config.days,
			widget: widget
		}
	 	res.render('edit-widget', data);
	});
});
router.get('/settings/delete/:id/', isAuthMiddleware(), function(req, res, next) {
	console.log(req.params);
	Widget.findByIdAndRemove(req.params.id, (err, widget) => {
		if (err) return res.status(401).send({
	        success: false,
	        message: 'Cannot remove!'
      	})
		return res.redirect('/settings/');
	})
});
router.post('/settings/:id/', isAuthMiddleware(), function(req, res, next) {
	Widget.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec((err, widget) => 
		err? res.status(500).send('Cannot save settings!') : res.redirect('/settings/')
	);
});

/* HELPERS */
function isAuthMiddleware() {
	return function(req, res, next) {
		if (!isAuth(req)) {
	      res.redirect('/');
	      /*
	      res.status(401).send({
	        success: false,
	        message: 'You need to be authenticated to access this page!'
	      })
	      */
	    } else {
	      next()
	    }
	}
}
const isAuth = function(req) {
	if(req.user)
		return true
	return false
}
const getMenu = function(is_auth) {
	if (is_auth) {
		return config.auth_menu
	}
	return config.not_auth_menu
}

module.exports = router;
