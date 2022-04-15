const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time :body'))

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

app.get('/info', (req, res) => {

  res.send(`Phonebook has info for ${persons.length} people </br> ${new Date()}`)
})

const generateRandomId = (max) => {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons', (request, response) => {
  console.log(request, 'request')
  console.log(request.body, 'request body')
  console.log(response, 'response')
  const body = request.body
  const names = persons.map(person => person.name)
  const nameExsists = names.includes(body.name) ? names.includes(body.name) : ''


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

  if (nameExsists) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: Number(body.number),
    id: generateRandomId(21000),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(400).json({error: 'Person does not exsist'})
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})