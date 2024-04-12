const port=process.env.PORT || 3000;
const cors=require("cors");
const express=require('express');
const conne= require('./data/connection');
const routesP= require('./data/routesP'); 
const routesU=require('./data/routesU');
const routesB=require('./data/routesB');
const bodyParser = require('body-parser');
const routPay=require('./data/pay')
conne(); 
const app=express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/p',routesP);
app.use('/u',routesU);
app.use('/b',routesB); 
app.post('/orders',routPay.orders);
app.post('/verify',routPay.verify)
app.listen(port,()=>{
    console.log("Serve list");
}); 