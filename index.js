const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('body', function getbody(req) {
    return JSON.stringify(req.body)
})
const app = express()
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :response-time :body'))


let persons = [
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "David hellas",
        "number": "39-34-455522",
        "id": 6
    },
    {
        "name": "Julia Hans",
        "number": "120-3838-123213",
        "id": 5
    }
]

app.get('/info', (req, res) => {
    res.send('<div>phonebook has info for ' + persons.length + ' people</div>' +
        '<div>' + new Date() + '</div>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => {
        return p.id === id
    })
    if (person)
        res.json(person)
    else
        res.status(404).end()
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => {
        return p.id !== id
    })
    res.status(204).end()
})
const generateId = () => {
    const id = Math.floor((1 + Math.random()) * 0x10000)
    console.log('id', id)
    return id;
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name)
        return res.status(400).json({
            error: 'Name is missing'
        })
    if (persons.find(person => person.name === body.name) !== undefined)
        return res.status(400).json({
            error: 'name must be unique'
        })

    const person = {
        'name': body.name,
        'number': body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
