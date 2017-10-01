import {ErrorMessages} from './ErrorMessages';
import {JavaVector} from '../JavaVector';
import {PrintWriter} from './PrintWriter';
import {Out} from './Out';
import {JavaFileReader} from '../JavaFileReader';
import {GeneratorException} from './GeneratorException';

export class Skeleton {
  public static line;
  private static readonly size = 21;
  private static readonly NL = '\n';
  private pos: number;
  private out: PrintWriter;
  
  public constructor (out: PrintWriter) {
    this.out = out;
  }
  
  public static makePrivate () {
    for (let i = 0; i < this.line.length; ++i) {
      Skeleton.line[i] = Skeleton.replace(' public ', ' private ', Skeleton.line[i]);
    }
    
  }
  
  public static readSkelFile (skeletonFile: File) {
    if (skeletonFile == null) {
      throw new Error('Skeleton file must not be null');
    } else {
      Out.println(ErrorMessages.READING_SKEL + skeletonFile.toString());
      
      try {
        const reader = new JavaFileReader(skeletonFile);
        Skeleton.readSkel(reader);
      } catch (var2) {
        Out.error(ErrorMessages.SKEL_IO_ERROR, -1, -1);
        throw new GeneratorException();
      }
    }
  }
  
  public static readSkel (reader: JavaFileReader) {
    let section = '';
    const lines = new JavaVector<string>();
    const readerLines = reader.getContent().split('\n');
    readerLines.forEach((ln: string) => {
      if (ln.startsWith('---')) {
        lines.addElement(section.toString());
        section = '';
      } else {
        section += ln;
        section += this.NL;
      }
    });
    
    if (section.length > 0) {
      lines.addElement(section.toString());
    }
    
    if (lines.size() !== 21) {
      throw new Error('GeneratorException(): ' + ErrorMessages.WRONG_SKELETON);
    } else {
      this.line = [];
      
      for (let i = 0; i < 21; ++i) {
        this.line[i] = (String);
        lines.elementAt(i);
      }
      
    }
  }
  
  public static replace (a: string, b: string, c: string) {
    let result = '';
    let i = 0;
    
    for (let j = c.indexOf(a); j >= i; j = c.indexOf(a, i)) {
      result += (c.substring(i, j));
      result += (b);
      i = j + a.length;
    }
    
    result += (c.substring(i, c.length));
    return result.toString();
  }
  
  public static readDefault () {
  
  }
  
  public emitNext () {
    return Skeleton.line[this.pos++];
  }
  
}
