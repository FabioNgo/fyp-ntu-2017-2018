import {Action} from './Action';
import {StateSet} from './StateSet';
import {StateSetEnumerator} from './StateSetEnumerator';
import {Out} from './Out';
import {isNullOrUndefined, isNumber, isUndefined} from 'util';
import {JavaVector} from '../JavaVector';
import {Options} from './Options';
import {JavaCharacter} from '../JavaCharacter';
import {CharClasses} from './CharClasses';
import {Macros} from './Macros';
import {LexScan} from './LexScan';
import {RegExps} from './RegExps';
import {IntPair} from './IntPair';
import {Interval} from './Interval';
import {IntCharSet} from './IntCharSet';
import {RegExp, RegExp1, RegExp2} from './RegExp';
import {DFA} from './DFA';

export class NFA {
  private static states = new StateSetEnumerator();
  private static tempStateSet = new StateSet();
  table: StateSet[][];
  epsilon: StateSet[];
  isFinal: boolean[];
  isPushback: boolean[];
  action: Action[];
  numStates: number;
  numInput = 0;
  numLexStates = 0;
  estSize = 0;
  macros: Macros;
  classes: CharClasses;
  scanner: LexScan;
  regExps: RegExps;
  private live: boolean[];
  private visited: boolean[];
  private _end = 0;
  private _dfaStates: JavaVector<any>;
  private _dfaStart = 0;
  
  public constructor (numInput, estSize?, regExps?, macros?, classes?) {
    if (!regExps) {
      this.estSize = 256;
      this.numInput = numInput;
      this.estSize = estSize;
      this.numStates = 0;
      this.epsilon = new Array(estSize);
      this.action = new Array(estSize);
      this.isFinal = new Array(estSize);
      this.isPushback = new Array(estSize);
      this.table = [];
      for (let i = 0; i < estSize; i++) {
        this.table[i] = [];
      }
    } else {
      const scanner = <LexScan>estSize;
      this.constructor(numInput, regExps.NFASize(macros) + 2 * scanner.states.number());
      
      this.estSize = regExps.NFASize(macros) + 2 * scanner.states.number();
      this.scanner = scanner;
      this.regExps = regExps;
      this.macros = macros;
      this.classes = classes;
      this.numLexStates = scanner.states.number();
      this.numStates = 2 * this.numLexStates;
    }
    
  }
  
  public addStandaloneRule () {
    const start = this.numStates;
    const end = this.numStates + 1;
    
    for (let c = 0; c < this.classes.getNumClasses(); ++c) {
      this.addTransition(start, c, end);
    }
    
    for (let i = 0; i < this.numLexStates * 2; ++i) {
      this.addEpsilonTransition(i, start);
    }
    
    this.action[end] = new Action('System.out.print(yytext());', 2147483647);
    this.isFinal[end] = true;
  }
  
  public addRegExp (regExpNum) {
    const nfa = this.insertNFA(this.regExps.getRegExp(regExpNum));
    let lexStates = this.regExps.getStates(regExpNum).data;
    
    if (lexStates.length === 0) {
      lexStates = this.scanner.states.getInclusiveStates();
    }
    
    let stateNum;
    lexStates.forEach((value: number, index) => {
      stateNum = value;
      if (!this.regExps.isBOL(regExpNum)) {
        this.addEpsilonTransition(2 * stateNum, nfa.start);
      }
      this.addEpsilonTransition(2 * stateNum + 1, nfa.start);
    });
    
    if (this.regExps.getLookAhead(regExpNum) != null) {
      const look = this.insertNFA(this.regExps.getLookAhead(regExpNum));
      this.addEpsilonTransition(nfa.end, look.start);
      const a = this.regExps.getAction(regExpNum);
      a.setLookAction(true);
      this.isPushback[nfa.end] = true;
      this.action[look.end] = a;
      this.isFinal[look.end] = true;
    } else {
      this.action[nfa.end] = this.regExps.getAction(regExpNum);
      this.isFinal[nfa.end] = true;
    }
    
  }
  
