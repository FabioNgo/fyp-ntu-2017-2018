import {RegExp} from './RegExp';

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
