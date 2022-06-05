import express from 'express';

let configViewEngine = (app) => {
	app.use(express.static('./src/public')); // cho react bik nó có thể truy cập vào file nào
	app.set('view engine', 'ejs');
	app.set('views', './src/views'); // tìm đến thư mục view có đường dẫn ./src/views
};

module.exports = configViewEngine;
