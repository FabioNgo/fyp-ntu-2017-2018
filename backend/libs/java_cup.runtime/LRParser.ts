import {Scanner} from './Scanner';
import {Symbol} from './Symbol';
import {JavaCharacter} from '../JavaCharacter';
import {VirtualParseStack} from './VirtualParseStack';
import {JavaShort} from '../JavaShort';

export abstract class LRParser {
  protected static readonly error_sync_size = 3;
  public Symbol;
  protected _done_parsing: boolean;
  protected tos;
  protected cur_token;
  protected stack;
  protected production_tab: number[][];
  protected action_tab: number[][];
  protected reduce_tab: number[][];
  protected lookahead;
  protected lookahead_pos;
  protected boolean;
  public scanner;
  
  public constructor (s?: Scanner) {
    this._done_parsing = false;
    this.stack = [];
    if (s) {
      this.scanner = s;
    }
    
  }
  
  protected static unpackFromStrings (sa: string): number[][] {
    let sb = sa[0];
    
    for (let i = 1; i < sa.length; ++i) {
      sb += (sa[i]);
    }
    
    let n = 0;
    const size1 = JavaCharacter.toCode(sb.charAt(n)) << 16 | JavaCharacter.toCode(sb.charAt(n + 1));
    n = n + 2;
    const result = [];
    
    for (let i = 0; i < size1; ++i) {
      const size2 = JavaCharacter.toCode(sb.charAt(n)) << 16 | JavaCharacter.toCode(sb.charAt(n + 1));
      n += 2;
      result[i] = [];
      for (let j = 0; j < size2; ++j) {
        result[i][j] = JavaShort.toSignedShort((JavaCharacter.toCode(sb.charAt(n++)) - 2));
      }
    }
    
    return result;
  }
  
  public abstract production_table (): number[][];
  
  public abstract action_table (): number[][];
  
  public abstract reduce_table (): number[][];
  
  public abstract start_state (): number;
  
  public abstract start_production (): number;
  
  public abstract EOF_sym (): number;
  
  public abstract error_sym (): number;
  
  public done_parsing () {
    this._done_parsing = true;
  }
  
  public setScanner (s: Scanner) {
    this.scanner = s;
  }
  
  public getScanner () {
    return this.scanner;
  }
  
  public abstract do_action (var1: number, var2: LRParser, stack: [number], var4: number): Symbol;
  
  public user_init () {
  }
  
  public scan () {
    const sym = this.getScanner().next_token();
    return sym != null ? sym : new Symbol(this.EOF_sym(), -1, -1, null);
  }
  
  public report_fatal_error (message, info) {
    this.done_parsing();
    this.report_error(message, info);
    throw new Error('Can\'t recover from previous error(s)');
  }
  
  public report_error (message, info) {
    console.log(message);
    if (info instanceof Symbol) {
      if ((<Symbol>info).left !== -1) {
        console.log(' at character ' + (<Symbol>info).left + ' of input');
      } else {
        console.log('');
      }
    } else {
      console.log('');
    }
    
  }
  
  public syntax_error (cur_token: Symbol) {
    this.report_error('Syntax error', cur_token);
  }
  
  public unrecovered_syntax_error (cur_token: Symbol) {
    this.report_fatal_error('Couldn\'t repair and continue parse', cur_token);
  }
  
