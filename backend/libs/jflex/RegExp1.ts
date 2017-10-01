import {RegExp} from './RegExp';

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
