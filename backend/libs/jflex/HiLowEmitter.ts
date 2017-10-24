import {JavaCharacter} from '../JavaCharacter';
import {PackEmitter} from './PackEmitter';

export class HiLowEmitter extends PackEmitter {
  private numEntries;
  
  public constructor (name: string) {
    super(name);
  }
  
  public emitUnpack () {
    this.println('";');
    this.nl();
    this.println('  private static int [] zzUnpack' + this.name + '() {');
    this.println('    int [] result = new int[' + this.numEntries + '];');
    this.println('    int offset = 0;');
    
    for (let i = 0; i < this.chunks; ++i) {
      this.println('    offset = zzUnpack' + this.name + '(' + this.constName() + '_PACKED_' + i + ', offset, result);');
    }
    
    this.println('    return result;');
    this.println('  }');
    this.nl();
    this.println('  private static int zzUnpack' + this.name + '(String packed, int offset, int [] result) {');
    this.println('    int i = 0;  /* index in packed string  */');
    this.println('    int j = offset;  /* index in unpacked array */');
    this.println('    int l = packed.length();');
    this.println('    while (i < l) {');
    this.println('      int high = packed.charAt(i++) << 16;');
    this.println('      result[j++] = high | packed.charAt(i++);');
    this.println('    }');
    this.println('    return j;');
    this.println('  }');
  }
  
  public emit (val: number): string {
    let result = '';
    ++this.numEntries;
    this.breaks();
    result += this.emitUC(val >> 16);
    result += this.emitUC(val & JavaCharacter.toCode('\uffff'));
    return result;
  }
}
