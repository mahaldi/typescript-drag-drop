namespace App {
    export abstract class Component<T extends HTMLElement,U extends HTMLElement> { // make abstract karna agar cuma bisa di inherite, tidak untuk dipanggil
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
}