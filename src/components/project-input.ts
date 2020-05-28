import { Component } from './base-component'
import { autobind } from '../decorators/autobind-decorator'
import { projectState } from '../states/project-state'
import { validate, Validatable } from '../utils/validation'

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
        this.configure()
    }

    private gatherUserInput(): [string, string, number] | void { //[string, string, number] return value nya harus sesuai dengan urutan ini type nya
        const centeredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = +this.peopleInputElement.value
        const titleValidatable: Validatable = {
            value: centeredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }
        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert('not valid')
        } else {
            return [centeredTitle, enteredDescription, enteredPeople]
        }
    }
    private clearInput() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()
        if (Array.isArray(userInput)) { // karna tuple return array
            const [title, description, people] = userInput // desctructur array
            projectState.addProject(title, description, people)
            this.clearInput()
        }

    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
    renderContent() { }
}