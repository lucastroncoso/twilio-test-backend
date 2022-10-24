require("dotenv").config()
const express = require("express")
const cors = require("cors")
const router = require('./routes')

const app = express()
const port = 5000


app.use(cors())
app.use(express.json())
app.use('/', router);      

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