  public parse () {
    let lhs_sym = null;
    this.production_tab = this.production_table();
    this.action_tab = this.action_table();
    this.reduce_tab = this.reduce_table();
    this.init_actions();
    this.user_init();
    this.cur_token = this.scan();
    this.stack = [];
    this.stack.push(new Symbol(0, -1, -1, null, this.start_state()));
    this.tos = 0;
    this._done_parsing = false;
    
    while (!this._done_parsing) {
      if (this.cur_token.used_by_parser) {
        throw new Error('Symbol recycling detected (fix your scanner).');
      }
  
      let act = this.get_action((<Symbol>this.stack[this.stack.length - 1]).parse_state, this.cur_token.sym);
      if (act > 0) {
        this.cur_token.parse_state = act - 1;
        this.cur_token.used_by_parser = true;
        this.stack.push(this.cur_token);
        ++this.tos;
        this.cur_token = this.scan();
      } else if (act >= 0) {
        if (act === 0) {
          this.syntax_error(this.cur_token);
          if (!this.error_recovery(false)) {
            this.unrecovered_syntax_error(this.cur_token);
            this.done_parsing();
          } else {
            lhs_sym = <Symbol>this.stack.peek();
          }
        }
      } else {
        lhs_sym = this.do_action(-act - 1, this, this.stack, this.tos);
        const lhs_sym_num = this.production_tab[-act - 1][0];
        const handle_size = this.production_tab[-act - 1][1];
        
        for (let i = 0; i < handle_size; ++i) {
          this.stack.pop();
          --this.tos;
        }
  
        act = this.get_reduce((<Symbol>this.stack[this.stack.length - 1]).parse_state, lhs_sym_num);
        lhs_sym.parse_state = act;
        lhs_sym.used_by_parser = true;
        this.stack.push(lhs_sym);
        ++this.tos;
      }
    }
    
    return lhs_sym;
  }
  
  public debug_message (mess: string) {
    console.log(mess);
  }
  
  public dump_stack () {
    if (this.stack == null) {
      this.debug_message('# Stack dump requested, but stack is null');
    } else {
      this.debug_message('============ Parse Stack Dump ============');
      
      for (let i = 0; i < this.stack.size(); ++i) {
        this.debug_message('Symbol: ' + (<Symbol>this.stack.elementAt(i)).sym + ' State: ' + (<Symbol>this.stack.elementAt(i)).parse_state);
      }
      
      this.debug_message('==========================================');
    }
  }
  
  public debug_reduce (prod_num, nt_num, rhs_size) {
    this.debug_message('# Reduce with prod #' + prod_num + ' [NT=' + nt_num + ', ' + 'SZ=' + rhs_size + ']');
  }
  
  public debug_shift (shift_tkn: Symbol) {
    this.debug_message('# Shift under term #' + shift_tkn.sym + ' to state #' + shift_tkn.parse_state);
  }
  
  public debug_stack () {
    let sb = '## STACK:';
    
    for (let i = 0; i < this.stack.size(); ++i) {
      const s = <Symbol> this.stack.elementAt(i);
      sb += (' <state ' + s.parse_state + ', sym ' + s.sym + '>');
      if (i % 3 === 2 || i === this.stack.size() - 1) {
        this.debug_message(sb.toString());
        sb = '         ';
      }
    }
    
  }
  
  debug_parse () {
    let lhs_sym = null;
    this.production_tab = this.production_table();
    this.action_tab = this.action_table();
    this.reduce_tab = this.reduce_table();
    this.debug_message('# Initializing parser');
    this.init_actions();
    this.user_init();
    this.cur_token = this.scan();
    this.debug_message('# Current Symbol is #' + this.cur_token.sym);
    this.stack.removeAllElements();
    this.stack.push(new Symbol(0, this.start_state()));
    this.tos = 0;
    this._done_parsing = false;
    
    while (!this._done_parsing) {
      if (this.cur_token.used_by_parser) {
        throw new Error('Symbol recycling detected (fix your scanner).');
      }
      
      let act = this.get_action((<Symbol>this.stack.peek()).parse_state, this.cur_token.sym);
      if (act > 0) {
        this.cur_token.parse_state = act - 1;
        this.cur_token.used_by_parser = true;
        this.debug_shift(this.cur_token);
        this.stack.push(this.cur_token);
        ++this.tos;
        this.cur_token = this.scan();
        this.debug_message('# Current token is ' + this.cur_token);
      } else if (act >= 0) {
        if (act === 0) {
          this.syntax_error(this.cur_token);
          if (!this.error_recovery(true)) {
            this.unrecovered_syntax_error(this.cur_token);
            this.done_parsing();
          } else {
            lhs_sym = <Symbol>this.stack.peek();
          }
        }
      } else {
        lhs_sym = this.do_action(-act - 1, this, this.stack, this.tos);
        const lhs_sym_num = this.production_tab[-act - 1][0];
        const handle_size = this.production_tab[-act - 1][1];
        this.debug_reduce(-act - 1, lhs_sym_num, handle_size);
        
        for (let i = 0; i < handle_size; ++i) {
          this.stack.pop();
          --this.tos;
        }
        
        act = this.get_reduce((<Symbol>this.stack.peek()).parse_state, lhs_sym_num);
        this.debug_message('# Reduce rule: top state ' + (<Symbol>this.stack.peek()).parse_state + ', lhs sym ' + lhs_sym_num + ' -> state ' + act);
        lhs_sym.parse_state = act;
        lhs_sym.used_by_parser = true;
        this.stack.push(lhs_sym);
        ++this.tos;
        this.debug_message('# Goto state #' + act);
      }
    }
    
    return lhs_sym;
  }
  
