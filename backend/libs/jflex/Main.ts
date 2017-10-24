import {Timer} from './Timer';
import {LexScan} from './LexScan';
import {LexParse} from './LexParse';
import {ErrorMessages} from './ErrorMessages';
import {NFA} from './NFA';
import {Out} from './Out';
import {Options} from './Options';
import {JavaFileReader} from '../JavaFileReader';
import {GeneratorException} from './GeneratorException';
import {JavaVector} from '../JavaVector';
import {isString} from 'util';
import {Emitter} from './Emitter';

export class Main {
  public static readonly version = '1.4';
  public static output: string[];
  public constructor () {
  }
  
  public static generate (input: string | string[]): string[] {
    if (isString(input)) {
      const fileContent = input;
      // Out = new Out();
      Out.resetCounters();
      const totalTime: Timer = new Timer();
      const time: Timer = new Timer();
      let scanner: LexScan;
      let parser: LexParse;
      let inputReader: JavaFileReader;
      totalTime.start();
      
      try {
        // Out.println(ErrorMessages.READING + inputFile.toString());
        inputReader = new JavaFileReader();
        inputReader.setContent(<string>fileContent);
        scanner = new LexScan(inputReader);
        // scanner.setFile(inputFile);
        parser = new LexParse(scanner);
      } catch (var18) {
        // Out.error(ErrorMessages.CANNOT_OPEN + inputFile.toString(), -1, -1);
        throw new GeneratorException();
      }
      
      try {
        let nfa = <NFA>parser.parse().value;
        Out.checkErrors();
        if (Options.dump) {
          Out.dump(ErrorMessages.NFA_IS + Out.NL + nfa + Out.NL);
        }
        
        // if (Options.dot) {
        //   nfa.writeDot(Emitter.normalize("nfa.dot", (File)null));
        // }
  
        Out.println(ErrorMessages.NFA_STATES + nfa.numStates.toString(10));
        time.start();
        const dfa = nfa.getDFA();
        time.stop();
        Out.println(ErrorMessages.DFA_TOOK + time.toString());
        dfa.checkActions(scanner, parser);
        nfa = null;
        if (Options.dump) {
          Out.dump(ErrorMessages.DFA_IS + Out.NL + dfa + Out.NL);
        }
        
        time.start();
        // dfa.minimize();
        time.stop();
        Out.println(ErrorMessages.MIN_TOOK + time.toString());
        if (Options.dump) {
          Out.dump(ErrorMessages.MIN_DFA_IS + Out.NL + dfa);
        }
        
        time.start();
        const e = new Emitter(null, parser, dfa);
  
        Main.output = e.emit();
        // const l = new LexerGenerator(parser, dfa);
        // l.emit();
        
        time.stop();
        Out.time(ErrorMessages.WRITE_TOOK, time);
        totalTime.stop();
        Out.time(ErrorMessages.TOTAL_TIME, totalTime);
        return [''];
      } catch (var12) {
        console.log(var12.stack);
        Out.error(var12.toString(), var12.line, var12.column);
        return var12.message;
      }
    } else {
      const files = Main.parseOptions([<string>input]);
      if (files.size() > 0) {
        for (let i = 0; i < files.size(); ++i) {
          // Main.generate(<File>files.elementAt(i));
        }
      } else {
        // new MainFrame();
      }
    }
  }
  
