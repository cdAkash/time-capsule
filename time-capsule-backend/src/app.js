import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser';

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(bodyParser.json());


// importing the routes
import authRoute from './routes/auth.routes.js'
import capsuleRoute from './routes/capsule.routes.js'

app.use("/api/v1/auth",authRoute);
app.use("/ai/v1/capsule",capsuleRoute);

export {app}