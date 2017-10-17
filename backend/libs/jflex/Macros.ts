import {RegExp, RegExp1, RegExp2} from './RegExp';
import {ErrorMessages} from './ErrorMessages';

export class Macros {
  macros: Map<string, RegExp> = new Map<string, RegExp>();
  private used: Map<string, boolean> = new Map<string, boolean>();
  
  public insert (name: string, definition: RegExp) {
    this.used.set(name, false);
    return this.macros.set(name, definition);
  }
  
  public markUsed (name: string) {
    return this.used.set(name, true);
  }
  
  public isUsed (name: string): boolean {
    return (this.used.get(name));
  }
  
  public unused (): string[] {
    const unUsed = [];
    this.used.forEach((value: boolean, key: string) => {
      if (!value) {
        unUsed.push(key);
      }
    });
    
    return unUsed;
  }
  
  public getDefinition (name: string): RegExp {
    return <RegExp>this.macros.get(name);
  }
  
  public expand () {
    this.macros.forEach((value: RegExp, name: string) => {
      if (this.isUsed(name)) {
        this.macros.set(name, this.expandMacro(name, this.getDefinition(name)));
      }
    });
    
  }
  
  private expandMacro (name: string, definition: RegExp) {
    switch (definition.type) {
      case 32:
      case 33:
      case 35:
      case 37:
      case 38:
        const unary = <RegExp1>definition;
        unary.content = this.expandMacro(name, <RegExp>unary.content);
        return definition;
      case 34:
      case 44:
        const binary = <RegExp2>definition;
        binary.r1 = this.expandMacro(name, binary.r1);
        binary.r2 = this.expandMacro(name, binary.r2);
        return definition;
      case 36:
      default:
        throw new Error('unknown expression type ' + definition.type + ' in macro expansion');
      case 39:
      case 40:
      case 42:
      case 43:
      case 45:
      case 46:
        return definition;
      case 41:
        const usename = <string>(<RegExp1>definition).content;
        if (name === usename) {
          throw new Error(ErrorMessages.MACRO_CYCLE.key);
        } else {
          const usedef = this.getDefinition(usename);
          if (usedef == null) {
            throw new Error(ErrorMessages.MACRO_DEF_MISSING.key);
          } else {
            this.markUsed(usename);
            return this.expandMacro(name, usedef);
          }
        }
    }
  }
}
