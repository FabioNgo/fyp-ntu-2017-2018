import {Macros} from './Macros';
// import {RegExp2} from './RegExp2';
// import {RegExp1} from './RegExp1';

export class RegExp {
  public type: number;
  
  constructor (type: number) {
    this.type = type;
  }
  
  public print (tab: string) {
    return tab + this.toString();
  }
  
  public toString () {
    return 'type = ' + this.type;
  }
  
  public isCharClass (macros: Macros): boolean {
    switch (this.type) {
      case 34:
        if (this instanceof RegExp2) {
          const binary = <RegExp2> this;
          return binary.r1.isCharClass(macros) && binary.r2.isCharClass(macros);
        }
        break;
      case 35:
      case 36:
      case 37:
      case 38:
      case 40:
      case 44:
      case 45:
      default:
        return false;
      case 39:
      case 42:
      case 43:
      case 46:
        return true;
      case 41:
        if (this instanceof RegExp1) {
          const unary = <RegExp1> this;
          return macros.getDefinition(<string>unary.content).isCharClass(macros);
        }
        break;
    }
  }
  
  public size (macros: Macros) {
    let unary: RegExp1;
    let binary: RegExp2;
    let content: RegExp;
    if (this instanceof RegExp1) {
      unary = <RegExp1> this;
      content = <RegExp> unary.content;
    }
    if (this instanceof RegExp2) {
      binary = <RegExp2> this;
    }
    switch (this.type) {
      case 32:
        return content.size(macros) + 2;
      case 33:
        return content.size(macros) + 2;
      case 34:
        return binary.r1.size(macros) + binary.r2.size(macros) + 2;
      case 35:
        return content.size(macros);
      case 36:
      default:
        throw new Error('unknown regexp type ' + this.type);
      case 37:
        return content.size(macros) * content.size(macros);
      case 38:
        return content.size(macros) * content.size(macros) * 3;
      case 39:
      case 46:
        return 2;
      case 40:
      case 45:
        return (<String>unary.content).length + 1;
      case 41:
        return macros.getDefinition(unary.content).size(macros);
      case 42:
      case 43:
        return 2;
      case 44:
        return binary.r1.size(macros) + binary.r2.size(macros);
    }
  }
}

export class RegExp1 extends RegExp {
  content: any;
  
  constructor (type: number, content) {
    super(type);
    this.content = content;
  }
  
  public print (tab: string) {
    return this.content instanceof RegExp ? tab + 'type = ' + this.type + tab + 'content :' + (<RegExp> this.content).print(tab + '  ') : tab + 'type = ' + this.type + tab + 'content :' + tab + '  ' + this.content;
  }
  
  public toString () {
    return this.print('');
  }
}

export class RegExp2 extends RegExp {
  
  r1;
  r2;
  
  public constructor (type, r1, r2) {
    super(type);
    this.r1 = r1;
    this.r2 = r2;
  }
  
  public print (tab) {
    return tab + 'type = ' + this.type + tab + 'child 1 :' + this.r1.print(tab + '  ') + tab + 'child 2 :' + this.r2.print(tab + '  ');
  }
  
  public toString () {
    return this.print('');
  }
}
