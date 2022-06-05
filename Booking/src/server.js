import express from 'express';
import bodyParser from 'body-parser';

import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();

let app = express();
// config app

let port = process.env.PORT || 6969;
const corsOptions = {
	origin: process.env.URL_REACT, // url of reactjs
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(cors({ origin: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// extended: true xác định rằng đối tượng req.body sẽ chứa các giá trị thuộc bất kỳ loại nào thay vì chỉ các chuỗi.

viewEngine(app);
initWebRoutes(app);

connectDB();

app.listen(port, () => {
	console.log('Backend Nodejs is running on the port: ', +port);
});
