module.exports = {
	WIDGET: 'widgetHash',
	WEATHER: 'weatherHash',
	database: {
		host: '127.0.0.1',
		port: 27017,
		name: 'widget',
		user: '',
		pass: ''
	},
	not_auth_menu: [
		{
			name: "Вход",
			url: "/"
		},
		{
			name: "Регистрация",
			url: "/reg/"
		}
	],
	auth_menu: [
		{
			name: "Виджеты",
			url: "/settings/"
		},
		{
			name: "Выход",
			url: "/logout/"
		}
	],
	cities: {
		27612: {name: "Москва", location: "55.755764,37.622269"},
		26063: {name: "Санкт-Петербург", location: "59.920189,30.339658"},
		27459: {name: "Нижний Новгород", location: "56.315530,44.017433"}
	},
	days: [
		{
			num: 1,
			label: "1 день"
		},
		{
			num: 3,
			label: "3 дня"
		},
		{
			num: 7,
			label: "Неделю"
		}
	]
}