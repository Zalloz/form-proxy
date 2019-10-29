const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())

module.exports = app;