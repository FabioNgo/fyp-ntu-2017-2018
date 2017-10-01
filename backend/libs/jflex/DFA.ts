import {Action} from './Action';
import {Out} from './Out';
import {Options} from './Options';
import {LexScan} from './LexScan';
import {LexParse} from './LexParse';
import {ErrorMessages} from './ErrorMessages';
import {StatePairList} from './StatePairList';


export class DFA {
  public static readonly NO_TARGET = -1;
  private static readonly STATES = 500;
  table: number[][];
  isFinal: boolean[];
  isPushback: boolean[];
  isLookEnd: boolean[];
  action: Action[];
  lexState: number[];
  numStates: number;
  numInput: number;
  usedActions: Map<any, any>;
  
  public constructor (numLexStates, numInp) {
    this.numInput = numInp;
    const statesNeeded = Math.max(numLexStates, 500);
    this.table = [];
    this.action = [];
    this.isFinal = [];
    this.isPushback = [];
    this.isLookEnd = [];
    this.lexState = [];
    this.numStates = 0;
    
    for (let i = 0; i < statesNeeded; ++i) {
      for (let j = 0; j < this.numInput; ++j) {
        this.table[i][j] = -1;
      }
    }
    
  }
  
  public setLexState (lState, trueState) {
    this.lexState[lState] = trueState;
  }
  
  
  public setAction (state, stateAction) {
    this.action[state] = stateAction;
    if (stateAction !== null) {
      this.isLookEnd[state] = stateAction.isLookAction();
      this.usedActions.set(stateAction, stateAction);
    }
    
  }
  
  public setFinal (state, isFinalState) {
    this.isFinal[state] = isFinalState;
  }
  
  public setPushback (state, isPushbackState) {
    this.isPushback[state] = isPushbackState;
  }
  
  public addTransition (start, input, dest) {
    const max = Math.max(start, dest) + 1;
    if (max > this.numStates) {
      this.numStates = max;
    }
    
    this.table[start][input] = dest;
  }
  
  public toString (a?) {
    if (a) {
      let r = '{';
      
      let i;
      for (i = 0; i < a.length - 1; ++i) {
        r = r + a[i] + ',';
      }
      
      return r + a[i] + '}';
    } else {
      let result = '';
      
      for (let i = 0; i < this.numStates; ++i) {
        result += ('State ');
        if (this.isFinal[i]) {
          result += ('[FINAL] ');
        }
        
        if (this.isPushback[i]) {
          result += ('[PUSH] ');
        }
        
        result += (i + ':' + Out.NL);
        
        for (let j = 0; j < this.numInput; ++j) {
          if (this.table[i][j] >= 0) {
            result += ('  with ' + j + ' in ' + this.table[i][j] + Out.NL);
          }
        }
      }
      
      return result.toString();
    }
    
  }
  
  
  public checkActions (scanner: LexScan, parser: LexParse) {
    const eofActions = parser.getEOFActions();
    scanner.actions.data.forEach((action: Action, index: number) => {
      if (!action.equals(this.usedActions.get(action)) && !eofActions.isEOFAction(action)) {
        Out.warning(ErrorMessages.NEVER_MATCH.toString(), action.priority - 1, -1);
      }
    });
    
  }
  
