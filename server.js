const express = require('express')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

const fileTypesToExtension = {
    'python': 'py',
    'javascript': 'js'
}

const createUserFile = fileObj => {
    const uniqueFileName = fileObj.language + "_" + Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + fileTypesToExtension[fileObj.language]

    const filePath = path.join(__dirname, 'uploads', uniqueFileName)

    fs.writeFileSync(filePath, fileObj.code)
    return filePath.toString()
}

app.post('/code/exec', (req, res) => {
    const submissionLang = req.body.language

    const filePath = createUserFile(req.body)
    console.log(`Created file ${filePath}`)

    switch (submissionLang) {
        case 'python':
            const python = spawn('python', [filePath])
            let output = ""
            python.stdout.on('data', data => {
                output += data
            })

            python.on('exit', () => {
                res.status(200).json({ output })
            })

            break

        case 'javascript':
        default:
            res.status(400).json({ error: 'Invalid language' })
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})