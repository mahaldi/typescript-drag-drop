import { Component } from './base-component'
import { autobind } from '../decorators/autobind-decorator'
import { DragTarget } from '../models/drag-drop'
import { Project, ProjectStatus } from '../models/project-model'
import { projectState } from '../states/project-state'
import { ProjectItem } from './project-item'

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[]
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = []
        this.configure()
        this.renderContent()
    }
    @autobind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault() // default nya karna tidak allowed untuk dropping
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }

    }
    @autobind
    dragLeaveHandler(_: DragEvent) {

        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')

    }
    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        projectState.addListener((projects: Project[]) => {
            const relevantProject = projects.filter(prj => {
                if (this.type === 'active')
                    return prj.status === ProjectStatus.Active
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProject
            this.renderProjects()
        })
    }
    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'PROJECTS'
    }

}