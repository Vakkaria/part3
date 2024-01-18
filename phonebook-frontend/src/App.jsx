import {useState, useEffect} from 'react'
import DisplayPersons from './components/DisplayPersons.jsx'
import FilterForm from './components/FilterForm.jsx'
import AddForm from './components/AddForm.jsx'
import personsServices from './services/persons.js'
import Notification from './components/Notification.jsx'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [findings, setFindings] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        personsServices
            .getAll()
            .then(initialResult => setPersons(initialResult))
    }, [])

    const deletePerson = (event, name, id) => {
        event.preventDefault()

        if (confirm(`Delete ${name}`)) {
            personsServices
                .deleteData(id)
                .then(() => setPersons(persons.filter(p => p.id !== id)))
                .catch(() => {
                    setError(true)
                    setErrorMessage(`Information of ${name} has already been removed from server`)
                    setTimeout(() => setErrorMessage(null), 2000)
                })
        }
    }

    const addPerson = event => {
        event.preventDefault()

        if (persons.map(person => person.name).includes(newName)) {

            const name = persons.find(p => p.name === newName)
            const changedPerson = {...name, number: newNumber}

            if (confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
                personsServices
                    .update(name.id, changedPerson)
                    .then(returnedData => {
                        setPersons(persons.map(p => p.id !== name.id ? p : returnedData))
                    })
            }

            setNewNumber('')
            setNewName('')

            return
        }

        const personObject = {
            name: newName,
            number: newNumber
        }

        personsServices
            .create(personObject)
            .then(newValue => {
                setPersons(persons.concat(newValue))
                setError(false)
                setErrorMessage(`Added ${newName}`)
                setNewNumber('')
                setNewName('')
                setTimeout(() => setErrorMessage(null), 2000)
            })
    }

    const handleNameChange = event => setNewName(event.target.value)
    const handleNumberChange = event => setNewNumber(event.target.value)
    const handleFindingChange = event => setFindings(event.target.value)

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={errorMessage} error={error}/>
            <FilterForm findings={findings} handleFindingChange={handleFindingChange}/>
            <h3>add a new</h3>
            <AddForm addPerson={addPerson} newNumber={newNumber} newName={newName}
                     handleNumberChange={handleNumberChange} handleNameChange={handleNameChange}/>
            <h3>Numbers</h3>
            {persons.map(person =>
                <DisplayPersons findings={findings} person={person}
                                key={person.id} deletePerson={deletePerson}/>
            )}
        </div>
    )
}

export default App