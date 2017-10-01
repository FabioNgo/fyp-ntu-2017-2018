import {JavaVector} from '../JavaVector';
import {RegExp} from './RegExp';
import {Action} from './Action';
import {ErrorMessages} from './ErrorMessages';
import {Macros} from './Macros';
import {LexicalStates} from './LexicalStates';

export class RegExps {
  lines: JavaVector<number>;
  states: JavaVector<JavaVector<number>>;
  regExps: JavaVector<RegExp>;
  actions: JavaVector<Action>;
  BOL: JavaVector<boolean>;
  look: JavaVector<RegExp>;
  
  public constructor () {
  }
  
  public insert (line: number, stateList: JavaVector<number>, regExp: RegExp, action: Action, isBOL: boolean, lookAhead: RegExp) {
    this.states.addElement(stateList);
    this.regExps.addElement(regExp);
    this.actions.addElement(action);
    this.BOL.addElement(isBOL);
    this.look.addElement(lookAhead);
    this.lines.addElement(line);
    return this.states.size() - 1;
  }
  
  
  public addStates (regNum: number, newStates: JavaVector<LexicalStates>) {
    // Enumeration s = newStates.elements();
    //
    // while(s.hasMoreElements()) {
    //   ((Vector)this.states.elementAt(regNum)).addElement(s.nextElement());
    // }
    
  }
  
  public getNum () {
    return this.states.size();
  }
  
  public isBOL (num): boolean {
    return this.BOL.elementAt(num);
  }
  
  public getLookAhead (num) {
    return this.look.elementAt(num);
  }
  
  public isEOF (num) {
    return this.BOL.elementAt(num) == null;
  }
  
  public getStates (num) {
    return this.states.elementAt(num);
  }
  
  public getRegExp (num) {
    return this.regExps.elementAt(num);
  }
  
  public getLine (num) {
    return this.lines.elementAt(num);
  }
  
  public checkActions () {
    if (this.actions.elementAt(this.actions.size() - 1) == null) {
      throw new Error(ErrorMessages.NO_LAST_ACTION.key);
    }
  }
  
  public getAction (num): Action {
    while (num < this.actions.size() && this.actions.elementAt(num) == null) {
      ++num;
    }
    
    return this.actions.elementAt(num);
  }
  
  public NFASize (macros: Macros) {
    let size = 0;
    let e = this.regExps.data;
    
    e.forEach((value: RegExp, index: number) => {
      if (value != null) {
        size += value.size(macros);
      }
    });
    
    e = this.look.data;
    e.forEach((value: RegExp, index: number) => {
      if (value != null) {
        size += value.size(macros);
      }
    });
    return size;
  }
}