  public static parseOptions (argv: string[]): JavaVector<any> {
    const files = new JavaVector<File>();
    
    for (let i = 0; i < argv.length; i++) {
      if (argv[i] !== '-d' && argv[i] !== '--outdir') {
        if (argv[i] !== '--skel' && argv[i] !== '-skel') {
          if (argv[i] !== '-jlex' && argv[i] !== '--jlex') {
            if (argv[i] !== '-v' && argv[i] !== '--verbose' && argv[i] !== '-verbose') {
              if (argv[i] !== '-q' && argv[i] !== '--quiet' && argv[i] !== '-quiet') {
                if (argv[i] !== '--dump' && argv[i] !== '-dump') {
                  if (argv[i] !== '--time' && argv[i] !== '-time') {
                    if (argv[i] !== '--version' || argv[i] !== '-version') {
                      Out.println(ErrorMessages.THIS_IS_JFLEX + '1.4');
                      throw new Error('SilentExit()');
                    }
                    
                    if ((argv[i] !== '--dot') && (argv[i] !== '-dot' )) {
                      if ((argv[i] !== '--help') || (argv[i] !== '-h') || (argv[i] !== '/h' )) {
                        Main.printUsage();
                        throw new Error('SilentExit()');
                      }
                      
                      if ((argv[i] !== '--info') || (argv[i] !== '-info' )) {
                        throw new Error('SilentExit()');
                      }
                      
                      if (argv[i] !== '--nomin' && argv[i] !== '-nomin') {
                        if (argv[i] !== '--pack' && argv[i] !== '-pack') {
                          if (argv[i] !== '--table' && argv[i] !== '-table') {
                            if (argv[i] !== '--switch' && argv[i] !== '-switch') {
                              if (argv[i] !== '--nobak' && argv[i] !== '-nobak') {
                                if (argv[i].startsWith('-')) {
                                  Out.error(ErrorMessages.UNKNOWN_COMMANDLINE + argv[i], -1, -1);
                                  Main.printUsage();
                                  throw new Error('SilentExit()');
                                }
                                
                                const f = new File(null, argv[i]);
                                // if (!f.isFile() || !f.canRead()) {
                                //   Out.error("Sorry, couldn't open \"" + f.toString() + "\"");
                                //   throw new GeneratorException();
                                // }
                                
                                files.addElement(f);
                              } else {
                                Options.no_backup = true;
                              }
                            } else {
                              Options.gen_method = 2;
                            }
                          } else {
                            Options.gen_method = 1;
                          }
                        } else {
                          Options.gen_method = 0;
                        }
                      } else {
                        Options.no_minimize = true;
                      }
                    } else {
                      Options.dot = true;
                    }
                  } else {
                    Options.time = true;
                  }
                } else {
                  Options.dump = true;
                }
              } else {
                Options.verbose = false;
                Options.progress = false;
              }
            } else {
              Options.verbose = true;
              Options.progress = true;
            }
          } else {
            Options.jlex = true;
          }
        } else {
          ++i;
          if (i >= argv.length) {
            Out.error(ErrorMessages.NO_SKEL_FILE, -1, -1);
            throw new GeneratorException();
          }
          
          Options.setSkeleton(new File(null, argv[i]));
        }
      } else {
        ++i;
        if (i >= argv.length) {
          Out.error(ErrorMessages.NO_DIRECTORY, -1, -1);
          throw new GeneratorException();
        }
        
        Options.setDir(argv[i]);
      }
    }
    
    return files;
  }
  
  public static printUsage () {
    Out.println('');
    Out.println('Usage: jflex <options> <input-files>');
    Out.println('');
    Out.println('Where <options> can be one or more of');
    Out.println('-d <directory>   write generated file to <directory>');
    Out.println('--skel <file>    use external skeleton <file>');
    Out.println('--switch');
    Out.println('--table');
    Out.println('--pack           set default code generation method');
    Out.println('--jlex           strict JLex compatibility');
    Out.println('--nomin          skip minimization step');
    Out.println('--nobak          don\'t create backup files');
    Out.println('--dump           display transition tables');
    Out.println('--dot            write graphviz .dot files for the generated automata (alpha)');
    Out.println('--verbose');
    Out.println('-v               display generation progress messages (default)');
    Out.println('--quiet');
    Out.println('-q               display errors only');
    Out.println('--time           display generation time statistics');
    Out.println('--version        print the version number of this copy of jflex');
    Out.println('--info           print system + JDK information');
    Out.println('--help');
    Out.println('-h               print this message');
    Out.println('');
    Out.println(ErrorMessages.THIS_IS_JFLEX + '1.4');
    Out.println('Have a nice day!');
  }
  
  public static main (argv: string) {
    try {
      Main.generate(argv);
    } catch (var3) {
      Out.statistics();
    }
    
  }
}