  public addTransition (start, input, dest) {
    // Out.debug('Adding transition (' + start + ', ' + input + ', ' + dest + ')', -1, -1);
    const maxS = Math.max(start, dest) + 1;
    if (maxS > this.numStates) {
      this.numStates = maxS;
    }
  
    if (!isUndefined(this.table[start][input])) {
      this.table[start][input].addState(dest);
    } else {
      this.table[start][input] = new StateSet(dest);
    }
    
  }
  
  public addEpsilonTransition (start, dest) {
    const max = Math.max(start, dest) + 1;
    if (max > this.numStates) {
      this.numStates = max;
    }
  
    if (!isNullOrUndefined(this.epsilon[start])) {
      this.epsilon[start].addState(dest);
    } else {
      this.epsilon[start] = new StateSet(this.estSize, dest);
    }
    
  }
  
  public getDFA () {
    const dfaStates = new Map<StateSet, any>();
    const dfaVector = new JavaVector<any>();
    const dfa = new DFA(2 * this.numLexStates, this.numInput);
    let numDFAStates = 0;
    Out.println('Converting NFA to DFA : ');
    this.epsilonFill();
    
    let newState;
    for (let i = 0; i < 2 * this.numLexStates; ++i) {
      newState = this.epsilon[i];
      dfaStates.set(newState, numDFAStates);
      dfaVector.addElement(newState);
      dfa.setLexState(i, numDFAStates);
      dfa.setFinal(numDFAStates, this.containsFinal(newState));
      dfa.setPushback(numDFAStates, this.containsPushback(newState));
      dfa.setAction(numDFAStates, this.getAction(newState));
      ++numDFAStates;
    }
    
    --numDFAStates;
    let currentDFAState = 0;
    const tempStateSet = NFA.tempStateSet;
    const states = NFA.states;
    
    for (newState = new StateSet(this.numStates); currentDFAState <= numDFAStates; ++currentDFAState) {
      const currentState = <StateSet> dfaVector.elementAt(currentDFAState);
      
      for (let input = 0; input < this.numInput; ++input) {
        tempStateSet.clear();
        states.reset(currentState);
        
        while (states.hasMoreElements()) {
          tempStateSet.add(this.table[states.nextElement()][input]);
        }
        
        newState.copy(tempStateSet);
        states.reset(tempStateSet);
        
        while (states.hasMoreElements()) {
          newState.add(this.epsilon[states.nextElement()]);
        }
        
        if (newState.containsElements()) {
          const nextDFAState = dfaStates.get(newState);
          if (!isUndefined(nextDFAState)) {
            dfa.addTransition(currentDFAState, input, nextDFAState.intValue());
          } else {
            if (Options.progress) {
              Out.print('.');
            }
            
            ++numDFAStates;
            const storeState = new StateSet(newState);
            dfaStates.set(storeState, numDFAStates);
            dfaVector.addElement(storeState);
            dfa.addTransition(currentDFAState, input, numDFAStates);
            dfa.setFinal(numDFAStates, this.containsFinal(storeState));
            dfa.setPushback(numDFAStates, this.containsPushback(storeState));
            dfa.setAction(numDFAStates, this.getAction(storeState));
          }
        }
      }
    }
    
    if (Options.verbose) {
      Out.println('');
    }
    
    return dfa;
  }
  
  public dumpTable () {
    Out.println(this.toString());
  }
  
  public toString () {
    
    let result = '';
    for (let i = 0; i < this.numStates; ++i) {
      result += ('State');
      if (this.isFinal[i]) {
        result += ('[FINAL]');
      }
      
      if (this.isPushback[i]) {
        result += (' [PUSHBACK]');
      }
      
      result += (' ' + i + Out.NL);
      
      for (let input = 0; input < this.numInput; ++input) {
        if (this.table[i][input] != null && this.table[i][input].containsElements()) {
          result += ('  with ' + input + ' in ' + this.table[i][input] + Out.NL);
        }
      }
      
      if (this.epsilon[i] != null && this.epsilon[i].containsElements()) {
        result += ('  with epsilon in ' + this.epsilon[i] + Out.NL);
      }
    }
    
    return result.toString();
  }
  
  private containsFinal (set) {
    NFA.states.reset(set);
    
    while (NFA.states.hasMoreElements()) {
      if (this.isFinal[NFA.states.nextElement()]) {
        return true;
      }
    }
    
    return false;
  }
  
