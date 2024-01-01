import express, { Router } from 'express';
import dotenv from 'dotenv'
import { authRouter } from './auth/http/auth.router';
import cors from 'cors'
import bodyParser from 'body-parser'

console.log('AHAHAHAHasdAHAH');

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors())

app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

const router = Router();

router.get('/', (req, res) => res.json('api is working'))

router.use('/auth', authRouter)

app.use('/api', router)

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

process.on('uncaughtException', function(err) { 
  
    // Handle the error safely 
    console.log(err) 
}) 