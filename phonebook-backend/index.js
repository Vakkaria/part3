require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

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

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: 'name or phone missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => response.json(updatedPerson))
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const dateOfRequest = new Date()

    response.send(`
        <p>Phonebook has info for ${Person.length} people</p>
        <p>${dateOfRequest}</p>
    `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))