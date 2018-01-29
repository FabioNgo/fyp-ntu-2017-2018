import {Definition} from './Definition';
import {DefinitionsChangeListener} from '../Controllers/DefinitionsChangeListener';


export class DefinitionsManager {
  private static instance: DefinitionsManager;
  private definitions: Definition[];
  private definitionsChangeListeners: DefinitionsChangeListener[];

  constructor() {
    this.definitions = [];
    this.definitionsChangeListeners = [];
  }

  static getInstance(): DefinitionsManager {
    if (this.instance === undefined) {
      this.instance = new DefinitionsManager();
    }
    return this.instance;
  }

  getDefinitions(): Definition[] {
    return this.definitions;
  }

  addDefinitionsChangeListener(listener: DefinitionsChangeListener) {
    this.definitionsChangeListeners.push(listener);
  }

  definitionsChanged() {
    this.definitionsChangeListeners.forEach(listener => {
      listener.update();
    });
  }

  removeDefinition(definition: Definition) {
    for (let i = 0; i < this.definitions.length; i++) {
      if (this.definitions[i].identifier === definition.identifier) {
        this.definitions.splice(i, 1);
        break;
      }
    }
    this.definitionsChanged();
  }

  addDefinition(definition: Definition) {
    if (definition.identifier === undefined || definition.expression === undefined || definition.identifier === '' || definition.expression === '') {

    } else {
      for (let i = 0; i < this.definitions.length; i++) {
        if (this.definitions[i].identifier === definition.identifier) {
          return;
        } else {

        }
      }
      this.definitions.push(definition);
    }
    this.definitionsChanged();
  }

}
