export class ErrorMessages {
  // private static readonly ResourceBundle RESOURCE_BUNDLE = ResourceBundle.getBundle("JFlex.Messages");
  public static UNTERMINATED_STR = new ErrorMessages('UNTERMINATED_STR');
  public static EOF_WO_ACTION = new ErrorMessages('EOF_WO_ACTION');
  public static EOF_SINGLERULE = new ErrorMessages('EOF_SINGLERULE');
  public static UNKNOWN_OPTION = new ErrorMessages('UNKNOWN_OPTION');
  public static UNEXPECTED_CHAR = new ErrorMessages('UNEXPECTED_CHAR');
  public static UNEXPECTED_NL = new ErrorMessages('UNEXPECTED_NL');
  public static LEXSTATE_UNDECL = new ErrorMessages('LEXSTATE_UNDECL');
  public static STATE_IDENT_EXP = new ErrorMessages('STATE_IDENT_EXP');
  public static REPEAT_ZERO = new ErrorMessages('REPEAT_ZERO');
  public static REPEAT_GREATER = new ErrorMessages('REPEAT_GREATER');
  public static REGEXP_EXPECTED = new ErrorMessages('REGEXP_EXPECTED');
  public static MACRO_UNDECL = new ErrorMessages('MACRO_UNDECL');
  public static CHARSET_2_SMALL = new ErrorMessages('CHARSET_2_SMALL');
  public static CS2SMALL_STRING = new ErrorMessages('CS2SMALL_STRING');
  public static CS2SMALL_CHAR = new ErrorMessages('CS2SMALL_CHAR');
  public static CHARCLASS_MACRO = new ErrorMessages('CHARCLASS_MACRO');
  public static UNKNOWN_SYNTAX = new ErrorMessages('UNKNOWN_SYNTAX');
  public static SYNTAX_ERROR = new ErrorMessages('SYNTAX_ERROR');
  public static NOT_AT_BOL = new ErrorMessages('NOT_AT_BOL');
  public static NO_MATCHING_BR = new ErrorMessages('NO_MATCHING_BR');
  public static EOF_IN_ACTION = new ErrorMessages('EOF_IN_ACTION');
  public static EOF_IN_COMMENT = new ErrorMessages('EOF_IN_COMMENT');
  public static EOF_IN_STRING = new ErrorMessages('EOF_IN_STRING');
  public static EOF_IN_MACROS = new ErrorMessages('EOF_IN_MACROS');
  public static EOF_IN_STATES = new ErrorMessages('EOF_IN_STATES');
  public static EOF_IN_REGEXP = new ErrorMessages('EOF_IN_REGEXP');
  public static UNEXPECTED_EOF = new ErrorMessages('UNEXPECTED_EOF');
  public static NO_LEX_SPEC = new ErrorMessages('NO_LEX_SPEC');
  public static NO_LAST_ACTION = new ErrorMessages('NO_LAST_ACTION');
  public static LOOKAHEAD_ERROR = new ErrorMessages('LOOKAHEAD_ERROR');
  public static NO_DIRECTORY = new ErrorMessages('NO_DIRECTORY');
  public static NO_SKEL_FILE = new ErrorMessages('NO_SKEL_FILE');
  public static WRONG_SKELETON = new ErrorMessages('WRONG_SKELETON');
  public static OUT_OF_MEMORY = new ErrorMessages('OUT_OF_MEMORY');
  public static QUIL_INITTHROW = new ErrorMessages('QUIL_INITTHROW');
  public static QUIL_EOFTHROW = new ErrorMessages('QUIL_EOFTHROW');
  public static QUIL_YYLEXTHROW = new ErrorMessages('QUIL_YYLEXTHROW');
  public static ZERO_STATES = new ErrorMessages('ZERO_STATES');
  public static NO_BUFFER_SIZE = new ErrorMessages('NO_BUFFER_SIZE');
  public static NOT_READABLE = new ErrorMessages('NOT_READABLE');
  public static FILE_CYCLE = new ErrorMessages('FILE_CYCLE');
  public static FILE_WRITE = new ErrorMessages('FILE_WRITE');
  public static QUIL_SCANERROR = new ErrorMessages('QUIL_SCANERROR');
  public static NEVER_MATCH = new ErrorMessages('NEVER_MATCH');
  public static QUIL_THROW = new ErrorMessages('QUIL_THROW');
  public static EOL_IN_CHARCLASS = new ErrorMessages('EOL_IN_CHARCLASS');
  public static QUIL_CUPSYM = new ErrorMessages('QUIL_CUPSYM');
  public static CUPSYM_AFTER_CUP = new ErrorMessages('CUPSYM_AFTER_CUP');
  public static ALREADY_RUNNING = new ErrorMessages('ALREADY_RUNNING');
  public static CANNOT_READ_SKEL = new ErrorMessages('CANNOT_READ_SKEL');
  public static READING_SKEL = new ErrorMessages('READING_SKEL');
  public static SKEL_IO_ERROR = new ErrorMessages('SKEL_IO_ERROR');
  public static SKEL_IO_ERROR_DEFAULT = new ErrorMessages('SKEL_IO_ERROR_DEFAULT');
  public static READING = new ErrorMessages('READING');
  public static CANNOT_OPEN = new ErrorMessages('CANNOT_OPEN');
  public static NFA_IS = new ErrorMessages('NFA_IS');
  public static NFA_STATES = new ErrorMessages('NFA_STATES');
  public static DFA_TOOK = new ErrorMessages('DFA_TOOK');
  public static DFA_IS = new ErrorMessages('DFA_IS');
  public static MIN_TOOK = new ErrorMessages('MIN_TOOK');
  public static MIN_DFA_IS = new ErrorMessages('MIN_DFA_IS');
  public static WRITE_TOOK = new ErrorMessages('WRITE_TOOK');
  public static TOTAL_TIME = new ErrorMessages('TOTAL_TIME');
  public static IO_ERROR = new ErrorMessages('IO_ERROR');
  public static THIS_IS_JFLEX = new ErrorMessages('THIS_IS_JFLEX');
  public static UNKNOWN_COMMANDLINE = new ErrorMessages('UNKNOWN_COMMANDLINE');
  public static MACRO_CYCLE = new ErrorMessages('MACRO_CYCLE');
  public static MACRO_DEF_MISSING = new ErrorMessages('MACRO_DEF_MISSING');
  public static PARSING_TOOK = new ErrorMessages('PARSING_TOOK');
  public static NFA_TOOK = new ErrorMessages('NFA_TOOK');
  key: string;
  
  private constructor (key: string) {
    this.key = key;
  }
  
  public toString () {
    return this.key;
  }
  
}