  private containsPushback (set) {
    NFA.states.reset(set);
    
    while (NFA.states.hasMoreElements()) {
      if (this.isPushback[NFA.states.nextElement()]) {
        return true;
      }
    }
    
    return false;
  }
  
  private getAction (set) {
    NFA.states.reset(set);
    let maxAction: Action;
    Out.println('Determining action of : ' + set);
    
    while (NFA.states.hasMoreElements()) {
      const currentAction = this.action[NFA.states.nextElement()];
      if (!isUndefined(currentAction)) {
        if (isUndefined(maxAction)) {
          maxAction = currentAction;
        } else {
          maxAction = maxAction.getHigherPriority(currentAction);
        }
      }
    }
    
    return maxAction;
  }
  
  private closure (startState) {
    if (startState instanceof StateSet) {
      const startStates = startState;
      const result = new StateSet(this.numStates);
      if (!isUndefined(startStates)) {
        NFA.states.reset(startStates);
        
        while (NFA.states.hasMoreElements()) {
          result.add(this.closure(NFA.states.nextElement()));
        }
      }
      
      return result;
    }
    if (isNumber(startState)) {
      const notvisited = NFA.tempStateSet;
      const closure = new StateSet(this.numStates, startState);
      notvisited.clear();
      notvisited.addState(startState);
      
      while (notvisited.containsElements()) {
        const state = notvisited.getAndRemoveElement();
        notvisited.add(closure.complement(this.epsilon[state]));
        closure.add(this.epsilon[state]);
      }
      
      return closure;
    }
    
  }
  
  private epsilonFill () {
    for (let i = 0; i < this.numStates; ++i) {
      this.epsilon[i] = this.closure(i);
    }
    
  }
  
  private DFAEdge (start, input) {
    NFA.tempStateSet.clear();
    NFA.states.reset(start);
    
    while (NFA.states.hasMoreElements()) {
      NFA.tempStateSet.add(this.table[NFA.states.nextElement()][input]);
    }
    
    const result = new StateSet(NFA.tempStateSet);
    NFA.states.reset(NFA.tempStateSet);
    
    while (NFA.states.hasMoreElements()) {
      result.add(this.epsilon[NFA.states.nextElement()]);
    }
    
    return result;
  }
  
  private insertLetterNFA (caseless, letter, start, end) {
    if (caseless) {
      const lower = this.classes.getClassCode(JavaCharacter.toLowerCase(letter));
      const upper = this.classes.getClassCode(JavaCharacter.toUpperCase(letter));
      this.addTransition(start, lower, end);
      if (upper !== lower) {
        this.addTransition(start, upper, end);
      }
    } else {
      this.addTransition(start, this.classes.getClassCode(new JavaCharacter(letter)), end);
    }
    
  }
  
  private insertStringNFA (caseless, letters) {
    const start = this.numStates;
    
    let i;
    for (i = 0; i < letters.length; ++i) {
      if (caseless) {
        const c = letters.charAt(i);
        const lower = this.classes.getClassCode(JavaCharacter.toLowerCase(c));
        const upper = this.classes.getClassCode(JavaCharacter.toUpperCase(c));
        this.addTransition(i + start, lower, i + start + 1);
        if (upper !== lower) {
          this.addTransition(i + start, upper, i + start + 1);
        }
      } else {
        this.addTransition(i + start, this.classes.getClassCode(new JavaCharacter(letters.charAt(i))), i + start + 1);
      }
    }
    
    return new IntPair(start, i + start);
  }
  
  private insertClassNFA (intervals: JavaVector<Interval>, start, end) {
    if (intervals != null) {
      const cl = this.classes.getClassCodes(new IntCharSet(intervals));
      
      for (let i = 0; i < cl.length; ++i) {
        this.addTransition(start, cl[i], end);
      }
      
    }
  }
  
  private insertNotClassNFA (intervals: JavaVector<Interval>, start, end) {
    const cl = this.classes.getNotClassCodes(intervals);
    
    for (let i = 0; i < cl.length; ++i) {
      this.addTransition(start, cl[i], end);
    }
    
  }
  
