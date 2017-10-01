import {Skeleton} from './Skeleton';
import {Out} from './Out';
import {LexParse} from './LexParse';
import {CharSet} from './CharSet';
import {DFA} from './DFA';
import {CharClassInterval} from './CharClassInterval';
import {LexScan} from './LexScan';
import {isNumber} from 'util';
import {CountEmitter} from './CountEmitter';
import {PrintWriter} from './PrintWriter';
import {HiLowEmitter} from './HiLowEmitter';
import {Action} from './Action';
import {CharSetEnumerator} from './CharSetEnumerator';

export class Emitter {
  private static readonly FINAL = 1;
  private static readonly PUSHBACK = 2;
  private static readonly LOOKEND = 4;
  private static readonly NOLOOK = 8;
  private static readonly date = new Date();
  public parser: LexParse;
  private inputFile: File;
  private out: PrintWriter;
  private skel: Skeleton;
  private scanner: LexScan;
  private dfa: DFA;
  private table: CharSet[][];
  private isTransition: boolean[];
  private noTarget: CharSet[];
  private numRows: number;
  private rowMap: number[];
  private rowKilled: boolean[];
  private numCols: number;
  private colMap: number[];
  private colKilled: boolean[];
  private actionTable: Map<Action, number>;
  private intervalls: CharClassInterval[];
  private visibility = 'public';
  
  public constructor (inputFile: File, parser: LexParse, dfa: DFA) {
    const name = parser.scanner.className + '.java';
    // Out.println("Writing code to \"" + outputFile + "\"");
    this.out = new PrintWriter();
    this.parser = parser;
    this.scanner = parser.scanner;
    this.visibility = this.scanner.visibility;
    this.inputFile = inputFile;
    this.dfa = dfa;
    this.skel = new Skeleton(this.out);
  }
  
  public static endsWithJavadoc (usercode: string) {
    const s = usercode.toString().trim();
    if (!s.endsWith('*/')) {
      return false;
    } else {
      const i = s.lastIndexOf('/**');
      if (i < 0) {
        return false;
      } else {
        return s.substring(i, s.length - 2).indexOf('*/') < 0;
      }
    }
  }
  
  public emitActionTable () {
    let lastAction = 1;
    let count = 0;
    let value = 0;
    this.println('  /** ');
    this.println('   * Translates DFA states to action switch labels.');
    this.println('   */');
    const e = new CountEmitter('Action');
    e.emitInit();
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      let newVal;
      if (this.dfa.isFinal[i]) {
        const action = this.dfa.action[i];
        let stored = <number> this.actionTable.get(action);
        if (stored === null) {
          stored = lastAction++;
          this.actionTable.set(action, stored);
        }
        
        newVal = stored;
      } else {
        newVal = 0;
      }
      
      if (value === newVal) {
        ++count;
      } else {
        if (count > 0) {
          e.emit(count, value);
        }
        
        count = 1;
        value = newVal;
      }
    }
    
    if (count > 0) {
      e.emit(count, value);
    }
    
