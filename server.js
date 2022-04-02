require('dotenv').config()
const express = require('express')
const path = require('path')
const { Configuration, OpenAIApi } = require("openai");

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);



app.post('/code/exec', (req, res) => {
    console.log(req.body)
    res.status(200).send('All OK')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})