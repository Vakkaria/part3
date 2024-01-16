const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

const logPost = (request, response, next) => {
    request.method === 'POST'
        ? morgan((tokens, request, response) => {
            return [
                tokens.method(request, response),
                tokens.url(request, response),
                tokens.status(request, response),
                tokens.res(request, response, 'content-length'), '-',
                tokens['response-time'](request, response), 'ms',
                JSON.stringify(request.body)
            ].join(' ')
        })(request, response, next)
        : next()
}

app.use(logPost)

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<p>Please, going to "/api/persons" path</p>')
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!(body.name && body.phone)) {
        return response.status(400).json({
            error: 'name or phone missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be uniq'
        })
    }

    const person = {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        name: body.name,
        number: body.phone
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end('<h1>ERROR 404</h1>')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const dateOfRequest = new Date()

    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${dateOfRequest}</p>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))