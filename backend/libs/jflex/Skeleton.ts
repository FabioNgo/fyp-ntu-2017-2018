import {ErrorMessages} from './ErrorMessages';
import {JavaVector} from '../JavaVector';
import {PrintWriter} from './PrintWriter';

export class Skeleton {
  public static lines = [];
  public static skeleton_default = '\n' +
    '  /** This character denotes the end of file */\n' +
    '  public static final int YYEOF = -1;\n' +
    '\n' +
    '  /** initial size of the lookahead buffer */\n' +
    '--- private static final int ZZ_BUFFERSIZE = ...;\n' +
    '\n' +
    '  /** lexical states */\n' +
    '---  lexical states, charmap\n' +
    '\n' +
    '  /* error codes */\n' +
    '  private static final int ZZ_UNKNOWN_ERROR = 0;\n' +
    '  private static final int ZZ_NO_MATCH = 1;\n' +
    '  private static final int ZZ_PUSHBACK_2BIG = 2;\n' +
    '\n' +
    '  /* error messages for the codes above */\n' +
    '  private static final String ZZ_ERROR_MSG[] = {\n' +
    '    "Unkown internal scanner error",\n' +
    '    "Error: could not match input",\n' +
    '    "Error: pushback value was too large"\n' +
    '  };\n' +
    '\n' +
    '--- isFinal list\n' +
    '  /** the input device */\n' +
    '  private java.io.Reader zzReader;\n' +
    '\n' +
    '  /** the current state of the DFA */\n' +
    '  private int zzState;\n' +
    '\n' +
    '  /** the current lexical state */\n' +
    '  private int zzLexicalState = YYINITIAL;\n' +
    '\n' +
    '  /** this buffer contains the current text to be matched and is\n' +
    '      the source of the yytext() string */\n' +
    '  private char zzBuffer[] = new char[ZZ_BUFFERSIZE];\n' +
    '\n' +
    '  /** the textposition at the last accepting state */\n' +
    '  private int zzMarkedPos;\n' +
    '\n' +
    '  /** the textposition at the last state to be included in yytext */\n' +
    '  private int zzPushbackPos;\n' +
    '\n' +
    '  /** the current text position in the buffer */\n' +
    '  private int zzCurrentPos;\n' +
    '\n' +
    '  /** startRead marks the beginning of the yytext() string in the buffer */\n' +
    '  private int zzStartRead;\n' +
    '\n' +
    '  /** endRead marks the last character in the buffer, that has been read\n' +
    '      from input */\n' +
    '  private int zzEndRead;\n' +
    '\n' +
    '  /** number of newlines encountered up to the start of the matched text */\n' +
    '  private int yyline;\n' +
    '\n' +
    '  /** the number of characters up to the start of the matched text */\n' +
    '  private int yychar;\n' +
    '\n' +
    '  /**\n' +
    '   * the number of characters from the last newline up to the start of the\n' +
    '   * matched text\n' +
    '   */\n' +
    '  private int yycolumn;\n' +
    '\n' +
    '  /**\n' +
    '   * zzAtBOL == true <=> the scanner is currently at the beginning of a line\n' +
    '   */\n' +
    '  private boolean zzAtBOL = true;\n' +
    '\n' +
    '  /** zzAtEOF == true <=> the scanner is at the EOF */\n' +
    '  private boolean zzAtEOF;\n' +
    '\n' +
    '--- user class code\n' +
    '\n' +
    '  /**\n' +
    '   * Creates a new scanner\n' +
    '   * There is also a java.io.InputStream version of this constructor.\n' +
    '   *\n' +
    '   * @param   in  the java.io.Reader to read input from.\n' +
    '   */\n' +
    '--- constructor declaration\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Refills the input buffer.\n' +
    '   *\n' +
    '   * @return      <code>false</code>, iff there was new input.\n' +
    '   *\n' +
    '   * @exception   java.io.IOException  if any I/O-Error occurs\n' +
    '   */\n' +
    '  private boolean zzRefill() throws java.io.IOException {\n' +
    '\n' +
    '    /* first: make room (if you can) */\n' +
    '    if (zzStartRead > 0) {\n' +
    '      System.arraycopy(zzBuffer, zzStartRead,\n' +
    '                       zzBuffer, 0,\n' +
    '                       zzEndRead-zzStartRead);\n' +
    '\n' +
    '      /* translate stored positions */\n' +
    '      zzEndRead-= zzStartRead;\n' +
    '      zzCurrentPos-= zzStartRead;\n' +
    '      zzMarkedPos-= zzStartRead;\n' +
    '      zzPushbackPos-= zzStartRead;\n' +
    '      zzStartRead = 0;\n' +
    '    }\n' +
    '\n' +
    '    /* is the buffer big enough? */\n' +
    '    if (zzCurrentPos >= zzBuffer.length) {\n' +
    '      /* if not: blow it up */\n' +
    '      char newBuffer[] = new char[zzCurrentPos*2];\n' +
    '      System.arraycopy(zzBuffer, 0, newBuffer, 0, zzBuffer.length);\n' +
    '      zzBuffer = newBuffer;\n' +
    '    }\n' +
    '\n' +
    '    /* finally: fill the buffer with new input */\n' +
    '    int numRead = zzReader.read(zzBuffer, zzEndRead,\n' +
    '                                            zzBuffer.length-zzEndRead);\n' +
    '\n' +
    '    if (numRead < 0) {\n' +
    '      return true;\n' +
    '    }\n' +
    '    else {\n' +
    '      zzEndRead+= numRead;\n' +
    '      return false;\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Closes the input stream.\n' +
    '   */\n' +
    '  public final void yyclose() throws java.io.IOException {\n' +
    '    zzAtEOF = true;            /* indicate end of file */\n' +
    '    zzEndRead = zzStartRead;  /* invalidate buffer    */\n' +
    '\n' +
    '    if (zzReader != null)\n' +
    '      zzReader.close();\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Resets the scanner to read from a new input stream.\n' +
    '   * Does not close the old reader.\n' +
    '   *\n' +
    '   * All internal variables are reset, the old input stream\n' +
    '   * <b>cannot</b> be reused (internal buffer is discarded and lost).\n' +
    '   * Lexical state is set to <tt>ZZ_INITIAL</tt>.\n' +
    '   *\n' +
    '   * @param reader   the new input stream\n' +
    '   */\n' +
    '  public final void yyreset(java.io.Reader reader) {\n' +
    '    zzReader = reader;\n' +
    '    zzAtBOL  = true;\n' +
    '    zzAtEOF  = false;\n' +
    '    zzEndRead = zzStartRead = 0;\n' +
    '    zzCurrentPos = zzMarkedPos = zzPushbackPos = 0;\n' +
    '    yyline = yychar = yycolumn = 0;\n' +
    '    zzLexicalState = YYINITIAL;\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Returns the current lexical state.\n' +
    '   */\n' +
    '  public final int yystate() {\n' +
    '    return zzLexicalState;\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Enters a new lexical state\n' +
    '   *\n' +
    '   * @param newState the new lexical state\n' +
    '   */\n' +
    '  public final void yybegin(int newState) {\n' +
    '    zzLexicalState = newState;\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Returns the text matched by the current regular expression.\n' +
    '   */\n' +
    '  public final String yytext() {\n' +
    '    return new String( zzBuffer, zzStartRead, zzMarkedPos-zzStartRead );\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Returns the character at position <tt>pos</tt> from the\n' +
    '   * matched text.\n' +
    '   *\n' +
    '   * It is equivalent to yytext().charAt(pos), but faster\n' +
    '   *\n' +
    '   * @param pos the position of the character to fetch.\n' +
    '   *            A value from 0 to yylength()-1.\n' +
    '   *\n' +
    '   * @return the character at position pos\n' +
    '   */\n' +
    '  public final char yycharat(int pos) {\n' +
    '    return zzBuffer[zzStartRead+pos];\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Returns the length of the matched text region.\n' +
    '   */\n' +
    '  public final int yylength() {\n' +
    '    return zzMarkedPos-zzStartRead;\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Reports an error that occured while scanning.\n' +
    '   *\n' +
    '   * In a wellformed scanner (no or only correct usage of\n' +
    '   * yypushback(int) and a match-all fallback rule) this method\n' +
    '   * will only be called with things that "Can\'t Possibly Happen".\n' +
    '   * If this method is called, something is seriously wrong\n' +
    '   * (e.g. a JFlex bug producing a faulty scanner etc.).\n' +
    '   *\n' +
    '   * Usual syntax/scanner level error handling should be done\n' +
    '   * in error fallback rules.\n' +
    '   *\n' +
    '   * @param   errorCode  the code of the errormessage to display\n' +
    '   */\n' +
    '--- zzScanError declaration\n' +
    '    String message;\n' +
    '    try {\n' +
    '      message = ZZ_ERROR_MSG[errorCode];\n' +
    '    }\n' +
    '    catch (ArrayIndexOutOfBoundsException e) {\n' +
    '      message = ZZ_ERROR_MSG[ZZ_UNKNOWN_ERROR];\n' +
    '    }\n' +
    '\n' +
    '--- throws clause\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '  /**\n' +
    '   * Pushes the specified amount of characters back into the input stream.\n' +
    '   *\n' +
    '   * They will be read again by then next call of the scanning method\n' +
    '   *\n' +
    '   * @param number  the number of characters to be read again.\n' +
    '   *                This number must not be greater than yylength()!\n' +
    '   */\n' +
    '--- yypushback decl (contains zzScanError exception)\n' +
    '    if ( number > yylength() )\n' +
    '      zzScanError(ZZ_PUSHBACK_2BIG);\n' +
    '\n' +
    '    zzMarkedPos -= number;\n' +
    '  }\n' +
    '\n' +
    '\n' +
    '--- zzDoEOF\n' +
    '  /**\n' +
    '   * Resumes scanning until the next regular expression is matched,\n' +
    '   * the end of input is encountered or an I/O-Error occurs.\n' +
    '   *\n' +
    '   * @return      the next token\n' +
    '   * @exception   java.io.IOException  if any I/O-Error occurs\n' +
    '   */\n' +
    '--- yylex declaration\n' +
    '    int zzInput;\n' +
    '    int zzAction;\n' +
    '\n' +
    '    /* cached fields: */\n' +
    '    int zzCurrentPosL;\n' +
    '    int zzMarkedPosL;\n' +
    '    int zzEndReadL = zzEndRead;\n' +
    '    char [] zzBufferL = zzBuffer;\n' +
    '    char [] zzCMapL = ZZ_CMAP;\n' +
    '\n' +
    '--- local declarations\n' +
    '\n' +
    '    while (true) {\n' +
    '      zzMarkedPosL = zzMarkedPos;\n' +
    '\n' +
    '--- start admin (line, char, col count)\n' +
    '      zzAction = -1;\n' +
    '\n' +
    '      zzCurrentPosL = zzCurrentPos = zzStartRead = zzMarkedPosL;\n' +
    '\n' +
    '--- start admin (lexstate etc)\n' +
    '\n' +
    '      zzForAction: {\n' +
    '        while (true) {\n' +
    '\n' +
    '--- next input, line, col, char count, next transition, isFinal action\n' +
    '            zzAction = zzState;\n' +
    '            zzMarkedPosL = zzCurrentPosL;\n' +
    '--- line count update\n' +
    '          }\n' +
    '\n' +
    '        }\n' +
    '      }\n' +
    '\n' +
    '      /* store back cached position*/\n' +
    '      zzMarkedPos = zzMarkedPosL;\n' +
    '--- char count update\n' +
    '\n' +
    '--- actions\n' +
    '        default:\n' +
    '          if (zzInput == YYEOF && zzStartRead == zzCurrentPos) {\n' +
    '            zzAtEOF = true;\n' +
    '--- eofvalue\n' +
    '          }\n' +
    '          else {\n' +
    '--- no match\n' +
    '          }\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '--- main\n' +
    '\n' +
    '}\n';
  private static readonly size = 21;
  private static readonly NL = '\n';
  private pos = 0;
  private out: PrintWriter;
  
  public constructor (out: PrintWriter) {
    this.out = out;
    // Skeleton.readSkelFile();
    Skeleton.readSkel();
  }
  
  public static makePrivate () {
    for (let i = 0; i < this.lines.length; ++i) {
      Skeleton.lines[i] = Skeleton.replace(' public ', ' private ', Skeleton.lines[i]);
    }
    
  }
  
  public static readSkelFile () {
    // const reader = new JavaFileReader(new File(this.lines, 'skeleton.default'));
    // this.readSkel(reader);
  }
  
  public static readSkel () {
    let section = '';
    const lines = new JavaVector<string>();
    const readerLines = this.skeleton_default.split('\n');
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
      this.lines = [];
      
      for (let i = 0; i < 21; ++i) {
        this.lines[i] = lines.elementAt(i);
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
  
  public emitNext () {
    return this.out.print(Skeleton.lines[this.pos++]);
  }
}