  try_parse_ahead (debug: boolean) {
    const vstack = new VirtualParseStack(this.stack);
    
    do {
      while (true) {
        const act = this.get_action(vstack.top(), this.cur_err_token().sym);
        if (act === 0) {
          return false;
        }
        
        if (act > 0) {
          vstack.push(act - 1);
          if (debug) {
            this.debug_message('# Parse-ahead shifts Symbol #' + this.cur_err_token().sym + ' into state #' + (act - 1));
          }
          break;
        }
        
        if (-act - 1 === this.start_production()) {
          if (debug) {
            this.debug_message('# Parse-ahead accepts');
          }
          
          return true;
        }
        
        const lhs = this.production_tab[-act - 1][0];
        const rhs_size = this.production_tab[-act - 1][1];
        
        for (let i = 0; i < rhs_size; ++i) {
          vstack.pop();
        }
        
        if (debug) {
          this.debug_message('# Parse-ahead reduces: handle size = ' + rhs_size + ' lhs = #' + lhs + ' from state #' + vstack.top());
        }
        
        vstack.push(this.get_reduce(vstack.top(), lhs));
        if (debug) {
          this.debug_message('# Goto state #' + vstack.top());
        }
      }
    } while (this.advance_lookahead());
    
    return true;
  }
  
  protected error_sync_size () {
    return 3;
  }
  
  protected abstract init_actions ();
  
  protected get_action (state, sym) {
    const row = this.action_tab[state];
    let probe;
    if (row.length < 20) {
      for (probe = 0; probe < row.length; ++probe) {
        const tag = row[probe++];
        if (tag === sym || tag === -1) {
          return row[probe];
        }
      }
      
      return 0;
    } else {
      let first = 0;
      let last = Math.floor((row.length - 1) / 2) - 1;
      
      while (first <= last) {
        probe = Math.floor((first + last) / 2);
        if (sym === row[probe * 2]) {
          return row[probe * 2 + 1];
        }
        
        if (sym > row[probe * 2]) {
          first = probe + 1;
        } else {
          last = probe - 1;
        }
      }
      
      return row[row.length - 1];
    }
  }
  
  protected get_reduce (state, sym) {
    const row = this.reduce_tab[state];
    if (row == null) {
      return -1;
    } else {
      for (let probe = 0; probe < row.length; ++probe) {
        const tag = row[probe++];
        if (tag === sym || tag === -1) {
          return row[probe];
        }
      }
      
      return -1;
    }
  }
  
  protected error_recovery (debug: boolean) {
    if (debug) {
      this.debug_message('# Attempting error recovery');
    }
    
    if (!this.find_recovery_config(debug)) {
      if (debug) {
        this.debug_message('# Error recovery fails');
      }
      
      return false;
    } else {
      this.read_lookahead();
      
      while (true) {
        if (debug) {
          this.debug_message('# Trying to parse ahead');
        }
        
        if (this.try_parse_ahead(debug)) {
          if (debug) {
            this.debug_message('# Parse-ahead ok, going back to normal parse');
          }
          
          this.parse_lookahead(debug);
          return true;
        }
        
        if (this.lookahead[0].sym === this.EOF_sym()) {
          if (debug) {
            this.debug_message('# Error recovery fails at EOF');
          }
          
          return false;
        }
        
        if (debug) {
          this.debug_message('# Consuming Symbol #' + this.lookahead[0].sym);
        }
        
        this.restart_lookahead();
      }
    }
  }
  
  protected shift_under_error (): boolean {
    return this.get_action((<Symbol>this.stack.peek()).parse_state, this.error_sym()) > 0;
  }
  
