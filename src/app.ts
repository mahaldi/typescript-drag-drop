// Code goes here!

interface Draggable {
    dragStartHandler(event: DragEvent): void 
    dragEndHandler(event: DragEvent): void 
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void 
    dropHandler(event: DragEvent): void 
    dragLeaveHandler(event: DragEvent): void 
}

enum ProjectStatus {
    Active, Finished
}
class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {

    }
}

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}

class ProjectState extends State<Project>{
    // private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState
    private constructor() {
        super()
    }

    static getInstance() {
        if( this.instance )
        return this.instance
        this.instance = new ProjectState()
        return this.instance
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
        this.updateListener()
    }
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId)
        if(project && project.status !== newStatus){
            project.status = newStatus
            this.updateListener()
        }
    }
    private updateListener() {
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
        isValid = isValid && validatabale.value >= validatabale.min
    }
    if( validatabale.max != null && typeof validatabale.value === 'number') {
        isValid = isValid && validatabale.value <= validatabale.max
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

abstract class Component<T extends HTMLElement,U extends HTMLElement> { // make abstract karna agar cuma bisa di inherite, tidak untuk dipanggil
    templeteElement: HTMLTemplateElement
    hostElement: T
    element: U
    
    constructor(templeteId: string, hostElementId: string, insertAtStart: boolean , newElementId?: string) {
        this.templeteElement = document.getElementById(templeteId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T
        const importedNode = document.importNode(this.templeteElement.content, true)
        this.element = importedNode.firstElementChild as U
        if(newElementId)
        this.element.id = newElementId

        this.attach(insertAtStart)
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin':'beforeend', this.element)
    }

    abstract configure?(): void // ? udah kya keyword untuk marking as optional

    abstract renderContent(): void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project
    get persons() {
        if( this.project.people === 1) {
            return '1 person'
        }
        return this.project.people + ' persons'
    }
    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project
        this.configure()
        this.renderContent()
    }
    @autobind
    dragEndHandler(_: DragEvent){
    }
    @autobind
    dragStartHandler(event: DragEvent){
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = 'move'

    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }
    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.persons +' assigned'
        this.element.querySelector('p')!.textContent = this.project.description
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[]
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = []
        this.configure()
        this.renderContent()
    }
    @autobind
    dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault() // default nya karna tidak allowed untuk dropping
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }

    }
    @autobind
    dragLeaveHandler(_: DragEvent){

        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')

    }
    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active: ProjectStatus.Finished)
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        projectState.addListener((projects: Project[])=>{
            const relevantProject = projects.filter(prj => {
                if(this.type === 'active')
                return prj.status === ProjectStatus.Active
                return  prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProject
            this.renderProjects()
        })
    }
    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for( const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'PROJECTS'
    }

}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
    renderContent(){}
}

const project = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')