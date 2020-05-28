// Code goes here!
/// <reference path="models/drag-drop.ts"/>
/// <reference path="models/project-model.ts"/>
/// <reference path="states/project-state.ts"/>
/// <reference path="utils/validation.ts"/>
/// <reference path="decorators/autobind-decorator.ts"/>
/// <reference path="components/base-component.ts"/>
/// <reference path="components/project-list.ts"/>
/// <reference path="components/project-input.ts"/>

namespace App {
    
    new ProjectInput()
    new ProjectList('active')
    new ProjectList('finished')
    
}