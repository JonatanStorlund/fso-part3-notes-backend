const res = require('express/lib/response')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.ioqmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url).then(result => {
  if (result) {
    console.log('result')
  } else {
    console.log('no result')
  }
})

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length == 3) {
  Person
    .find({})
    .then(persons => {
      console.log('Phonebook:')
      persons.forEach(person => {
        console.log(person.name + ' ' + person.number)
      })
  
      mongoose.connection.close()
      process.exit(1)
    })
}


if (process.argv.length > 3) {
  person.save().then(result => {
    console.log(`added ${result.name} with number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}