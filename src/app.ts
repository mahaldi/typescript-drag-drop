// Code goes here!
enum ProjectStatus {
    Active, Finished
}
class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {

    }
}

type Listener = (items: Project[]) => void

class ProjectState {
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState
    private constructor() {

    }

    static getInstance() {
        if( this.instance )
        return this.instance
        this.instance = new ProjectState()
        return this.instance
    }
    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn)
    }
    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )
        this.projects.push(newProject)
        for(const lintenerFn of this.listeners) {
            lintenerFn(this.projects.slice())
        }
    }
    
}

const projectState = ProjectState.getInstance()
interface Validatable {
    value: string | number
    required: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatabale: Validatable) {
    let isValid = true
    if( validatabale.required ) {
        isValid = isValid && validatabale.value.toString().trim().length !== 0
    }
    if( validatabale.minLength != null && typeof validatabale.value === 'string') {
        isValid = isValid && validatabale.value.length > validatabale.minLength
    }
    if( validatabale.maxLength != null && typeof validatabale.value === 'string') {
        isValid = isValid && validatabale.value.length < validatabale.maxLength
    }
    if( validatabale.min != null && typeof validatabale.value === 'number') {
        isValid = isValid && validatabale.value > validatabale.min
    }
    if( validatabale.max != null && typeof validatabale.value === 'number') {
        isValid = isValid && validatabale.value < validatabale.max
    }
    return isValid
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

class ProjectList {
    templeteElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLElement
    assignedProjects: Project[]
    constructor(private type: 'active' | 'finished') {
        this.templeteElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement
        this.assignedProjects = []
        const importedNode = document.importNode(this.templeteElement.content, true)
        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-projects`

        projectState.addListener((projects: Project[])=>{
            const relevantProject = projects.filter(prj => {
                if(this.type === 'active')
                return prj.status === ProjectStatus.Active
                return  prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProject
            this.renderProjects()
        })
        this.attach()
        this.renderContent()
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for( const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li')
            listItem.textContent = prjItem.title
            listEl.appendChild(listItem)
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'PROJECTS'
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
}

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
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
        this.configure()
        this.attach()
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
        if( !validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
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
        if(Array.isArray(userInput)) { // karna tuple return array
            const [title, description, people] = userInput // desctructur array
            projectState.addProject(title, description, people)
            this.clearInput()
        }
        
    }
    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const project = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')