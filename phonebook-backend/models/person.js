const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url=process.env.MONGODB_URL
console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('successful connected to MongoDB')
    })
    .catch(error => {
        console.log('error connected to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: function(v) {
                console.log('Validating number:', v)
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)