  public minimize () {
    Out.print(this.numStates + ' states before minimization, ');
    if (this.numStates === 0) {
      Out.error(ErrorMessages.ZERO_STATES, -1, -1);
      
    } else if (Options.no_minimize) {
      Out.println('minimization skipped.');
    } else {
      const n = this.numStates + 1;
      const block = [];
      const b_forward = [];
      const b_backward = [];
      let lastBlock: number;
      const b0 = n;
      const l_forward = [];
      const l_backward = [];
      const anchorL = n * this.numInput;
      const inv_delta = [];
      const inv_delta_set = [];
      const twin = [];
      const SD = [];
      const D = [];
      let lastDelta = 0;
      const inv_lists = [];
      const inv_list_last = [];
      
      let s;
      let B_max;
      let B_i;
      let index;
      let last;
      for (let c = 0; c < this.numInput; ++c) {
        for (s = 0; s < n; ++s) {
          inv_list_last[s] = -1;
          inv_delta[s][c] = -1;
        }
        
        inv_delta[0][c] = 0;
        inv_list_last[0] = 0;
        
        for (B_max = 1; B_max < n; ++B_max) {
          B_i = this.table[B_max - 1][c] + 1;
          if (inv_list_last[B_i] === -1) {
            inv_delta[B_i][c] = B_max;
            inv_list_last[B_i] = B_max;
          } else {
            inv_lists[inv_list_last[B_i]] = B_max;
            inv_list_last[B_i] = B_max;
          }
        }
        
        for (B_i = 0; B_i < n; ++B_i) {
          index = inv_delta[B_i][c];
          inv_delta[B_i][c] = lastDelta;
          last = inv_list_last[B_i];
          
          for (let go_on = index !== -1; go_on; index = inv_lists[index]) {
            go_on = index !== last;
            inv_delta_set[lastDelta++] = index;
          }
          
          inv_delta_set[lastDelta++] = -1;
        }
      }
      
      b_forward[n] = 0;
      b_backward[n] = 0;
      b_forward[0] = n;
      b_backward[0] = n;
      block[0] = n;
      block[n] = 1;
      
      for (s = 1; s < n; ++s) {
        B_max = b0 + 1;
        
        let found = false;
        for (found = false; !found && B_max <= lastBlock; ++B_max) {
          index = b_forward[B_max];
          found = this.isPushback[s - 1] === this.isPushback[index - 1] && this.isLookEnd[s - 1] === this.isLookEnd[index - 1];
          if (found) {
            if (this.isFinal[s - 1]) {
              found = this.isFinal[index - 1] && this.action[s - 1].isEquiv(this.action[index - 1]);
            } else {
              found = !this.isFinal[index - 1];
            }
            
            if (found) {
              block[s] = B_max;
              ++block[B_max];
              last = b_backward[B_max];
              b_forward[last] = s;
              b_forward[s] = B_max;
              b_backward[B_max] = s;
              b_backward[s] = last;
            }
          }
        }
        
        if (!found) {
          block[s] = B_max;
          ++block[B_max];
          b_forward[B_max] = s;
          b_forward[s] = B_max;
          b_backward[B_max] = s;
          b_backward[s] = B_max;
          ++lastBlock;
        }
      }
      
      B_max = b0;
      
      for (B_i = b0 + 1; B_i <= lastBlock; ++B_i) {
        if (block[B_max] < block[B_i]) {
          B_max = B_i;
        }
      }
      
      l_forward[anchorL] = anchorL;
      l_backward[anchorL] = anchorL;
      if (B_max === b0) {
        B_i = b0 + 1;
      } else {
        B_i = b0;
      }
      
      for (index = (B_i - b0) * this.numInput; index < (B_i + 1 - b0) * this.numInput; l_backward[anchorL] = index++) {
        last = l_backward[anchorL];
        l_forward[last] = index;
        l_forward[index] = anchorL;
        l_backward[index] = last;
      }
      
      for (; B_i <= lastBlock; ++B_i) {
        if (B_i !== B_max) {
          for (index = (B_i - b0) * this.numInput; index < (B_i + 1 - b0) * this.numInput; l_backward[anchorL] = index++) {
            last = l_backward[anchorL];
            l_forward[last] = index;
            l_forward[index] = anchorL;
            l_backward[index] = last;
          }
        }
      }
      
      
      let min_s;
      let i;
      let j;
      let B_k;
      while (l_forward[anchorL] !== anchorL) {
        last = l_forward[anchorL];
        l_forward[anchorL] = l_forward[last];
        l_backward[l_forward[anchorL]] = anchorL;
        l_forward[last] = 0;
        const B_j = b0 + last / this.numInput;
        const a = last % this.numInput;
        let numD = 0;
        
        for (s = b_forward[B_j]; s !== B_j; s = b_forward[s]) {
          for (s = inv_delta[s][a]; inv_delta_set[s] !== -1; D[numD++] = inv_delta_set[s++]) {
          
          }
        }
        
        let numSplit = 0;
        
        for (s = 0; s < numD; ++s) {
          s = D[s];
          B_i = block[s];
          SD[B_i] = -1;
          twin[B_i] = 0;
        }
        
        for (min_s = 0; min_s < numD; ++min_s) {
          s = D[min_s];
          B_i = block[s];
          if (SD[B_i] < 0) {
            SD[B_i] = 0;
            
            for (i = b_forward[B_i]; i !== B_i && (i !== 0 || block[0] === B_j) && (i === 0 || block[this.table[i - 1][a] + 1] === B_j); i = b_forward[i]) {
              ++SD[B_i];
            }
          }
        }
        
        for (i = 0; i < numD; ++i) {
          s = D[i];
          B_i = block[s];
          if (SD[B_i] !== block[B_i]) {
            j = twin[B_i];
            if (j === 0) {
              ++lastBlock;
              j = lastBlock;
              b_forward[lastBlock] = lastBlock;
              b_backward[lastBlock] = lastBlock;
              twin[B_i] = lastBlock;
              twin[numSplit++] = B_i;
            }
            
            b_forward[b_backward[s]] = b_forward[s];
            b_backward[b_forward[s]] = b_backward[s];
            B_k = b_backward[j];
            b_forward[B_k] = s;
            b_forward[s] = j;
            b_backward[s] = B_k;
            b_backward[j] = s;
            block[s] = j;
            ++block[j];
            --block[B_i];
            --SD[B_i];
          }
        }
        
        for (j = 0; j < numSplit; ++j) {
          B_i = twin[j];
          B_k = twin[B_i];
          
          for (let c = 0; c < this.numInput; ++c) {
            const B_i_c = (B_i - b0) * this.numInput + c;
            const B_k_c = (B_k - b0) * this.numInput + c;
            
            if (l_forward[B_i_c] > 0) {
              last = l_backward[anchorL];
              l_backward[anchorL] = B_k_c;
              l_forward[last] = B_k_c;
              l_backward[B_k_c] = last;
              l_forward[B_k_c] = anchorL;
            } else if (block[B_i] <= block[B_k]) {
              last = l_backward[anchorL];
              l_backward[anchorL] = B_i_c;
              l_forward[last] = B_i_c;
              l_backward[B_i_c] = last;
              l_forward[B_i_c] = anchorL;
            } else {
              last = l_backward[anchorL];
              l_backward[anchorL] = B_k_c;
              l_forward[last] = B_k_c;
              l_backward[B_k_c] = last;
              l_forward[B_k_c] = anchorL;
            }
          }
        }
      }
      
      const trans = [];
      const kill = [];
      const move = [];
      
      for (s = b0 + 1; s <= lastBlock; ++s) {
        s = b_forward[s];
        
        for (min_s = s; s !== s; s = b_forward[s]) {
          if (min_s > s) {
            min_s = s;
          }
        }
        
        --min_s;
        
        for (s = b_forward[s] - 1; s !== s - 1; s = b_forward[s + 1] - 1) {
          trans[s] = min_s;
          kill[s] = s !== min_s;
        }
      }
      
      s = 0;
      
      for (min_s = 0; min_s < this.numStates; ++min_s) {
        if (kill[min_s]) {
          ++s;
        } else {
          move[min_s] = s;
        }
      }
      
      i = 0;
      
      for (j = 0; i < this.numStates; ++i) {
        if (!kill[i]) {
          for (B_k = 0; B_k < this.numInput; ++B_k) {
            if (this.table[i][B_k] >= 0) {
              this.table[j][B_k] = trans[this.table[i][B_k]];
              this.table[j][B_k] -= move[this.table[j][B_k]];
            } else {
              this.table[j][B_k] = this.table[i][B_k];
            }
          }
          
          this.isFinal[j] = this.isFinal[i];
          this.isPushback[j] = this.isPushback[i];
          this.isLookEnd[j] = this.isLookEnd[i];
          this.action[j] = this.action[i];
          ++j;
        }
      }
      
      this.numStates = j;
      
      for (i = 0; i < this.lexState.length; ++i) {
        this.lexState[i] = trans[this.lexState[i]];
        this.lexState[i] -= move[this.lexState[i]];
      }
      
      Out.println(this.numStates + ' states in minimized DFA');
    }
  }
  
