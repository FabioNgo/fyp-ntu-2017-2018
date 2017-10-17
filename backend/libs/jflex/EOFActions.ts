import {Action} from './Action';
import {JavaVector} from '../JavaVector';

export class EOFActions {
  private actions: Map<any, any> = new Map<any, any>();
  private defaultAction: Action;
  private numLexStates;
  
  public constructor () {
  }
  
  public setNumLexStates (num) {
    this.numLexStates = num;
  }
  
  public add (stateList?, action?: Action) {
    if (isNaN(stateList)) {
      if (this.actions.get(stateList) == null) {
        this.actions.set(stateList, action);
      } else {
        const oldAction = this.actions.get(stateList);
        this.actions.set(stateList, oldAction.getHigherPriority(action));
      }
      return;
    }
    if (stateList instanceof JavaVector) {
      if (stateList != null && stateList.size() > 0) {
        const states = stateList.data;
        states.forEach((state: number) => {
          this.add(state, action);
        });
      } else {
        this.defaultAction = action.getHigherPriority(this.defaultAction);
        
        for (let i = 0; i < this.numLexStates; ++i) {
          const state = i;
          if (this.actions.get(state) != null) {
            const oldAction = this.actions.get(state);
            this.actions.set(state, oldAction.getHigherPriority(action));
          }
        }
      }
    }
    
    
  }
  
  public isEOFAction (a) {
    if (a === this.defaultAction) {
      return true;
    } else {
      this.actions.forEach((action: Action, index: number) => {
        if (a === action) {
          return true;
        }
      });
      
      return false;
    }
  }
  
  public getAction (state: number) {
    return this.actions.get(state);
  }
  
  public getDefault () {
    return this.defaultAction;
  }
  
  public numActions () {
    return this.actions.size;
  }
}
