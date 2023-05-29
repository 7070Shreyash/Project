import express from "express";
import bodyParser from "body-parser"; // body parser is used for parsing the HTTP reqeust body 
import mongoose from "mongoose";
import cors from "cors" // cors is helpful to disable security in the APIs when client adn server are on different origins --> cross origin resource sharing 
import dotenv from "dotenv";  // for environment variables 
import multer from "multer"; //middleware for handling muliipart/form-data -- used for uploading files
import helmet from "helmet"; // add some HTTP headers to securing them to comply to web security standards 
import morgan from "morgan"; // simplifies the logging of request to and from the application
import path from "path"
import { fileURLToPath } from "url";

// midllewares --> that runs b/w differnet requests

// configuring middlewares and packages 

const __filename = fileURLToPath(import.meta.url); // to grab file and dir url
const __dirname = path.dirname(__filename) ; // because we have used type : module

dotenv.config() // so that we can use .env files

const app = express() ;

app.use(express.json()) ; // to convert the req etc to json 

app.use(helmet()) ;

app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"})) ;

app.use(morgan("common")) ;

app.use(bodyParser.json({limit : "30mb" , extended : true})) ;

app.use(bodyParser.urlencoded({limit : "30mb" , extended : true})) ;

app.use(cors()) ;

app.use("/assets",express.static(path.join(__dirname,"public/assets"))) ; // we will store some images locally here

// setup the file storage 

const storage = multer.diskStorage({

    destination : function(req,file,cb) {
        cb(null,"public/assets");
    },
    filename : function(req,file,cb) {
        cb(null,file.originalname);
    }
}); // from github repo of multer]

const upload = multer({storage}) ; // we can have access to the uploaded files from here

//Mongoose setup 
const PORT = process.env.PORT || 6001; // if unable to connect
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=> {
    app.listen(PORT,()=>console.log(`Server is running at Port no ${PORT}`)) ;
}).catch((error) => console.log(`${error} did not connect`)) ;