  private complement (nfa: IntPair) {
    const dfaStart = nfa.end + 1;
    this.epsilonFill();
    const dfaStates = new Map<StateSet, number>();
    const dfaVector = new JavaVector<any>();
    let numDFAStates = 0;
    let newState = this.epsilon[nfa.start];
    dfaStates.set(newState, numDFAStates);
    dfaVector.addElement(newState);
    
    let currentState;
    let currentDFAState;
    for (currentDFAState = 0; currentDFAState <= numDFAStates; ++currentDFAState) {
      currentState = (StateSet);
      dfaVector.elementAt(currentDFAState);
      
      for (let input = 0; input < this.numInput; ++input) {
        newState = this.DFAEdge(currentState, input);
        if (newState.containsElements()) {
          const nextDFAState = dfaStates.get(newState);
          if (nextDFAState != null) {
            this.addTransition(dfaStart + currentDFAState, input, dfaStart + nextDFAState);
          } else {
            if (Options.dump) {
              Out.print('+');
            }
            
            ++numDFAStates;
            dfaStates.set(newState, numDFAStates);
            dfaVector.addElement(newState);
            this.addTransition(dfaStart + currentDFAState, input, dfaStart + numDFAStates);
          }
        }
      }
    }
    
    const start = dfaStart + numDFAStates + 1;
    const error = dfaStart + numDFAStates + 2;
    const end = dfaStart + numDFAStates + 3;
    this.addEpsilonTransition(start, dfaStart);
    
    for (let i = 0; i < this.numInput; ++i) {
      this.addTransition(error, i, error);
    }
    
    this.addEpsilonTransition(error, end);
    
    for (let s = 0; s <= numDFAStates; ++s) {
      currentState = (StateSet);
      dfaVector.elementAt(s);
      currentDFAState = dfaStart + s;
      if (!currentState.isElement(nfa.end)) {
        this.addEpsilonTransition(currentDFAState, end);
      }
      
      for (let i = 0; i < this.numInput; ++i) {
        if (isUndefined(this.table[currentDFAState][i])) {
          this.addTransition(currentDFAState, i, error);
        }
      }
    }
  
    if (isUndefined(this.live) || this.live.length < this.numStates) {
      this.live = [];
      this.visited = [];
    }
    
    this._end = end;
    this._dfaStates = dfaVector;
    this._dfaStart = dfaStart;
    this.removeDead(dfaStart);
    return new IntPair(start, end);
  }
  
  private removeDead (start) {
    if (!this.visited[start] && !this.live[start]) {
      this.visited[start] = true;
      if (this.closure(start).isElement(this._end)) {
        this.live[start] = true;
      }
      
      let nextState;
      let states;
      let next;
      for (let i = 0; i < this.numInput; ++i) {
        nextState = this.closure(this.table[start][i]);
        states = nextState.states();
        
        while (states.hasMoreElements()) {
          next = states.nextElement();
          if (next !== start) {
            this.removeDead(next);
            if (this.live[next]) {
              this.live[start] = true;
            } else {
              this.table[start][i] = null;
            }
          }
        }
      }
      
      nextState = this.closure(this.epsilon[start]);
      states = nextState.states();
      
      while (states.hasMoreElements()) {
        next = states.nextElement();
        if (next !== start) {
          this.removeDead(next);
          if (this.live[next]) {
            this.live[start] = true;
          }
        }
      }
      
    }
  }
  
