import {PackEmitter} from './PackEmitter';

export class CountEmitter extends PackEmitter {
  numEntries = 0;
  translate = 0;
  
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
    this.println('    int i = 0;       /* index in packed string  */');
    this.println('    int j = offset;  /* index in unpacked array */');
    this.println('    int l = packed.length();');
    this.println('    while (i < l) {');
    this.println('      int count = packed.charAt(i++);');
    this.println('      int value = packed.charAt(i++);');
    if (this.translate === 1) {
      this.println('      value--;');
    } else if (this.translate !== 0) {
      this.println('      value-= ' + this.translate);
    }
    
    this.println('      do result[j++] = value; while (--count > 0);');
    this.println('    }');
    this.println('    return j;');
    this.println('  }');
  }
  
  public setValTranslation (i: number) {
    this.translate = i;
  }
  
  public emit (count: number, value: number) {
    this.numEntries += count;
    this.breaks();
    this.emitUC(count);
    this.emitUC(value + this.translate);
  }
}
