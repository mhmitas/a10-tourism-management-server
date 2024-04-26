const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Let\'s explore South Asia')
})

app.listen(port, () => {
    console.log(`tourism management server is listening on port ${port}`)
})