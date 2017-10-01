import {JavaCharacter} from '../JavaCharacter';
import {LexScan} from './LexScan';
import {CharClasses} from './CharClasses';
import {RegExps} from './RegExps';
import {Macros} from './Macros';
import {Timer} from './Timer';
import {EOFActions} from './EOFActions';
import {LexParse} from './LexParse';
import {ErrorMessages} from './ErrorMessages';
import {Out} from './Out';
import {isLowerCase, isUpperCase} from 'tslint/lib/utils';
import {JavaVector} from '../JavaVector';
import {Interval} from './Interval';
import {RegExp1} from './RegExp1';
import {RegExp2} from './RegExp2';
import {RegExp} from './RegExp';
import {Symbol} from '../java_cup.runtime/Symbol';
import {NFA} from './NFA';
import {Options} from './Options';
import {SemCheck} from './SemCheck';
import {Action} from './Action';

export class LexParseActions {
  scanner: LexScan;
  charClasses: CharClasses;
  regExps: RegExps;
  macros: Macros;
  stateNumber: number;
  t: Timer;
  eofActions: EOFActions;
  private readonly parser: LexParse;
  
  constructor (parser: LexParse) {
    this.parser = parser;
  }
  
  fatalError (message: ErrorMessages, line?: number, col?: number) {
    if (!line) {
      this.fatalError(message, this.scanner.currentLine(), -1);
    } else {
      this.syntaxError(message, line, col);
      throw new Error('GeneratorException()');
    }
    
  }
  
  syntaxError (message: ErrorMessages, line?, col?) {
    if (line && col) {
      Out.error(message.toString(), line, col);
      return;
    }
    if (line) {
      Out.error(message.toString(), line, -1);
      return;
    }
    
    Out.error(message, this.scanner.currentLine(), -1);
  }
  
