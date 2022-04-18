require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('build'))
const Person = require('./models/person')

// create application/json parser
const jsonParser = bodyParser.json()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time :body'))

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`Phonebook has ${persons.length} info for people </br> ${new Date()}`)
  })
})

const generateRandomId = (max) => {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons',jsonParser, (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: Number(body.number),
    id: generateRandomId(21000),
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

app.put('/api/persons/:id',jsonParser, (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: Number(body.number),
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})