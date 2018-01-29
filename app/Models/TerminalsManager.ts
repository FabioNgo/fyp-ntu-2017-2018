import {Terminal} from "./Terminal";
import {TerminalsChangeListener} from "../Controllers/TerminalsChangeListener";


export class TerminalsManager {
  private static instance: TerminalsManager;
  private terminals: Terminal[];
  private terminalsChangeListeners: TerminalsChangeListener[];

  constructor() {
    this.terminals = [];
    this.terminalsChangeListeners = [];
  }

  static getInstance(): TerminalsManager {
    if (this.instance === undefined) {
      this.instance = new TerminalsManager();
    }
    return this.instance;
  }

  getTerminals(): Terminal[] {
    return this.terminals;
  }

  addTerminalsChangeListener(listener: TerminalsChangeListener) {
    this.terminalsChangeListeners.push(listener);
  }

  terminalsChanged() {
    this.terminalsChangeListeners.forEach(listener => {
      listener.update();
    });
  }

  removeTerminal(terminal: Terminal) {
    for (let i = 0; i < this.terminals.length; i++) {
      if (this.terminals[i].identifier === terminal.identifier) {
        this.terminals.splice(i, 1);
        break;
      }
    }
    this.terminalsChanged();
  }

  addTerminal(terminal: Terminal) {
    if (terminal.identifier === undefined || terminal.identifier === undefined || terminal.identifier === '' || terminal.rule === '') {

    } else {
      for (let i = 0; i < this.terminals.length; i++) {
        if (this.terminals[i].identifier === terminal.identifier) {
          return;
        } else {

        }
      }
      this.terminals.push(terminal);
    }
    this.terminalsChanged();
  }

}
