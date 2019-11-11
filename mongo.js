const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://admin:${password}@cluster0-2ukmp.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err}`);
    });


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv[3] != undefined && process.argv[4] != undefined) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(response => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find().then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
