// Code goes here!

class ProjectInput {
    templeteElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    constructor() {
        this.templeteElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templeteElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement // form tag line 13
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.configure()
        this.attach()
    }
    private eventHandler(event: Event) {
        event.preventDefault()
        console.log(this.titleInputElement.value)
    }
    private configure() {
        this.element.addEventListener('submit', this.eventHandler.bind(this))
    }
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const project = new ProjectInput()