  protected find_recovery_config (debug: boolean): boolean {
    if (debug) {
      this.debug_message('# Finding recovery state on stack');
    }
    
    const right_pos = (<Symbol> this.stack.peek() ).right;
    let left_pos = (<Symbol> this.stack.peek() ).left;
    
    do {
      if (this.shift_under_error()) {
        const act = this.get_action((<Symbol>this.stack.peek()).parse_state, this.error_sym());
        if (debug) {
          this.debug_message('# Recover state found (#' + (<Symbol>this.stack.peek()).parse_state + ')',
          );
          this.debug_message('# Shifting on error to state #' + (act - 1));
        }
        
        const error_token = new Symbol(this.error_sym(), left_pos, right_pos);
        error_token.parse_state = act - 1;
        error_token.used_by_parser = true;
        this.stack.push(error_token);
        ++this.tos;
        return true;
      }
      
      if (debug) {
        this.debug_message('# Pop stack by one, state was # ' + (<Symbol>this.stack.peek()).parse_state,
        );
      }
      
      left_pos = (<Symbol> this.stack.pop() ).left;
      --this.tos;
    } while (!this.stack.empty());
    
    if (debug) {
      this.debug_message('# No recovery state found on stack');
    }
    
    return false;
  }
  
  protected read_lookahead () {
    this.lookahead = new Symbol[this.error_sync_size()];
    
    for (let i = 0; i < this.error_sync_size(); ++i) {
      this.lookahead[i] = this.cur_token;
      this.cur_token = this.scan();
    }
    
    this.lookahead_pos = 0;
  }
  
  protected cur_err_token (): Symbol {
    return this.lookahead[this.lookahead_pos];
  }
  
  protected advance_lookahead (): boolean {
    ++this.lookahead_pos;
    return this.lookahead_pos < this.error_sync_size();
  }
  
  protected restart_lookahead () {
    for (let i = 1; i < this.error_sync_size(); ++i) {
      this.lookahead[i - 1] = this.lookahead[i];
    }
    
    this.lookahead[this.error_sync_size() - 1] = this.cur_token;
    this.cur_token = this.scan();
    this.lookahead_pos = 0;
  }
  
  protected parse_lookahead (debug: boolean) {
    let lhs_sym = null;
    this.lookahead_pos = 0;
    if (debug) {
      this.debug_message('# Reparsing saved input with actions');
      this.debug_message('# Current Symbol is #' + this.cur_err_token().sym);
      this.debug_message('# Current state is #' + (<Symbol>this.stack.peek()).parse_state);
    }
    
    while (true) {
      while (!this._done_parsing) {
        let act = this.get_action((<Symbol>this.stack.peek()).parse_state, this.cur_err_token().sym);
        if (act > 0) {
          this.cur_err_token().parse_state = act - 1;
          this.cur_err_token().used_by_parser = true;
          if (debug) {
            this.debug_shift(this.cur_err_token());
          }
          
          this.stack.push(this.cur_err_token());
          ++this.tos;
          if (!this.advance_lookahead()) {
            if (debug) {
              this.debug_message('# Completed reparse');
            }
            
            return;
          }
          
          if (debug) {
            this.debug_message('# Current Symbol is #' + this.cur_err_token().sym);
          }
        } else if (act >= 0) {
          if (act === 0) {
            this.report_fatal_error('Syntax error', lhs_sym);
            return;
          }
        } else {
          lhs_sym = this.do_action(-act - 1, this, this.stack, this.tos);
          const lhs_sym_num = this.production_tab[-act - 1][0];
          const handle_size = this.production_tab[-act - 1][1];
          if (debug) {
            this.debug_reduce(-act - 1, lhs_sym_num, handle_size);
          }
          
          for (let i = 0; i < handle_size; ++i) {
            this.stack.pop();
            --this.tos;
          }
          
          act = this.get_reduce((<Symbol>this.stack.peek()).parse_state, lhs_sym_num);
          lhs_sym.parse_state = act;
          lhs_sym.used_by_parser = true;
          this.stack.push(lhs_sym);
          ++this.tos;
          if (debug) {
            this.debug_message('# Goto state #' + act);
          }
        }
      }
      
      return;
    }
  }
}