    e.emitUnpack();
    this.println(e.toString());
  }
  
  public emit () {
    this.setupEOFCode();
    if (this.scanner.functionName === null) {
      this.scanner.functionName = 'yylex';
    }
    
    this.reduceColumns();
    this.findActionStates();
    this.emitHeader();
    this.emitUserCode();
    this.emitClassName();
    this.skel.emitNext();
    this.println('  private static final int ZZ_BUFFERSIZE = ' + this.scanner.bufferSize + ';');
    if (this.scanner.debugOption) {
      this.println('  private static final String ZZ_NL = System.getProperty("line.separator");');
    }
    
    this.skel.emitNext();
    this.emitLexicalStates();
    this.emitCharMapArray();
    this.emitActionTable();
    if (this.scanner.useRowMap) {
      this.reduceRows();
      this.emitRowMapArray();
      if (this.scanner.packed) {
        this.emitDynamicInit();
      } else {
        this.emitZZTrans();
      }
    }
    
    this.skel.emitNext();
    if (this.scanner.useRowMap) {
      this.emitAttributes();
    }
    
    this.skel.emitNext();
    this.emitClassCode();
    this.skel.emitNext();
    this.emitConstructorDecl();
    this.emitCharMapInitFunction();
    this.skel.emitNext();
    this.emitScanError();
    this.skel.emitNext();
    this.emitDoEOF();
    this.skel.emitNext();
    this.emitLexFunctHeader();
    this.emitNextInput();
    if (this.scanner.useRowMap) {
      this.emitGetRowMapNext();
    } else {
      this.emitTransitionTable();
    }
    
    if (this.scanner.lookAheadUsed) {
      this.emitPushback();
    }
    
    this.skel.emitNext();
    this.emitActions();
    this.skel.emitNext();
    this.emitEOFVal();
    this.skel.emitNext();
    this.emitNoMatch();
    this.skel.emitNext();
    this.emitMain();
    this.skel.emitNext();
    // this.out.close();
  }
  
  private println (line) {
    this.out.println(line);
  }
  
  private print (line: number | string, tab?) {
    
    if (tab && isNumber(line)) {
      let exp;
      if (<number>line < 0) {
        exp = 1;
      } else {
        exp = 10;
      }
      
      for (; tab-- > 1; exp *= 10) {
        if (Math.abs(<number>line) < exp) {
          this.print(' ');
        }
      }
    }
    this.out.print(line);
  }
  
  private emitScanError () {
    this.print('  private  zzScanError(int errorCode)');
    if (this.scanner.scanErrorException !== null) {
      this.print(' throws ' + this.scanner.scanErrorException);
    }
    
    this.println(' {');
    this.skel.emitNext();
    if (this.scanner.scanErrorException === null) {
      this.println('    throw new Error(message);');
    } else {
      this.println('    throw new ' + this.scanner.scanErrorException + '(message);');
    }
    
    this.skel.emitNext();
    this.print('  ' + this.visibility + '  yypushback(int number) ');
    if (this.scanner.scanErrorException === null) {
      this.println(' {');
    } else {
      this.println(' throws ' + this.scanner.scanErrorException + ' {');
    }
    
  }
  
  private emitMain () {
    if (this.scanner.standalone || this.scanner.debugOption || this.scanner.cupDebug) {
      if (this.scanner.cupDebug) {
        this.println('  /**');
        this.println('   * Converts an int token code into the name of the');
        this.println('   * token by reflection on the cup symbol class/interface ' + this.scanner.cupSymbol);
        this.println('   *');
        this.println('   * This code was contributed by Karl Meissner <meissnersd@yahoo.com>');
        this.println('   */');
        this.println('  private String getTokenName(int token) {');
        this.println('    try {');
        this.println('      java.lang.reflect.Field [] classFields = ' + this.scanner.cupSymbol + '.class.getFields();');
        this.println('      for (int i = 0; i < classFields.length; i++) {');
        this.println('        if (classFields[i].getInt(null) === token) {');
        this.println('          return classFields[i].getName();');
        this.println('        }');
        this.println('      }');
        this.println('    } catch (Exception e) {');
        this.println('      e.printStackTrace(System.err);');
        this.println('    }');
        this.println('');
        this.println('    return "UNKNOWN TOKEN";');
        this.println('  }');
        this.println('');
        this.println('  /**');
        this.println('   * Same as ' + this.scanner.functionName + ' but also prints the token to standard out');
        this.println('   * for debugging.');
        this.println('   *');
        this.println('   * This code was contributed by Karl Meissner <meissnersd@yahoo.com>');
        this.println('   */');
        this.print('  ' + this.visibility + ' ');
        if (this.scanner.tokenType === null) {
          if (this.scanner.isInteger) {
            this.print('int');
          } else if (this.scanner.isIntWrap) {
            this.print('Integer');
          } else {
            this.print('Yytoken');
          }
        } else {
          this.print(this.scanner.tokenType);
        }
        
        this.print(' debug_');
        this.print(this.scanner.functionName);
        this.print('() throws java.io.IOException');
        if (this.scanner.lexThrow !== null) {
          this.print(', ');
          this.print(this.scanner.lexThrow);
        }
        
        if (this.scanner.scanErrorException !== null) {
          this.print(', ');
          this.print(this.scanner.scanErrorException);
        }
        
        this.println(' {');
        this.println('    java_cup.runtime.Symbol s = ' + this.scanner.functionName + '();');
        this.print('    System.out.println( ');
        if (this.scanner.lineCount) {
          this.print('"line:" + (yyline+1) + ');
        }
        
        if (this.scanner.columnCount) {
          this.print('" col:" + (yycolumn+1) + ');
        }
        
        this.println('" --"+ yytext() + "--" + getTokenName(s.sym) + "--");');
        this.println('    return s;');
        this.println('  }');
        this.println('');
      }
      
      if (this.scanner.standalone) {
        this.println('  /**');
        this.println('   * Runs the scanner on input files.');
        this.println('   *');
        this.println('   * This is a standalone scanner, it will print any unmatched');
        this.println('   * text to System.out unchanged.');
        this.println('   *');
        this.println('   * @param argv   the command line, contains the filenames to run');
        this.println('   *               the scanner on.');
        this.println('   */');
      } else {
        this.println('  /**');
        this.println('   * Runs the scanner on input files.');
        this.println('   *');
        this.println('   * This main method is the debugging routine for the scanner.');
        this.println('   * It prints debugging information about each returned token to');
        this.println('   * System.out until the end of file is reached, or an error occured.');
        this.println('   *');
        this.println('   * @param argv   the command line, contains the filenames to run');
        this.println('   *               the scanner on.');
        this.println('   */');
      }
      
      this.println('  public static  main(String argv[]) {');
      this.println('    if (argv.length === 0) {');
      this.println('      System.out.println("Usage : java ' + this.scanner.className + ' <inputfile>");');
      this.println('    }');
      this.println('    else {');
      this.println('      for (int i = 0; i < argv.length; i++) {');
      this.println('        ' + this.scanner.className + ' scanner = null;');
      this.println('        try {');
      this.println('          scanner = new ' + this.scanner.className + '( new java.io.FileReader(argv[i]) );');
      if (this.scanner.standalone) {
        this.println('          while ( !scanner.zzAtEOF ) scanner.' + this.scanner.functionName + '();');
      } else if (this.scanner.cupDebug) {
        this.println('          while ( !scanner.zzAtEOF ) scanner.debug_' + this.scanner.functionName + '();');
      } else {
        this.println('          do {');
        this.println('            System.out.println(scanner.' + this.scanner.functionName + '());');
        this.println('          } while (!scanner.zzAtEOF);');
        this.println('');
      }
      
      this.println('        }');
      this.println('        catch (java.io.FileNotFoundException e) {');
      this.println('          System.out.println("File not found : \\""+argv[i]+"\\"");');
      this.println('        }');
      this.println('        catch (java.io.IOException e) {');
      this.println('          System.out.println("IO error scanning file \\""+argv[i]+"\\"");');
      this.println('          System.out.println(e);');
      this.println('        }');
      this.println('        catch (Exception e) {');
      this.println('          System.out.println("Unexpected exception:");');
      this.println('          e.printStackTrace();');
      this.println('        }');
      this.println('      }');
      this.println('    }');
      this.println('  }');
      this.println('');
    }
  }
  
  private emitNoMatch () {
    this.println('            zzScanError(ZZ_NO_MATCH);');
  }
  
  private emitNextInput () {
    this.println('          if (zzCurrentPosL < zzEndReadL)');
    this.println('            zzInput = zzBufferL[zzCurrentPosL++];');
    this.println('          else if (zzAtEOF) {');
    this.println('            zzInput = YYEOF;');
    this.println('            break zzForAction;');
    this.println('          }');
    this.println('          else {');
    this.println('            // store back cached positions');
    this.println('            zzCurrentPos  = zzCurrentPosL;');
    this.println('            zzMarkedPos   = zzMarkedPosL;');
    if (this.scanner.lookAheadUsed) {
      this.println('            zzPushbackPos = zzPushbackPosL;');
    }
    
    this.println('            boolean eof = zzRefill();');
    this.println('            // get translated positions and possibly new buffer');
    this.println('            zzCurrentPosL  = zzCurrentPos;');
    this.println('            zzMarkedPosL   = zzMarkedPos;');
    this.println('            zzBufferL      = zzBuffer;');
    this.println('            zzEndReadL     = zzEndRead;');
    if (this.scanner.lookAheadUsed) {
      this.println('            zzPushbackPosL = zzPushbackPos;');
    }
    
    this.println('            if (eof) {');
    this.println('              zzInput = YYEOF;');
    this.println('              break zzForAction;');
    this.println('            }');
    this.println('            else {');
    this.println('              zzInput = zzBufferL[zzCurrentPosL++];');
    this.println('            }');
    this.println('          }');
  }
  
  private emitHeader () {
    this.println('/* The following code was generated by JFlex 1.4 on ' + Emitter.date + ' */');
    this.println('');
  }
  
  private emitUserCode () {
    if (this.scanner.userCode.length > 0) {
      this.println(this.scanner.userCode.toString());
    }
    
  }
  
  private emitClassName () {
    if (!Emitter.endsWithJavadoc(this.scanner.userCode)) {
      const path = this.inputFile.toString();
      
      this.println('/**');
      this.println(' * This class is a scanner generated by ');
      this.println(' * <a href="http://www.jflex.de/">JFlex</a> 1.4');
      this.println(' * on ' + Emitter.date + ' from the specification file');
      this.println(' * <tt>' + path + '</tt>');
      this.println(' */');
    }
    
    if (this.scanner.isPublic) {
      this.print('public ');
    }
    
    if (this.scanner.isAbstract) {
      this.print('abstract ');
    }
    
    if (this.scanner.isFinal) {
      this.print('final ');
    }
    
    this.print('class ');
    this.print(this.scanner.className);
    if (this.scanner.isExtending !== null) {
      this.print(' extends ');
      this.print(this.scanner.isExtending);
    }
    
    if (this.scanner.isImplementing !== null) {
      this.print(' implements ');
      this.print(this.scanner.isImplementing);
    }
    
    this.println(' {');
  }
  
  private emitLexicalStates () {
    const stateNames = this.scanner.states.states;
    
    let j;
    stateNames.forEach((value: number, name: string) => {
      j = this.scanner.states.getNumber(name);
      if (this.scanner.bolUsed) {
        this.println('  ' + this.visibility + ' static final int ' + name + ' = ' + 2 * j + ';');
      } else {
        this.println('  ' + this.visibility + ' static final int ' + name + ' = ' + this.dfa.lexState[2 * j] + ';');
      }
    });
    
    if (this.scanner.bolUsed) {
      this.println('');
      this.println('  /**');
      this.println('   * ZZ_LEXSTATE[l] is the state in the DFA for the lexical state l');
      this.println('   * ZZ_LEXSTATE[l+1] is the state in the DFA for the lexical state l');
      this.println('   *                  at the beginning of a line');
      this.println('   * l is of the form l = 2*k, k a non negative integer');
      this.println('   */');
      this.println('  private static final int ZZ_LEXSTATE[] = { ');
      j = 0;
      this.print('    ');
      
      let i;
      for (i = 0; i < this.dfa.lexState.length - 1; ++i) {
        this.print(this.dfa.lexState[i], 2);
        this.print(', ');
        ++j;
        if (j >= 16) {
          this.println('');
          this.print('    ');
          j = 0;
        }
      }
      
      this.println(this.dfa.lexState[i]);
      this.println('  };');
    }
    
  }
  
  private emitDynamicInit () {
    let count = 0;
    let value = this.dfa.table[0][0];
    this.println('  /** ');
    this.println('   * The transition table of the DFA');
    this.println('   */');
    const e = new CountEmitter('Trans');
    e.setValTranslation(1);
    e.emitInit();
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      if (!this.rowKilled[i]) {
        for (let c = 0; c < this.dfa.numInput; ++c) {
          if (!this.colKilled[c]) {
            if (this.dfa.table[i][c] === value) {
              ++count;
            } else {
              e.emit(count, value);
              count = 1;
              value = this.dfa.table[i][c];
            }
          }
        }
      }
    }
    
    e.emit(count, value);
    e.emitUnpack();
    this.println(e.toString());
  }
  
  private emitCharMapInitFunction () {
    const cl = this.parser.getCharClasses();
    if (cl.getMaxCharCode() >= 256) {
      this.println('');
      this.println('  /** ');
      this.println('   * Unpacks the compressed character translation table.');
      this.println('   *');
      this.println('   * @param packed   the packed character translation table');
      this.println('   * @return         the unpacked character translation table');
      this.println('   */');
      this.println('  private static char [] zzUnpackCMap(String packed) {');
      this.println('    char [] map = new char[0x10000];');
      this.println('    int i = 0;  /* index in packed string  */');
      this.println('    int j = 0;  /* index in unpacked array */');
      this.println('    while (i < ' + 2 * this.intervalls.length + ') {');
      this.println('      int  count = packed.charAt(i++);');
      this.println('      char value = packed.charAt(i++);');
      this.println('      do map[j++] = value; while (--count > 0);');
      this.println('    }');
      this.println('    return map;');
      this.println('  }');
    }
  }
  
  private emitZZTrans () {
    let n = 0;
    this.println('  /** ');
    this.println('   * The transition table of the DFA');
    this.println('   */');
    this.println('  private static final int ZZ_TRANS [] = {');
    this.print('    ');
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      if (!this.rowKilled[i]) {
        for (let c = 0; c < this.dfa.numInput; ++c) {
          if (!this.colKilled[c]) {
            if (n >= 10) {
              this.println('');
              this.print('    ');
              n = 0;
            }
            
            this.print(this.dfa.table[i][c]);
            if (i !== this.dfa.numStates - 1 || c !== this.dfa.numInput - 1) {
              this.print(', ');
            }
            
            ++n;
          }
        }
      }
    }
    
    this.println('');
    this.println('  };');
  }
  
  private emitCharMapArrayUnPacked () {
    const cl = this.parser.getCharClasses();
    this.intervalls = cl.getIntervals();
    this.println('');
    this.println('  /** ');
    this.println('   * Translates characters to character classes');
    this.println('   */');
    this.println('  private static final char [] ZZ_CMAP = {');
    let n = 0;
    this.print('    ');
    const max = cl.getMaxCharCode();
    
    for (let i = 0; i < this.intervalls.length && this.intervalls[i].start <= max; ++i) {
      const end = Math.min(this.intervalls[i].end, max);
      
      for (let c = this.intervalls[i].start; c <= end; ++c) {
        this.print(this.colMap[this.intervalls[i].charClass], 2);
        if (c < max) {
          this.print(', ');
          ++n;
          if (n >= 16) {
            this.println('');
            this.print('    ');
            n = 0;
          }
        }
      }
    }
    
    this.println('');
    this.println('  };');
    this.println('');
  }
  
  private emitCharMapArray () {
    const cl = this.parser.getCharClasses();
    if (cl.getMaxCharCode() < 256) {
      this.emitCharMapArrayUnPacked();
    } else {
      this.intervalls = cl.getIntervals();
      this.println('');
      this.println('  /** ');
      this.println('   * Translates characters to character classes');
      this.println('   */');
      this.println('  private static final String ZZ_CMAP_PACKED = ');
      let n = 0;
      this.print('    "');
      
      let i;
      for (i = 0; i < this.intervalls.length - 1; ++i) {
        const count = this.intervalls[i].end - this.intervalls[i].start + 1;
        const value = this.colMap[this.intervalls[i].charClass];
        this.printUC(count);
        this.printUC(value);
        ++n;
        if (n >= 10) {
          this.println('"+');
          this.print('    "');
          n = 0;
        }
      }
      
      this.printUC(this.intervalls[i].end - this.intervalls[i].start + 1);
      this.printUC(this.colMap[this.intervalls[i].charClass]);
      this.println('";');
      this.println('');
      this.println('  /** ');
      this.println('   * Translates characters to character classes');
      this.println('   */');
      this.println('  private static final char [] ZZ_CMAP = zzUnpackCMap(ZZ_CMAP_PACKED);');
      this.println('');
    }
  }
  
  private printUC (c: number) {
    if (c > 255) {
      this.out.print('\\u');
      if (c < 4096) {
        this.out.print('0');
      }
      
      this.out.print(Number(c).toString(16));
    } else {
      this.out.print('\\');
      this.out.print(Number(c).toString(8));
    }
    
  }
  
  private emitRowMapArray () {
    this.println('');
    this.println('  /** ');
    this.println('   * Translates a state to a row index in the transition table');
    this.println('   */');
    const e = new HiLowEmitter('RowMap');
    e.emitInit();
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      e.emit(this.rowMap[i] * this.numCols);
    }
    
    e.emitUnpack();
    this.println(e.toString());
  }
  
  private emitAttributes () {
    this.println('  /**');
    this.println('   * ZZ_ATTRIBUTE[aState] contains the attributes of state <code>aState</code>');
    this.println('   */');
    const e = new CountEmitter('Attribute');
    e.emitInit();
    let count = 1;
    let value = 0;
    if (this.dfa.isFinal[0]) {
      value = 1;
    }
    
    if (this.dfa.isPushback[0]) {
      value |= 2;
    }
    
    if (this.dfa.isLookEnd[0]) {
      value |= 4;
    }
    
    if (!this.isTransition[0]) {
      value |= 8;
    }
    
    for (let i = 1; i < this.dfa.numStates; ++i) {
      let attribute = 0;
      if (this.dfa.isFinal[i]) {
        attribute = 1;
      }
      
      if (this.dfa.isPushback[i]) {
        attribute |= 2;
      }
      
      if (this.dfa.isLookEnd[i]) {
        attribute |= 4;
      }
      
      if (!this.isTransition[i]) {
        attribute |= 8;
      }
      
      if (value === attribute) {
        ++count;
      } else {
        e.emit(count, value);
        count = 1;
        value = attribute;
      }
    }
    
    e.emit(count, value);
    e.emitUnpack();
    this.println(e.toString());
  }
  
  private emitClassCode () {
    if (this.scanner.eofCode !== null) {
      this.println('  /** denotes if the user-EOF-code has already been executed */');
      this.println('  private boolean zzEOFDone;');
      this.println('');
    }
    
    if (this.scanner.classCode !== null) {
      this.println('  /* user code: */');
      this.println(this.scanner.classCode);
    }
    
  }
  
  private emitConstructorDecl () {
    this.print('  ');
    if (this.scanner.isPublic) {
      this.print('public ');
    }
    
    this.print(this.scanner.className);
    this.print('(java.io.Reader in)');
    if (this.scanner.initThrow !== null) {
      this.print(' throws ');
      this.print(this.scanner.initThrow);
    }
    
    this.println(' {');
    if (this.scanner.initCode !== null) {
      this.print('  ');
      this.print(this.scanner.initCode);
    }
    
    this.println('    this.zzReader = in;');
    this.println('  }');
    this.println('');
    this.println('  /**');
    this.println('   * Creates a new scanner.');
    this.println('   * There is also java.io.Reader version of this constructor.');
    this.println('   *');
    this.println('   * @param   in  the java.io.Inputstream to read input from.');
    this.println('   */');
    this.print('  ');
    if (this.scanner.isPublic) {
      this.print('public ');
    }
    
    this.print(this.scanner.className);
    this.print('(java.io.InputStream in)');
    if (this.scanner.initThrow !== null) {
      this.print(' throws ');
      this.print(this.scanner.initThrow);
    }
    
    this.println(' {');
    this.println('    this(new java.io.InputStreamReader(in));');
    this.println('  }');
  }
  
  private emitDoEOF () {
    if (this.scanner.eofCode !== null) {
      this.println('  /**');
      this.println('   * Contains user EOF-code, which will be executed exactly once,');
      this.println('   * when the end of file is reached');
      this.println('   */');
      this.print('  private  zzDoEOF()');
      if (this.scanner.eofThrow !== null) {
        this.print(' throws ');
        this.print(this.scanner.eofThrow);
      }
      
      this.println(' {');
      this.println('    if (!zzEOFDone) {');
      this.println('      zzEOFDone = true;');
      this.println('    ' + this.scanner.eofCode);
      this.println('    }');
      this.println('  }');
      this.println('');
      this.println('');
    }
  }
  
  private emitLexFunctHeader () {
    if (this.scanner.cupCompatible) {
      this.print('  public ');
    } else {
      this.print('  ' + this.visibility + ' ');
    }
    
    if (this.scanner.tokenType === null) {
      if (this.scanner.isInteger) {
        this.print('int');
      } else if (this.scanner.isIntWrap) {
        this.print('Integer');
      } else {
        this.print('Yytoken');
      }
    } else {
      this.print(this.scanner.tokenType);
    }
    
    this.print(' ');
    this.print(this.scanner.functionName);
    this.print('() throws java.io.IOException');
    if (this.scanner.lexThrow !== null) {
      this.print(', ');
      this.print(this.scanner.lexThrow);
    }
    
    if (this.scanner.scanErrorException !== null) {
      this.print(', ');
      this.print(this.scanner.scanErrorException);
    }
    
    this.println(' {');
    this.skel.emitNext();
    if (this.scanner.useRowMap) {
      this.println('    int [] zzTransL = ZZ_TRANS;');
      this.println('    int [] zzRowMapL = ZZ_ROWMAP;');
      this.println('    int [] zzAttrL = ZZ_ATTRIBUTE;');
    }
    
    if (this.scanner.lookAheadUsed) {
      this.println('    int zzPushbackPosL = zzPushbackPos = -1;');
      this.println('    boolean zzWasPushback;');
    }
    
    this.skel.emitNext();
    if (this.scanner.charCount) {
      this.println('      yychar+= zzMarkedPosL-zzStartRead;');
      this.println('');
    }
    
    if (this.scanner.lineCount || this.scanner.columnCount) {
      this.println('      boolean zzR = false;');
      this.println('      for (zzCurrentPosL = zzStartRead; zzCurrentPosL < zzMarkedPosL;');
      this.println('                                                             zzCurrentPosL++) {');
      this.println('        switch (zzBufferL[zzCurrentPosL]) {');
      this.println('        case \'\\u000B\':');
      this.println('        case \'\\u000C\':');
      this.println('        case \'\\u0085\':');
      this.println('        case \'\\u2028\':');
      this.println('        case \'\\u2029\':');
      if (this.scanner.lineCount) {
        this.println('          yyline++;');
      }
      
      if (this.scanner.columnCount) {
        this.println('          yycolumn = 0;');
      }
      
      this.println('          zzR = false;');
      this.println('          break;');
      this.println('        case \'\\r\':');
      if (this.scanner.lineCount) {
        this.println('          yyline++;');
      }
      
      if (this.scanner.columnCount) {
        this.println('          yycolumn = 0;');
      }
      
      this.println('          zzR = true;');
      this.println('          break;');
      this.println('        case \'\\n\':');
      this.println('          if (zzR)');
      this.println('            zzR = false;');
      this.println('          else {');
      if (this.scanner.lineCount) {
        this.println('            yyline++;');
      }
      
      if (this.scanner.columnCount) {
        this.println('            yycolumn = 0;');
      }
      
      this.println('          }');
      this.println('          break;');
      this.println('        default:');
      this.println('          zzR = false;');
      if (this.scanner.columnCount) {
        this.println('          yycolumn++;');
      }
      
      this.println('        }');
      this.println('      }');
      this.println('');
      if (this.scanner.lineCount) {
        this.println('      if (zzR) {');
        this.println('        // peek one character ahead if it is \\n (if we have counted one line too much)');
        this.println('        boolean zzPeek;');
        this.println('        if (zzMarkedPosL < zzEndReadL)');
        this.println('          zzPeek = zzBufferL[zzMarkedPosL] === \'\\n\';');
        this.println('        else if (zzAtEOF)');
        this.println('          zzPeek = false;');
        this.println('        else {');
        this.println('          boolean eof = zzRefill();');
        this.println('          zzMarkedPosL = zzMarkedPos;');
        this.println('          zzBufferL = zzBuffer;');
        this.println('          if (eof) ');
        this.println('            zzPeek = false;');
        this.println('          else ');
        this.println('            zzPeek = zzBufferL[zzMarkedPosL] === \'\\n\';');
        this.println('        }');
        this.println('        if (zzPeek) yyline--;');
        this.println('      }');
      }
    }
    
    if (this.scanner.bolUsed) {
      this.println('      if (zzMarkedPosL > zzStartRead) {');
      this.println('        switch (zzBufferL[zzMarkedPosL-1]) {');
      this.println('        case \'\\n\':');
      this.println('        case \'\\u000B\':');
      this.println('        case \'\\u000C\':');
      this.println('        case \'\\u0085\':');
      this.println('        case \'\\u2028\':');
      this.println('        case \'\\u2029\':');
      this.println('          zzAtBOL = true;');
      this.println('          break;');
      this.println('        case \'\\r\': ');
      this.println('          if (zzMarkedPosL < zzEndReadL)');
      this.println('            zzAtBOL = zzBufferL[zzMarkedPosL] !== \'\\n\';');
      this.println('          else if (zzAtEOF)');
      this.println('            zzAtBOL = false;');
      this.println('          else {');
      this.println('            boolean eof = zzRefill();');
      this.println('            zzMarkedPosL = zzMarkedPos;');
      this.println('            zzBufferL = zzBuffer;');
      this.println('            if (eof) ');
      this.println('              zzAtBOL = false;');
      this.println('            else ');
      this.println('              zzAtBOL = zzBufferL[zzMarkedPosL] !== \'\\n\';');
      this.println('          }');
      this.println('          break;');
      this.println('        default:');
      this.println('          zzAtBOL = false;');
      this.println('        }');
      this.println('      }');
    }
    
    this.skel.emitNext();
    if (this.scanner.bolUsed) {
      this.println('      if (zzAtBOL)');
      this.println('        zzState = ZZ_LEXSTATE[zzLexicalState+1];');
      this.println('      else');
      this.println('        zzState = ZZ_LEXSTATE[zzLexicalState];');
      this.println('');
    } else {
      this.println('      zzState = zzLexicalState;');
      this.println('');
    }
    
    if (this.scanner.lookAheadUsed) {
      this.println('      zzWasPushback = false;');
    }
    
    this.skel.emitNext();
  }
  
  private emitGetRowMapNext () {
    this.println('          int zzNext = zzTransL[ zzRowMapL[zzState] + zzCMapL[zzInput] ];');
    this.println('          if (zzNext === -1) break zzForAction;');
    this.println('          zzState = zzNext;');
    this.println('');
    this.println('          int zzAttributes = zzAttrL[zzState];');
    if (this.scanner.lookAheadUsed) {
      this.println('          if ( (zzAttributes & 2) === 2 )');
      this.println('            zzPushbackPosL = zzCurrentPosL;');
      this.println('');
    }
    
    this.println('          if ( (zzAttributes & 1) === 1 ) {');
    if (this.scanner.lookAheadUsed) {
      this.println('            zzWasPushback = (zzAttributes & 4) === 4;');
    }
    
    this.skel.emitNext();
    this.println('            if ( (zzAttributes & 8) === 8 ) break zzForAction;');
    this.skel.emitNext();
  }
  
  private emitTransitionTable () {
    this.transformTransitionTable();
    this.println('          zzInput = zzCMapL[zzInput];');
    this.println('');
    if (this.scanner.lookAheadUsed) {
      this.println('          boolean zzPushback = false;');
    }
    
    this.println('          boolean zzIsFinal = false;');
    this.println('          boolean zzNoLookAhead = false;');
    this.println('');
    this.println('          zzForNext: { switch (zzState) {');
    
    for (let state = 0; state < this.dfa.numStates; ++state) {
      if (this.isTransition[state]) {
        this.emitState(state);
      }
    }
    
    this.println('            default:');
    this.println('              // if this is ever reached, there is a serious bug in JFlex');
    this.println('              zzScanError(ZZ_UNKNOWN_ERROR);');
    this.println('              break;');
    this.println('          } }');
    this.println('');
    this.println('          if ( zzIsFinal ) {');
    if (this.scanner.lookAheadUsed) {
      this.println('            zzWasPushback = zzPushback;');
    }
    
    this.skel.emitNext();
    this.println('            if ( zzNoLookAhead ) break zzForAction;');
    this.skel.emitNext();
  }
  
  private escapify (s: string) {
    let result = '';
    
    for (let i = 0; i < s.length; ++i) {
      const c = s.charAt(i);
      switch (c) {
        case '\t':
          result += ('\\t');
          break;
        case '\n':
          result += ('"+ZZ_NL+"');
          break;
        case '\r':
          if (i + 1 === s.length || s.charAt(i + 1) !== '\n') {
            result += ('"+ZZ_NL+"');
          }
          break;
        case '"':
          result += ('\\"');
          break;
        case '\'':
          result += ('\\\'');
          break;
        case '\\':
          result += ('\\\\');
          break;
        default:
          result += (c);
      }
    }
    
    return result.toString();
  }
  
  private emitActions () {
    this.println('      switch (zzAction < 0 ? zzAction : ZZ_ACTION[zzAction]) {');
    let i = this.actionTable.size + 1;
    this.actionTable.forEach((value: number, action: Action) => {
      const label = <number>this.actionTable.get(action);
      this.println('        case ' + label + ': ');
      if (this.scanner.debugOption) {
        this.print('          System.out.println(');
        if (this.scanner.lineCount) {
          this.print('"line: "+(yyline+1)+" "+');
        }
        
        if (this.scanner.columnCount) {
          this.print('"col: "+(yycolumn+1)+" "+');
        }
        
        this.println('"match: --"+yytext()+"--");');
        this.print('          System.out.println("action [' + action.priority + '] { ');
        this.print(this.escapify(action.content));
        this.println(' }");');
      }
      
      this.println('          { ' + action.content);
      this.println('          }');
      this.println('        case ' + i++ + ': break;');
    });
  }
  
  private emitEOFVal () {
    const eofActions = this.parser.getEOFActions();
    if (this.scanner.eofCode !== null) {
      this.println('            zzDoEOF();');
    }
    
    if (eofActions.numActions() > 0) {
      this.println('            switch (zzLexicalState) {');
      const stateNames = this.scanner.states.states;
      const used = new Map<number, string>();
      let last = this.dfa.numStates;
      stateNames.forEach((value: number, name: string) => {
        const num = this.scanner.states.getNumber(name);
        const action = eofActions.getAction(num);
        let unused = true;
        if (!this.scanner.bolUsed) {
          const key = this.dfa.lexState[2 * num];
          unused = used.get(key) === null;
          if (!unused) {
            Out.warning('Lexical states <' + name + '> and <' + used.get(key) + '> are equivalent.', -1, -1);
          } else {
            used.set(key, name);
          }
        }
        
        if (action !== null && unused) {
          this.println('            case ' + name + ':');
          this.println('              { ' + action.content + ' }');
          const var10001 = ('            case ');
          ++last;
          this.println(var10001 + (last) + (': break;').toString());
        }
      });
      for (const obj in stateNames) {
      
      }
      
      this.println('            default:');
    }
    
    if (eofActions.getDefault() !== null) {
      this.println('              { ' + eofActions.getDefault().content + ' }');
    } else if (this.scanner.eofVal !== null) {
      this.println('              { ' + this.scanner.eofVal + ' }');
    } else if (this.scanner.isInteger) {
      this.println('            return YYEOF;');
    } else {
      this.println('            return null;');
    }
    
    if (eofActions.numActions() > 0) {
      this.println('            }');
    }
    
  }
  
  private emitState (state) {
    this.println('            case ' + state + ':');
    this.println('              switch (zzInput) {');
    const defaultTransition = this.getDefaultTransition(state);
    
    for (let next = 0; next < this.dfa.numStates; ++next) {
      if (next !== defaultTransition && this.table[state][next] !== null) {
        this.emitTransition(state, next);
      }
    }
    
    if (defaultTransition !== -1 && this.noTarget[state] !== null) {
      this.emitTransition(state, -1);
    }
    
    this.emitDefaultTransition(state, defaultTransition);
    this.println('              }');
    this.println('');
  }
  
  private emitTransition (state, nextState) {
    let chars: CharSetEnumerator;
    if (nextState !== -1) {
      chars = this.table[state][nextState].characters();
    } else {
      chars = this.noTarget[state].characters();
    }
    
    this.print('                case ');
    this.print(chars.nextElement());
    this.print(': ');
    
    while (chars.hasMoreElements()) {
      this.println('');
      this.print('                case ');
      this.print(chars.nextElement());
      this.print(': ');
    }
    
    if (nextState !== -1) {
      if (this.dfa.isFinal[nextState]) {
        this.print('zzIsFinal = true; ');
      }
      
      if (this.dfa.isPushback[nextState]) {
        this.print('zzPushbackPosL = zzCurrentPosL; ');
      }
      
      if (this.dfa.isLookEnd[nextState]) {
        this.print('zzPushback = true; ');
      }
      
      if (!this.isTransition[nextState]) {
        this.print('zzNoLookAhead = true; ');
      }
      
      if (nextState === state) {
        this.println('zzState = ' + nextState + '; break zzForNext;');
      } else {
        this.println('zzState = ' + nextState + '; break zzForNext;');
      }
    } else {
      this.println('break zzForAction;');
    }
    
  }
  
  private emitDefaultTransition (state, nextState) {
    this.print('                default: ');
    if (nextState !== -1) {
      if (this.dfa.isFinal[nextState]) {
        this.print('zzIsFinal = true; ');
      }
      
      if (this.dfa.isPushback[nextState]) {
        this.print('zzPushbackPosL = zzCurrentPosL; ');
      }
      
      if (this.dfa.isLookEnd[nextState]) {
        this.print('zzPushback = true; ');
      }
      
      if (!this.isTransition[nextState]) {
        this.print('zzNoLookAhead = true; ');
      }
      
      if (nextState === state) {
        this.println('zzState = ' + nextState + '; break zzForNext;');
      } else {
        this.println('zzState = ' + nextState + '; break zzForNext;');
      }
    } else {
      this.println('break zzForAction;');
    }
    
  }
  
  private emitPushback () {
    this.println('      if (zzWasPushback)');
    this.println('        zzMarkedPos = zzPushbackPosL;');
  }
  
  private getDefaultTransition (state: number) {
    let max = 0;
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      if (this.table[state][max] === null) {
        max = i;
      } else if (this.table[state][i] !== null && this.table[state][max].size() < this.table[state][i].size()) {
        max = i;
      }
    }
    
    if (this.table[state][max] === null) {
      return -1;
    } else if (this.noTarget[state] === null) {
      return max;
    } else {
      if (this.table[state][max].size() < this.noTarget[state].size()) {
        max = -1;
      }
      
      return max;
    }
  }
  
  private transformTransitionTable () {
    const numInput = this.parser.getCharClasses().getNumClasses() + 1;
    this.table = new CharSet[this.dfa.numStates][this.dfa.numStates];
    this.noTarget = new CharSet[this.dfa.numStates];
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      for (let j = 0; j < this.dfa.numInput; ++j) {
        const nextState = this.dfa.table[i][j];
        if (nextState === -1) {
          if (this.noTarget[i] === null) {
            this.noTarget[i] = new CharSet(numInput, this.colMap[j]);
          } else {
            this.noTarget[i].add(this.colMap[j]);
          }
        } else if (this.table[i][nextState] === null) {
          this.table[i][nextState] = new CharSet(numInput, this.colMap[j]);
        } else {
          this.table[i][nextState].add(this.colMap[j]);
        }
      }
    }
    
  }
  
  private findActionStates () {
    this.isTransition = [];
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      for (let j = 0; !this.isTransition[i] && j < this.dfa.numInput; this.isTransition[i] = this.dfa.table[i][j++] !== -1) {
      
      }
    }
    
  }
  
  private reduceColumns () {
    this.colMap = [];
    this.colKilled = [];
    let translate = 0;
    this.numCols = this.dfa.numInput;
    
    for (let i = 0; i < this.dfa.numInput; ++i) {
      this.colMap[i] = i - translate;
      let equal: boolean;
      for (let j = 0; j < i; ++j) {
        let k = -1;
        
        for (equal = true; equal; equal = this.dfa.table[k][i] === this.dfa.table[k][j]) {
          ++k;
          if (k >= this.dfa.numStates) {
            break;
          }
        }
        
        if (equal) {
          ++translate;
          this.colMap[i] = this.colMap[j];
          this.colKilled[i] = true;
          --this.numCols;
          break;
        }
      }
    }
    
  }
  
  private reduceRows () {
    this.rowMap = [];
    this.rowKilled = [];
    let translate = 0;
    this.numRows = this.dfa.numStates;
    
    for (let i = 0; i < this.dfa.numStates; ++i) {
      this.rowMap[i] = i - translate;
      
      for (let j = 0; j < i; ++j) {
        let k = -1;
        
        let equal: boolean;
        for (equal = true; equal; equal = this.dfa.table[i][k] === this.dfa.table[j][k]) {
          ++k;
          if (k >= this.dfa.numInput) {
            break;
          }
        }
        
        if (equal) {
          ++translate;
          this.rowMap[i] = this.rowMap[j];
          this.rowKilled[i] = true;
          --this.numRows;
          break;
        }
      }
    }
    
  }
  
  private setupEOFCode () {
    if (this.scanner.eofclose) {
      this.scanner.eofCode = LexScan.conc(this.scanner.eofCode, '  yyclose();');
      this.scanner.eofThrow = LexScan.concExc(this.scanner.eofThrow, 'java.io.IOException');
    }
    
  }
}