  public printBlocks (b, b_f, b_b, last) {
    Out.dump('block     : ' + this.toString(b));
    Out.dump('b_forward : ' + this.toString(b_f));
    Out.dump('b_backward: ' + this.toString(b_b));
    Out.dump('lastBlock : ' + last);
    const n = this.numStates + 1;
    
    for (let i = n; i <= last; ++i) {
      Out.dump('Block ' + (i - n) + ' (size ' + b[i] + '):');
      let line = '{';
      let s = b_f[i];
      
      while (s !== i) {
        line = line + (s - 1);
        const t = s;
        s = b_f[s];
        if (s !== i) {
          line = line + ',';
          if (b[s] !== i) {
            Out.dump('consistency error for state ' + (s - 1) + ' (block ' + b[s] + ')');
          }
        }
        
        if (b_b[s] !== t) {
          Out.dump('consistency error for b_back in state ' + (s - 1) + ' (back = ' + b_b[s] + ', should be = ' + t + ')');
        }
      }
      
      Out.dump(line + '}');
    }
    
  }
  
  public printL (l_f, l_b, anchor) {
    let l = 'L = {';
    let bc = l_f[anchor];
    
    while (bc !== anchor) {
      const b = bc / this.numInput;
      const c = bc % this.numInput;
      l = l + '(' + b + ',' + c + ')';
      const old_bc = bc;
      bc = l_f[bc];
      if (bc !== anchor) {
        l = l + ',';
      }
      
      if (l_b[bc] !== old_bc) {
        Out.dump('consistency error for (' + b + ',' + c + ')');
      }
    }
    
    Out.dump(l + '}');
  }
  
