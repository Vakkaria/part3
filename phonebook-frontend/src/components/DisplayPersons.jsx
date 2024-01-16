import Person from './Person.jsx'

const DisplayPersons = ({person, findings, deletePerson}) => {
    if (person.name.toLowerCase().includes(findings.toLowerCase())) {
        return (
            <div>
                <Person person={person} deletePerson={deletePerson}/>
            </div>
        )
    }
}

export default DisplayPersons