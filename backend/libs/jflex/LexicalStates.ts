import {JavaVector} from '../JavaVector';

export class LexicalStates {
  states: Map<string, number>;
  inclusive: JavaVector<number>;
  numStates: number;
  
  public constructor () {
    this.states = new Map<string, number>();
    this.inclusive = new JavaVector<number>();
    this.numStates = 0;
  }
  
  public insert (name: string, is_inclusive: boolean) {
    if (!this.states.has(name)) {
      const code = this.numStates++;
      this.states.set(name, code);
      if (is_inclusive) {
        this.inclusive.addElement(code);
      }
      
    }
  }
  
  public getNumber (name: string) {
    return this.states.get(name);
  }
  
  public number (): number {
    return this.numStates;
  }
  
  public names () {
    return this.states.keys();
  }
  
  public getInclusiveStates () {
    return this.inclusive.data;
  }
}