  public do_action (act_num, parser, stack: any[], top) {
    let result: Symbol;
    let RESULT;
    let closeleft;
    let num;
    let c;
    let i;
    let closeright;
    let n2right;
    let str = '';
    // let RESULT2: Interval;
    let list: JavaVector<any>;
    let s = '';
    let close;
    let var40;
    let e;
    let r;
    let b;
    // RegExp1 RESULT;
    // RegExp c;
    // Integer n1;
    // RegExp r2;
    // RegExp RESULT;
    // RegExp2 RESULT;
    // Boolean RESULT;
    // Integer RESULT;
    switch (act_num) {
      case 0:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        const start_val = <NFA>(<Symbol>stack[top - 1]).value;
        result = new Symbol(0, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, start_val);
        parser.done_parsing();
        return result;
      case 1:
        RESULT = null;
        this.scanner.t.stop();
        Out.checkErrors();
        Out.println(ErrorMessages.PARSING_TOOK + this.t.toString());
        this.macros.expand();
        const unused = this.macros.unused();
        unused.forEach((value: string) => {
          Out.warning('Macro "' + value + '" has been declared but never used.', -1, -1);
        });
        
        SemCheck.check(this.regExps, this.macros, JavaCharacter.toChar(this.charClasses.getMaxCharCode()), this.scanner.file);
        this.regExps.checkActions();
        Out.print('Constructing NFA : ');
        this.t.start();
        num = this.regExps.getNum();
        RESULT = new NFA(this.charClasses.getNumClasses(), this.scanner, this.regExps, this.macros, this.charClasses);
        this.eofActions.setNumLexStates(this.scanner.states.number());
        
        for (i = 0; i < num; ++i) {
          if (this.regExps.isEOF(i)) {
            this.eofActions.add(this.regExps.getStates(i), this.regExps.getAction(i));
          } else {
            RESULT.addRegExp(i);
          }
        }
        
        if (this.scanner.standalone) {
          RESULT.addStandaloneRule();
        }
        
        this.t.stop();
        // Out.time('');
        Out.print(ErrorMessages.NFA_TOOK + this.t.toString());
        result = new Symbol(4, (<Symbol>stack[top - 3]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 2:
        RESULT = null;
        this.fatalError(ErrorMessages.NO_LEX_SPEC);
        result = new Symbol(4, (<Symbol>stack[top - 0]).right, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 3:
        RESULT = null;
        result = new Symbol(1, (<Symbol>stack[top - 0]).right, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 4:
        RESULT = null;
        result = new Symbol(1, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 5:
        RESULT = null;
        result = new Symbol(1, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 6:
        RESULT = null;
        this.charClasses.setMaxCharCode(255);
        result = new Symbol(2, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 7:
        RESULT = null;
        this.charClasses.setMaxCharCode(65535);
        result = new Symbol(2, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 8:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 3]).left;
        num = (<Symbol>stack[top - 3]).right;
        str = <string>(<Symbol>stack[top - 3]).value;
        i = (<Symbol>stack[top - 1]).left;
        closeright = (<Symbol>stack[top - 1]).right;
        let r2 = <RegExp>(<Symbol>stack[top - 1]).value;
        this.macros.insert(str, r2);
        result = new Symbol(2, (<Symbol>stack[top - 3]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 9:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        close = (<Symbol>stack[top - 0]).value;
        this.syntaxError(ErrorMessages.REGEXP_EXPECTED, closeleft, num);
        result = new Symbol(2, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 10:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        let n1 = <number>(<Symbol>stack[top - 0]).value;
        list.addElement(n1);
        result = new Symbol(16, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 11:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 6]).left;
        num = (<Symbol>stack[top - 6]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 6]).value;
        i = (<Symbol>stack[top - 4]).left;
        closeright = (<Symbol>stack[top - 4]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 4]).value;
        i = (<Symbol>stack[top - 1]).left;
        n2right = (<Symbol>stack[top - 1]).right;
        const rlist2 = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        const rs = rlist2.data;
        rs.forEach((value: any) => {
          const elem = <number> value;
          this.regExps.addStates(elem, list);
          list.addElement(elem);
        });
        
        result = new Symbol(16, (<Symbol>stack[top - 6]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 12:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 4]).left;
        num = (<Symbol>stack[top - 4]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 4]).value;
        i = (<Symbol>stack[top - 1]).left;
        closeright = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        e = list.data;
        e.forEach((value: any) => {
          const elem = <number> value;
          this.regExps.addStates(elem, list);
        });
        
        result = new Symbol(16, (<Symbol>stack[top - 5]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 13:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        r = <number>(<Symbol>stack[top - 0]).value;
        RESULT = new JavaVector();
        RESULT.addElement(r);
        result = new Symbol(16, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 14:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 4]).left;
        num = (<Symbol>stack[top - 4]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 4]).value;
        i = (<Symbol>stack[top - 3]).left;
        closeright = (<Symbol>stack[top - 3]).right;
        const bol = <boolean>(<Symbol>stack[top - 3]).value;
        i = (<Symbol>stack[top - 2]).left;
        n2right = (<Symbol>stack[top - 2]).right;
        r = <RegExp>(<Symbol>stack[top - 2]).value;
        const lleft = (<Symbol>stack[top - 1]).left;
        const lright = (<Symbol>stack[top - 1]).right;
        const l = <RegExp>(<Symbol>stack[top - 1]).value;
        const aleft = (<Symbol>stack[top - 0]).left;
        const aright = (<Symbol>stack[top - 0]).right;
        let a = <Action>(<Symbol>stack[top - 0]).value;
        RESULT = this.regExps.insert(i, list, r, a, bol, l);
        result = new Symbol(3, (<Symbol>stack[top - 4]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 15:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 2]).left;
        num = (<Symbol>stack[top - 2]).right;
        list = <JavaVector<number>>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        a = <Action>(<Symbol>stack[top - 0]).value;
        RESULT = this.regExps.insert(null, list, null, a, null, null);
        result = new Symbol(3, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 16:
        RESULT = null;
        result = new Symbol(3, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 17:
        RESULT = null;
        RESULT = this.makeNL();
        result = new Symbol(10, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 18:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        result = new Symbol(10, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 19:
        RESULT = null;
        RESULT = null;
        result = new Symbol(10, (<Symbol>stack[top - 0]).right, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 20:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        RESULT = new RegExp2(44, c, this.makeNL());
        result = new Symbol(10, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 21:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        a = <Action>(<Symbol>stack[top - 0]).value;
        result = new Symbol(18, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, a);
        return result;
      case 22:
        RESULT = null;
        RESULT = null;
        result = new Symbol(18, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 23:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        result = new Symbol(13, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 24:
        RESULT = null;
        RESULT = new JavaVector();
        result = new Symbol(13, (<Symbol>stack[top - 0]).right, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 25:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 2]).left;
        num = (<Symbol>stack[top - 2]).right;
        str = <string>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 0]).value;
        this.stateNumber = this.scanner.states.getNumber(str);
        if (this.stateNumber != null) {
          list.addElement(this.stateNumber);
          result = new Symbol(12, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, list);
          return result;
        }
        
        throw new Error(ErrorMessages.LEXSTATE_UNDECL + closeleft + ' ' + num);
      case 26:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        str = <string>(<Symbol>stack[top - 0]).value;
        list = new JavaVector();
        this.stateNumber = this.scanner.states.getNumber(str);
        if (this.stateNumber != null) {
          list.addElement(this.stateNumber);
          result = new Symbol(12, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, list);
          return result;
        }
        
        throw new Error(ErrorMessages.LEXSTATE_UNDECL + closeleft + ' ' + num);
      case 27:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        close = (<Symbol>stack[top - 0]).value;
        this.syntaxError(ErrorMessages.REGEXP_EXPECTED, closeleft, num + 1);
        result = new Symbol(12, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 28:
        this.charClasses.makeClass('\n', false);
        RESULT = true;
        result = new Symbol(17, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 29:
        RESULT = false;
        result = new Symbol(17, (<Symbol>stack[top - 0]).right, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 30:
        closeleft = (<Symbol>stack[top - 2]).left;
        num = (<Symbol>stack[top - 2]).right;
        c = <RegExp>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        r2 = <RegExp>(<Symbol>stack[top - 0]).value;
        RESULT = new RegExp2(34, c, r2);
        result = new Symbol(5, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 31:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        result = new Symbol(5, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 32:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        close = (<Symbol>stack[top - 0]).value;
        this.syntaxError(ErrorMessages.REGEXP_EXPECTED, closeleft, num);
        result = new Symbol(5, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 33:
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        r2 = <RegExp>(<Symbol>stack[top - 0]).value;
        RESULT = new RegExp2(44, c, r2);
        result = new Symbol(6, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 34:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        result = new Symbol(6, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 35:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        result = new Symbol(7, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 36:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        RESULT = new RegExp1(37, c);
        result = new Symbol(7, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 37:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        RESULT = new RegExp1(38, c);
        result = new Symbol(7, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 38:
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        RESULT = new RegExp1(32, c);
        result = new Symbol(8, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 39:
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        RESULT = new RegExp1(33, c);
        result = new Symbol(8, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 40:
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        RESULT = new RegExp1(35, c);
        result = new Symbol(8, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 41:
        closeleft = (<Symbol>stack[top - 2]).left;
        num = (<Symbol>stack[top - 2]).right;
        c = <RegExp>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 1]).left;
        closeright = (<Symbol>stack[top - 1]).right;
        n1 = <number>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        n2right = (<Symbol>stack[top - 0]).right;
        b = (<Symbol>stack[top - 0]).value;
        RESULT = this.makeRepeat(c, n1, n1.valueOf(), i, n2right);
        result = new Symbol(8, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 42:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 3]).left;
        num = (<Symbol>stack[top - 3]).right;
        c = <RegExp>(<Symbol>stack[top - 3]).value;
        i = (<Symbol>stack[top - 2]).left;
        closeright = (<Symbol>stack[top - 2]).right;
        n1 = <number>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 1]).left;
        n2right = (<Symbol>stack[top - 1]).right;
        const n2 = <number>(<Symbol>stack[top - 1]).value;
        RESULT = this.makeRepeat(c, n1.valueOf(), n2.valueOf(), i, n2right);
        result = new Symbol(8, (<Symbol>stack[top - 3]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 43:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        c = <RegExp>(<Symbol>stack[top - 1]).value;
        result = new Symbol(8, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 44:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        str = <string>(<Symbol>stack[top - 0]).value;
        if (!this.scanner.macroDefinition && !this.macros.markUsed(str)) {
          throw new Error(ErrorMessages.MACRO_UNDECL + closeleft + num);
        }
        
        RESULT = new RegExp1(41, str);
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 45:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <RegExp>(<Symbol>stack[top - 0]).value;
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, c);
        return result;
      case 46:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 0]).value;
        
        try {
          this.charClasses.makeClass(list, false);
        } catch (var25) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, closeleft);
        }
        
        RESULT = new RegExp1(42, list);
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 47:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        str = <string>(<Symbol>stack[top - 0]).value;
        
        try {
          if (this.scanner.caseless) {
            this.charClasses.makeClass(str, true);
            RESULT = new RegExp1(45, str);
          } else {
            this.charClasses.makeClass(str, false);
            RESULT = new RegExp1(40, str);
          }
        } catch (var24) {
          this.syntaxError(ErrorMessages.CS2SMALL_STRING, closeleft, num);
        }
        
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 48:
        const temp = new JavaVector<Interval>();
        temp.addElement(new Interval(new JavaCharacter('\n'), new JavaCharacter('\n')));
        this.charClasses.makeClass('\n', false);
        RESULT = new RegExp1(43, temp);
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 49:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <JavaCharacter>(<Symbol>stack[top - 0]).value;
        
        try {
          if (this.scanner.caseless) {
            this.charClasses.makeClass(c.charValue(), true);
            RESULT = new RegExp1(46, c);
          } else {
            this.charClasses.makeClass(c.charValue(), false);
            RESULT = new RegExp1(39, c);
          }
        } catch (var23) {
          this.syntaxError(ErrorMessages.CS2SMALL_CHAR, closeleft, num);
        }
        
        result = new Symbol(8, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 50:
        RESULT = null;
        RESULT = new RegExp1(42, null);
        result = new Symbol(9, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 51:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        var40 = (<Symbol>stack[top - 0]).value;
        
        try {
          this.charClasses.makeClass(list, Options.jlex && this.scanner.caseless);
        } catch (var29) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, i, closeright);
        }
        
        RESULT = new RegExp1(42, list);
        result = new Symbol(9, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 52:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        close = (<Symbol>stack[top - 0]).value;
        list = new JavaVector();
        list.addElement(new Interval(new JavaCharacter('\u0000'), new JavaCharacter('\uffff')));
        
        try {
          this.charClasses.makeClass(list, false);
        } catch (var22) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, closeleft, num);
        }
        
        RESULT = new RegExp1(42, list);
        result = new Symbol(9, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 53:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        var40 = (<Symbol>stack[top - 0]).value;
        
        try {
          this.charClasses.makeClassNot(list, Options.jlex && this.scanner.caseless);
        } catch (var28) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, i, closeright);
        }
        
        RESULT = new RegExp1(43, list);
        result = new Symbol(9, (<Symbol>stack[top - 3]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 54:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        var40 = (<Symbol>stack[top - 0]).value;
        
        try {
          list.addElement(new Interval(new JavaCharacter('-'), new JavaCharacter('-')));
          this.charClasses.makeClass(list, Options.jlex && this.scanner.caseless);
        } catch (var27) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, i, closeright);
        }
        
        RESULT = new RegExp1(42, list);
        result = new Symbol(9, (<Symbol>stack[top - 3]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 55:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        var40 = (<Symbol>stack[top - 0]).value;
        
        try {
          list.addElement(new Interval(new JavaCharacter('-'), new JavaCharacter('-')));
          this.charClasses.makeClassNot(list, Options.jlex && this.scanner.caseless);
        } catch (var26) {
          this.syntaxError(ErrorMessages.CHARSET_2_SMALL, i, closeright);
        }
        
        RESULT = new RegExp1(43, list);
        result = new Symbol(9, (<Symbol>stack[top - 4]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 56:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        let elem = <Interval>(<Symbol>stack[top - 0]).value;
        list.addElement(elem);
        result = new Symbol(14, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 57:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        elem = <Interval>(<Symbol>stack[top - 0]).value;
        list = new JavaVector();
        list.addElement(elem);
        result = new Symbol(14, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 58:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 0]).value;
        e = list.data;
        e.forEach((value) => {
          list.addElement(value);
        });
        
        
        result = new Symbol(14, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 59:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 0]).value;
        result = new Symbol(14, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 60:
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        s = <string>(<Symbol>stack[top - 0]).value;
        
        for (i = 0; i < s.length; ++i) {
          list.addElement(new Interval(new JavaCharacter(s.charAt(i)), new JavaCharacter(s.charAt(i))));
        }
        
        result = new Symbol(14, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, list);
        return result;
      case 61:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        str = <string>(<Symbol>stack[top - 0]).value;
        RESULT = new JavaVector();
        
        for (i = 0; i < str.length; ++i) {
          RESULT.addElement(new Interval(new JavaCharacter(str.charAt(i)), new JavaCharacter(str.charAt(i))));
        }
        
        result = new Symbol(14, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 62:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 1]).left;
        num = (<Symbol>stack[top - 1]).right;
        list = <JavaVector<any>>(<Symbol>stack[top - 1]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        s = <string>(<Symbol>stack[top - 0]).value;
        this.syntaxError(ErrorMessages.CHARCLASS_MACRO, i, closeright);
        result = new Symbol(14, (<Symbol>stack[top - 1]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 63:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        str = <string>(<Symbol>stack[top - 0]).value;
        this.syntaxError(ErrorMessages.CHARCLASS_MACRO, closeleft, num);
        result = new Symbol(14, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 64:
        RESULT = null;
        closeleft = (<Symbol>stack[top - 2]).left;
        num = (<Symbol>stack[top - 2]).right;
        c = <JavaCharacter>(<Symbol>stack[top - 2]).value;
        i = (<Symbol>stack[top - 0]).left;
        closeright = (<Symbol>stack[top - 0]).right;
        const c2 = <JavaCharacter>(<Symbol>stack[top - 0]).value;
        RESULT = new Interval(c, c2);
        result = new Symbol(11, (<Symbol>stack[top - 2]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 65:
        closeleft = (<Symbol>stack[top - 0]).left;
        num = (<Symbol>stack[top - 0]).right;
        c = <JavaCharacter>(<Symbol>stack[top - 0]).value;
        RESULT = new Interval(c.charValue(), c.charValue());
        result = new Symbol(11, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 66:
        RESULT = this.makePreClass(19);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 67:
        RESULT = this.makePreClass(20);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 68:
        RESULT = this.makePreClass(21);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 69:
        RESULT = this.makePreClass(22);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 70:
        RESULT = this.makePreClass(23);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      case 71:
        RESULT = this.makePreClass(24);
        result = new Symbol(15, (<Symbol>stack[top - 0]).left, (<Symbol>stack[top - 0]).right, RESULT);
        return result;
      default:
        throw new Error('Invalid action number found in internal parse table');
    }
  }
  
  private check (type: number, c: string) {
    switch (type) {
      case 19:
        return JavaCharacter.isJavaIdentifierStart(c);
      case 20:
        return JavaCharacter.isJavaIdentifierPart(c);
      case 21:
        return JavaCharacter.isLetter(c);
      case 22:
        return JavaCharacter.isDigit(c);
      case 23:
        return isUpperCase(c);
      case 24:
        return isLowerCase(c);
      default:
        return false;
    }
  }
  
  private makePreClass (type) {
    const result = new JavaVector<Interval>();
    let c = 0;
    let start = 0;
    const last = this.charClasses.getMaxCharCode();
    let prev = this.check(type, '\u0000');
    
    let current;
    for (c = 1; c < last; ++c) {
      current = this.check(type, JavaCharacter.toChar(c));
      if (!prev && current) {
        start = c;
      }
      
      if (prev && !current) {
        result.addElement(new Interval(new JavaCharacter(start), new JavaCharacter(c - 1)));
      }
      
      prev = current;
    }
    
    current = this.check(type, JavaCharacter.toChar(c));
    if (!prev && current) {
      result.addElement(new Interval(new JavaCharacter(c), new JavaCharacter(c)));
    }
    
    if (prev && current) {
      result.addElement(new Interval(new JavaCharacter(start), new JavaCharacter(c)));
    }
    
    if (prev && !current) {
      result.addElement(new Interval(new JavaCharacter(start), new JavaCharacter(c - 1)));
    }
    
    return result;
  }
  
  private makeRepeat (r: RegExps, n1: number, n2: number, line: number, col: number): RegExp {
    if (n1 <= 0 && n2 <= 0) {
      this.syntaxError(ErrorMessages.REPEAT_ZERO, line, col);
      return null;
    } else if (n1 > n2) {
      this.syntaxError(ErrorMessages.REPEAT_GREATER, line, col);
      return null;
    } else {
      let result;
      if (n1 > 0) {
        result = r;
        --n1;
        --n2;
      } else {
        result = new RegExp1(35, r);
        --n2;
      }
      
      for (let i = 0; i < n1; ++i) {
        result = new RegExp2(44, <RegExp>result, r);
      }
      
      n2 -= n1;
      
      for (let i = 0; i < n2; ++i) {
        result = new RegExp2(44, <RegExp>result, new RegExp1(35, r));
      }
      
      return <RegExp>result;
    }
  }
  
  private makeNL (): RegExp {
    const list = new JavaVector<Interval>();
    list.addElement(new Interval(new JavaCharacter('\n'), new JavaCharacter('\r')));
    list.addElement(new Interval(new JavaCharacter('\u0085'), new JavaCharacter('\u0085')));
    list.addElement(new Interval(new JavaCharacter('\u2028'), new JavaCharacter('\u2029')));
    this.charClasses.makeClass(list, false);
    this.charClasses.makeClass('\n', false);
    this.charClasses.makeClass('\r', false);
    const c = new RegExp1(42, list);
    const n = new JavaCharacter('\n');
    const r = new JavaCharacter('\r');
    return new RegExp2(34, c, new RegExp2(44, new RegExp1(39, r), new RegExp1(39, n)));
  }
}
