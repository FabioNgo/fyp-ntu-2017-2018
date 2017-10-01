import {ErrorMessages} from './ErrorMessages';
import {Timer} from './Timer';

export class Out {
  public static NL = '\n';
  private static warnings;
  private static errors;
  
  public constructor () {
  }
  
  // public static setGUIMode(TextArea text) {
  // out.setGUIMode(text);
// }

// public static void setOutputStream(OutputStream stream) {
//   out = new StdOutWriter(stream);
//   out.setGUIMode((TextArea)null);
// }
//
// public static void time(ErrorMessages message, Timer time) {
//   if (Options.time) {
//     String msg = ErrorMessages.get(message, time.toString());
//     out.println(msg);
//   }
//
// }
//
// public static void time(String message) {
//   if (Options.time) {
//     out.println(message);
//   }
//
// }
  
  public static println (message) {
    // if (Options.verbose) {
    console.log(message + Out.NL);
    // }
    
  }
  
  public static print (message) {
    console.log(message);
  }
  
  public static checkErrors () {
    if (Out.errors > 0) {
      throw new Error('GeneratorException()');
    }
  }
  
  public static statistics () {
    let line = Out.errors + ' error';
    if (Out.errors !== 1) {
      line += ('s');
    }
    
    line += (', ' + Out.warnings + ' warning');
    if (Out.warnings !== 1) {
      line += ('s');
    }
    
    line += ('.');
    Out.err(line.toString());
  }
  
  public static resetCounters () {
    Out.errors = 0;
    Out.warnings = 0;
  }
  
  public static warning (message, line, col) {
    ++Out.warnings;
    let msg = Out.NL + 'Warnings';
    if (line >= 0) {
      msg = msg + ' (line ' + (line + 1) + ')';
    }
    if (col >= 0) {
      msg = msg + ' (col ' + (col + 1) + ')';
    }
    
    msg = (msg + ': ' + Out.NL + message);
    Out.err(msg);
  }
  
  public static error (message, line, col) {
    ++Out.errors;
    let msg = Out.NL + 'Error';
    
    
    if (line >= 0) {
      msg = msg + ' (line ' + (line + 1) + ')';
    }
    if (col >= 0) {
      msg = msg + ' (col ' + (col + 1) + ')';
    }
    
    msg = (msg + ': ' + Out.NL + message);
    
    
    Out.err(msg);
  }
  
  static dump (s: string) {
    Out.println(s);
    
  }
  
  static debug (s2: string) {
    Out.println(s2);
  }
  
  static time (message: ErrorMessages, time: Timer) {
    Out.println(message + time.toString());
  }
  
  private static err (message) {
    this.println(message);
  }
}
