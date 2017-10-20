import {JavaString} from '../JavaString';
import {JavaObject} from '../JavaObject';

export class Action implements JavaObject {
  content: string;
  priority: number;
  lookAction: boolean;

  public constructor (content: string, priority: number) {
    this.content = content.trim();
    this.priority = priority;
  }
  
  getClass (): string {
    return 'Action';
  }
  
  public getHigherPriority (other: Action): Action {
    if (other == null) {
      return this;
    } else {
      return other.priority > this.priority ? this : other;
    }
  }
  
  public toString (): string {
    return 'Action (priority ' + this.priority + ', lookahead ' + this.isLookAction + ') :' + this.content;
  }
  
  public isEquiv (a: Action): boolean {
    return this === a || this.content === a.content;
  }
  
  public hashCode (): number {
    return JavaString.hashCode(this.content);
  }
  
  public equals (o: JavaObject): boolean {
    return o instanceof Action ? this.isEquiv(<Action>o) : false;
  }
  
  public isLookAction (): boolean {
    return this.lookAction;
  }
  
  public setLookAction (b: boolean) {
    this.lookAction = b;
  }
}