  public old_minimize () {
    Out.print(this.numStates + ' states before minimization, ');
    if (this.numStates === 0) {
      Out.error(ErrorMessages.ZERO_STATES.toString(), -1, -1);
      throw new Error('GeneratorException()');
    } else if (Options.no_minimize) {
      Out.println('minimization skipped.');
      return null;
    } else {
      const equiv = [];
      const list = [];
      
      let i;
      let j;
      for (i = 1; i < this.numStates; ++i) {
        list[i] = [];
        equiv[i] = [];
        
        for (j = 0; j < i; ++j) {
          if (this.isFinal[i] && this.isFinal[j] && this.isPushback[i] === this.isPushback[j] && this.isLookEnd[i] === this.isLookEnd[j]) {
            equiv[i][j] = this.action[i].isEquiv(this.action[j]);
          } else {
            equiv[i][j] = !this.isFinal[j] && !this.isFinal[i] && this.isPushback[i] === this.isPushback[j] && this.isLookEnd[i] === this.isLookEnd[j];
          }
        }
      }
      
      for (i = 1; i < this.numStates; ++i) {
        Out.debug('Testing state ' + i);
        
        for (j = 0; j < i; ++j) {
          if (equiv[i][j]) {
            let c;
            let p;
            let q;
            let t;
            for (c = 0; c < this.numInput; ++c) {
              if (equiv[i][j]) {
                p = this.table[i][c];
                q = this.table[j][c];
                if (p < q) {
                  t = p;
                  p = q;
                  q = t;
                }
                
                if ((p >= 0 || q >= 0) && p !== q && (p === -1 || q === -1 || !equiv[p][q])) {
                  equiv[i][j] = false;
                  if (list[i][j] !== null) {
                    list[i][j].markAll(list, equiv);
                  }
                }
              }
            }
            
            if (equiv[i][j]) {
              for (c = 0; c < this.numInput; ++c) {
                p = this.table[i][c];
                q = this.table[j][c];
                if (p < q) {
                  t = p;
                  p = q;
                  q = t;
                }
                
                if (p !== q && p >= 0 && q >= 0) {
                  if (list[p][q] === null) {
                    list[p][q] = new StatePairList();
                  }
                  
                  list[p][q].addPair(i, j);
                }
              }
            }
          }
        }
      }
      
      return equiv;
    }
  }
  
  public printInvDelta (inv_delta, inv_delta_set) {
    Out.dump('Inverse of transition table: ');
    
    for (let s = 0; s < this.numStates + 1; ++s) {
      Out.dump('State [' + (s - 1) + ']');
      
      for (let c = 0; c < this.numInput; ++c) {
        let line = 'With <' + c + '> in {';
        let t = inv_delta[s][c];
        
        while (inv_delta_set[t] !== -1) {
          line = line + (inv_delta_set[t++] - 1);
          if (inv_delta_set[t] !== -1) {
            line = line + ',';
          }
        }
        
        if (inv_delta_set[inv_delta[s][c]] !== -1) {
          Out.dump(line + '}');
        }
      }
    }
    
  }
  
  public printTable (equiv) {
    Out.dump('Equivalence table is : ');
    
    for (let i = 1; i < this.numStates; ++i) {
      let line = i + ' :';
      
      for (let j = 0; j < i; ++j) {
        if (equiv[i][j]) {
          line = line + ' E';
        } else {
          line = line + ' x';
        }
      }
      
      Out.dump(line);
    }
    
  }
}