  private insertNFA (regExp: RegExp, start?, end?) {
    if (start && end) {
      let r;
      if (regExp instanceof RegExp2) {
        r = <RegExp2> regExp;
      }
      switch (regExp.type) {
        case 34:
          this.insertNFA(r.r1, start, end);
          this.insertNFA(r.r2, start, end);
          return;
        case 35:
        case 36:
        case 37:
        case 38:
        case 40:
        case 44:
        case 45:
        default:
          throw new Error('Unknown expression type ' + regExp.type + ' in NFA construction');
        case 39:
          this.insertLetterNFA(false, (<JavaCharacter>(<RegExp1>regExp).content).value, start, end);
          return;
        case 41:
          this.insertNFA(this.macros.getDefinition((<RegExp1>regExp).content), start, end);
          return;
        case 42:
          this.insertClassNFA(<JavaVector<Interval>>(<RegExp1>regExp).content, start, end);
          return;
        case 43:
          this.insertNotClassNFA(<JavaVector<Interval>>(<RegExp1>regExp).content, start, end);
          return;
        case 46:
          this.insertLetterNFA(true, (<JavaCharacter>(<RegExp1>regExp).content).value, start, end);
      }
    } else {
      if (regExp.isCharClass(this.macros)) {
        start = this.numStates;
        end = this.numStates + 1;
        
        if (end + 1 > this.numStates) {
          this.numStates = end + 1;
        }
        
        this.insertNFA(regExp, start, end);
        return new IntPair(start, end);
      } else {
        let nfa1;
        let nfa2;
        let r;
        switch (regExp.type) {
          case 32:
            nfa1 = this.insertNFA(<RegExp>((<RegExp1>regExp).content));
            start = nfa1.end + 1;
            end = nfa1.end + 2;
            this.addEpsilonTransition(nfa1.end, end);
            this.addEpsilonTransition(start, nfa1.start);
            this.addEpsilonTransition(start, end);
            this.addEpsilonTransition(nfa1.end, nfa1.start);
            return new IntPair(start, end);
          case 33:
            nfa1 = this.insertNFA(<RegExp>(<RegExp1>regExp).content);
            start = nfa1.end + 1;
            end = nfa1.end + 2;
            this.addEpsilonTransition(nfa1.end, end);
            this.addEpsilonTransition(start, nfa1.start);
            this.addEpsilonTransition(nfa1.end, nfa1.start);
            return new IntPair(start, end);
          case 34:
            r = <RegExp2> regExp;
            nfa1 = this.insertNFA(r.r1);
            nfa2 = this.insertNFA(r.r2);
            start = nfa2.end + 1;
            end = nfa2.end + 2;
            this.addEpsilonTransition(start, nfa1.start);
            this.addEpsilonTransition(start, nfa2.start);
            this.addEpsilonTransition(nfa1.end, end);
            this.addEpsilonTransition(nfa2.end, end);
            return new IntPair(start, end);
          case 35:
            nfa1 = this.insertNFA(<RegExp>(<RegExp1>regExp).content);
            this.addEpsilonTransition(nfa1.start, nfa1.end);
            return new IntPair(nfa1.start, nfa1.end);
          case 36:
          case 39:
          case 42:
          case 43:
          default:
            throw new Error('Unknown expression type ' + regExp.type + ' in NFA construction');
          case 37:
            return this.complement(this.insertNFA(<RegExp>(<RegExp1>regExp).content));
          case 38:
            nfa1 = this.insertNFA(<RegExp>(<RegExp1>regExp).content);
            start = nfa1.end + 1;
            const s1 = start + 1;
            const s2 = s1 + 1;
            end = s2 + 1;
            
            for (let i = 0; i < this.numInput; ++i) {
              this.addTransition(s1, i, s1);
              this.addTransition(s2, i, s2);
            }
            
            this.addEpsilonTransition(start, s1);
            this.addEpsilonTransition(s1, nfa1.start);
            this.addEpsilonTransition(nfa1.end, s2);
            this.addEpsilonTransition(s2, end);
            nfa1 = this.complement(new IntPair(start, end));
            nfa2 = this.insertNFA(<RegExp>(<RegExp1>regExp).content);
            this.addEpsilonTransition(nfa1.end, nfa2.start);
            return new IntPair(nfa1.start, nfa2.end);
          case 40:
            return this.insertStringNFA(false, <string>(<RegExp1>regExp).content);
          case 41:
            return this.insertNFA(this.macros.getDefinition(<string>(<RegExp1>regExp).content));
          case 44:
            r = <RegExp2> regExp;
            nfa1 = this.insertNFA(r.r1);
            nfa2 = this.insertNFA(r.r2);
            this.addEpsilonTransition(nfa1.end, nfa2.start);
            return new IntPair(nfa1.start, nfa2.end);
          case 45:
            return this.insertStringNFA(true, <string>(<RegExp1>regExp).content);
        }
      }
    }
    
  }
}
