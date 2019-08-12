// • Serwer ma każdy request sprawdzać czy header token istnieje i ma wartość admin i jeśli tak to logować ip requesta do konsoli
// • Serwer ma mieć 4 routy o nazwie /user na matody: POST, GET, DELETE, PUT
// • Serwer ma supportować cors
// • Każdy request który przyjdzie do backu musi być zapisany do bazy
// • Każdy request ma zawracać ilość zapisanych requestów w bazie i ID ostatniego stowrzonego

import express from 'express'
import { has } from 'ramda'
import mongoose from 'mongoose'
const bodyParser = require('body-parser')

const nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
})
const User = mongoose.model("User", nameSchema)

mongoose.connect('mongodb+srv://harry:123Qwerty@cluster0-oxvpy.mongodb.net/test?retryWrites=true&w=majority')

const app = express()

const logger = (req, res, next) => {
    if(has('token', req.headers)){
        console.log(req.ip)
        console.log('TOKEN TOKEN TOKEN TOKEN !!')
    }
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next()
}
app.use(logger)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const serveHtml = function(req, res) {
    res.sendFile(`${__dirname}/views/index.html`)
}
app.get('/', serveHtml)

app.route('/user')
    .post((req, res) => {
        const myData = new User(req.body)
        myData.save()
            .then(item => {
                res.send("item saved to database");
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            })
    })
module.exports = app
