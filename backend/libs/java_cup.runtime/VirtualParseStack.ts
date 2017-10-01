import {Symbol} from './Symbol';

export class VirtualParseStack {
  protected real_stack;
  protected real_next;
  protected vstack;
  
  public constructor (shadowing_stack) {
    if (shadowing_stack == null) {
      throw new Error('Internal parser error: attempt to create null virtual stack');
    } else {
      this.real_stack = shadowing_stack;
      this.vstack = [];
      this.real_next = 0;
      this.get_from_real();
    }
  }
  
  public empty () {
    return this.vstack.empty();
  }
  
  public top () {
    if (this.vstack.empty()) {
      throw new Error('Internal parser error: top() called on empty virtual stack');
    } else {
      return (this.vstack.peek());
    }
  }
  
  public pop () {
    if (this.vstack.empty()) {
      throw new Error('Internal parser error: pop from empty virtual stack');
    } else {
      this.vstack.pop();
      if (this.vstack.empty()) {
        this.get_from_real();
      }
      
    }
  }
  
  public push (state_num: number) {
    this.vstack.push(state_num);
  }
  
  protected get_from_real () {
    if (this.real_next < this.real_stack.size()) {
      const stack_sym = <Symbol>this.real_stack.elementAt(this.real_stack.size() - 1 - this.real_next);
      ++this.real_next;
      this.vstack.push(stack_sym.parse_state);
    }
  }
}
