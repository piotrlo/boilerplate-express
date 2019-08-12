// • Serwer ma każdy request sprawdzać czy header token istnieje i ma wartość admin i jeśli tak to logować ip requesta do konsoli
// • Serwer ma mieć 4 routy o nazwie /user na matody: POST, GET, DELETE, PUT
// • Serwer ma supportować cors
// • Każdy request który przyjdzie do backu musi być zapisany do bazy
// • Każdy request ma zawracać ilość zapisanych requestów w bazie i ID ostatniego stowrzonego

import express from 'express'
import { has } from 'ramda'
var bodyParser = require('body-parser')

const app = express();

// --> 7)  Mount the Logger middleware here
const logger = (req, res, next) => {
    if(has('token', req.headers)){
        console.log(req.ip)
        console.log('has token')
    }
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
}
app.use(logger)

// --> 11)  Mount the body-parser middleware  here
const parseBody = bodyParser.urlencoded({extended: false})
app.use(parseBody)

/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
// const handler = function(req, res) {
// // res.send('Hello Express');
// }
// app.get('/', handler)

/** 3) Serve an HTML file */
const serveHtml = function(req, res) {
    res.sendFile(`${__dirname}/views/index.html`)
}
app.get('/', serveHtml)

/** 4) Serve static assets  */
const assets = express.static(`${__dirname}/public`)
app.use(assets)

/** 5) serve JSON on a specific route */
const response = {"message": "Hello json"}
// const serveJson = function(req, res) {
// res.json(response)
// }
// app.get('/json', serveJson)

/** 6) Use the .env file to configure the app */
const serveJson = function(req, res) {
    res.json(
        process.env.MESSAGE_STYLE === 'uppercase' ?
            {
                ...response,
                message: response.message.toUpperCase()
            }
            : response)
}
app.get('/json', serveJson)

/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */
app.get('/now', function(req, res, next) {
    req.time = new Date().toString()
    next();
}, function(req, res) {
    res.json({time: req.time});
})

/** 9)  Get input from client - Route parameters */
app.get('/:word/echo', function(req, res, next){
    next()
}, function(req, res, next){
    res.json({
        echo: req.params.word
    })
})

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
// app.get('/name', function(req, res, next){
//   console.log(req.query)
//   next()
// }, function(req, res, next){
//   const params = req.query
//   res.json({
//     name: `${params.first} ${params.last}`
//   })
// })

app.route('/user')
    .get((req, res) => res.json({
        user: `${req.query.first} ${req.query.last}`
    }))
    .post((req, res) => res.json({
        user: `${req.body.first} ${req.body.last}`
    }))

/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */



// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

module.exports = app;
