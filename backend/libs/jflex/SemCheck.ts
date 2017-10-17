import {Macros} from './Macros';
import {RegExps} from './RegExps';
import {Out} from './Out';
import {ErrorMessages} from './ErrorMessages';
import {RegExp, RegExp1, RegExp2} from './RegExp';
import {IntCharSet} from './IntCharSet';
import {JavaCharacter} from '../JavaCharacter';
import {Interval} from './Interval';
import {JavaVector} from '../JavaVector';

export class SemCheck {
  private static macros: Macros;
  private static maxChar: string;
  
  public constructor () {
  }
  
  public static check (rs: RegExps, m: Macros, max: string) {
    SemCheck.macros = m;
    SemCheck.maxChar = max;
    let errors = false;
    const num = rs.getNum();
    
    for (let i = 0; i < num; ++i) {
      const r = rs.getRegExp(i);
      const l = rs.getLookAhead(i);
      if (!SemCheck.checkLookAhead(r, l)) {
        errors = true;
        Out.error(ErrorMessages.LOOKAHEAD_ERROR, rs.getLine(i), -1);
      }
    }
    
    if (errors) {
      throw new Error('GeneratorException()');
    }
  }
  
  private static checkLookAhead (r1: RegExp, r2: RegExp) {
    return r2 === null || SemCheck._length(r1) > 0 || !SemCheck._last(r1).and(SemCheck._first(r2)).containsElements();
  }
  
  private static _length (re: RegExp) {
    let r: RegExp2;
    let l1;
    let l2;
    switch (re.type) {
      case 32:
      case 33:
      case 35:
        return -1;
      case 34:
        r = <RegExp2>re;
        l1 = SemCheck._length(r.r1);
        if (l1 < 0) {
          return -1;
        } else {
          l2 = SemCheck._length(r.r2);
          if (l1 === l2) {
            return l1;
          }
          
          return -1;
        }
      case 36:
      case 37:
      case 38:
      default:
        throw new Error('Unkown expression type ' + re.type + ' in ' + re);
      case 39:
      case 42:
      case 43:
        return 1;
      case 40:
        const content = <string>(<RegExp1>re).content;
        return content.length;
      case 41:
        return SemCheck._length(SemCheck.macros.getDefinition(<string>(<RegExp1>re).content));
      case 44:
        r = <RegExp2>re;
        l1 = SemCheck._length(r.r1);
        if (l1 < 0) {
          return -1;
        } else {
          l2 = SemCheck._length(r.r2);
          return l2 < 0 ? -1 : l1 + l2;
        }
    }
  }
  
  private static containsEpsilon (re: RegExp) {
    let r: RegExp2;
    switch (re.type) {
      case 32:
      case 35:
        return true;
      case 33:
        return SemCheck.containsEpsilon(<RegExp>(<RegExp1>re).content);
      case 34:
        r = <RegExp2>re;
        return SemCheck.containsEpsilon(r.r1) || SemCheck.containsEpsilon(r.r2);
      case 36:
      case 37:
      case 38:
      default:
        throw new Error('Unkown expression type ' + re.type + ' in ' + re);
      case 39:
      case 42:
      case 43:
        return false;
      case 40:
        return (<string>(<RegExp1>re).content).length <= 0;
      case 41:
        return SemCheck.containsEpsilon(SemCheck.macros.getDefinition(<string>(<RegExp1>re).content));
      case 44:
        r = <RegExp2>re;
        if (SemCheck.containsEpsilon(r.r1)) {
          return SemCheck.containsEpsilon(r.r2);
        } else {
          return false;
        }
    }
  }
  
  private static _first (re: RegExp): IntCharSet {
    let r: RegExp2;
    switch (re.type) {
      case 32:
      case 33:
      case 35:
        return SemCheck._first(<RegExp>(<RegExp1>re).content);
      case 34:
        r = <RegExp2>re;
        return SemCheck._first(r.r1).add(SemCheck._first(r.r2));
      case 36:
      case 37:
      case 38:
      default:
        throw new Error('Unkown expression type ' + re.type + ' in ' + re);
      case 39:
        return new IntCharSet((<JavaCharacter>(<RegExp1>re).content));
      case 40:
        const content = <string>(<RegExp1>re).content;
        if (content.length > 0) {
          return new IntCharSet(new JavaCharacter(content.charAt(0)));
        }
        
        return new IntCharSet();
      case 41:
        return SemCheck._first(SemCheck.macros.getDefinition(<string>(<RegExp1>re).content));
      case 42:
        return new IntCharSet(<JavaVector<Interval>>(<RegExp1>re).content);
      case 43:
        const all = new IntCharSet(new Interval(new JavaCharacter('\u0000'), new JavaCharacter(SemCheck.maxChar)));
        const set = new IntCharSet(<JavaVector<Interval>>(<RegExp1>re).content);
        all.sub(set);
        return all;
      case 44:
        r = <RegExp2>re;
        return SemCheck.containsEpsilon(r.r1) ? SemCheck._first(r.r1).add(SemCheck._first(r.r2)) : SemCheck._first(r.r1);
    }
  }
  
  private static _last (re: RegExp): IntCharSet {
    let r: RegExp2;
    switch (re.type) {
      case 32:
      case 33:
      case 35:
        return SemCheck._last(<RegExp>(<RegExp1>re).content);
      case 34:
        r = <RegExp2>re;
        return SemCheck._last(r.r1).add(SemCheck._last(r.r2));
      case 36:
      case 37:
      case 38:
      default:
        throw new Error('Unkown expression type ' + re.type + ' in ' + re);
      case 39:
        return new IntCharSet((<JavaCharacter>(<RegExp1>re).content));
      case 40:
        const content = <string>(<RegExp1>re).content;
        if (content.length > 0) {
          return new IntCharSet(new JavaCharacter(content.charAt(content.length - 1)));
        }
        
        return new IntCharSet();
      case 41:
        return SemCheck._last(SemCheck.macros.getDefinition(<string>(<RegExp1>re).content));
      case 42:
        return new IntCharSet(<JavaVector<Interval>>(<RegExp1>re).content);
      case 43:
        const all = new IntCharSet(new Interval(new JavaCharacter('\u0000'), new JavaCharacter(SemCheck.maxChar)));
        const set = new IntCharSet(<JavaVector<Interval>>(<RegExp1>re).content);
        all.sub(set);
        return all;
      case 44:
        r = <RegExp2>re;
        return SemCheck.containsEpsilon(r.r2) ? SemCheck._last(r.r1).add(SemCheck._last(r.r2)) : SemCheck._last(r.r2);
    }
  }
}
