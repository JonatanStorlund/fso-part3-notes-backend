const mongoose = require('mongoose')

const mongodbPassword = process.env.MONGOPASSWORD
const url = `mongodb+srv://fullstackopen:${mongodbPassword}@cluster0.ioqmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return (/\d{2,3}-\d{5,}/).test(v);
      },
      message: 'is not a valid phone number!'
    },
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
