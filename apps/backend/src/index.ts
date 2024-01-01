import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './server/router';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors())

app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGINS);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });


app.use('/api', router)

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

process.on('uncaughtException', function(err) { 
  
    // Handle the error safely 
    console.log(err) 
}) 