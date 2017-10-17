import {Options} from '../Options';
import {Main} from '../Main';
import {JavaFileReader} from '../../JavaFileReader';
import {isString} from 'util';
import {JavaCharacter} from '../../JavaCharacter';

export class JFlexTask {
  private inputFile: File;
  private className: string = null;
  private packageName: string = null;
  private destinationDir: string;
  private outputDir: string = null;
  private inputContent: string = null;
  
  public constructor () {
    Options.progress = false;
  }
  
  public execute (fileOrContent: string | File) {
    if (fileOrContent instanceof File) {
      this.inputFile = <File>fileOrContent;
      this.inputContent = new JavaFileReader(this.inputFile).getContent();
    }
    if (isString(fileOrContent)) {
      this.inputContent = <string>fileOrContent;
    }
    this.findPackageAndClass();
    const destFile = this.outputDir + this.className + '.java';
    Main.generate(this.inputContent);
    if (!Options.verbose) {
      console.log('Generated: ' + destFile);
    }
    
    
  }
  
  public findPackageAndClass () {
    this.packageName = null;
    this.className = null;
    const lines = this.inputContent.split('\n');
    let i = 0;
    
    while (this.className == null || this.packageName == null) {
      if (i === lines.length) {
        break;
      }
      const line = lines[i];
      
      
      let index;
      if (this.packageName == null) {
        index = line.indexOf('package');
        if (index >= 0) {
          index += 7;
          const end = line.indexOf(JavaCharacter.toChar(59), index);
          if (end >= index) {
            this.packageName = line.substring(index, end);
            this.packageName = this.packageName.trim();
          }
        }
      }
      
      if (this.className == null) {
        index = line.indexOf('%class');
        if (index >= 0) {
          index += 6;
          this.className = line.substring(index);
          this.className = this.className.trim();
        }
      }
      i++;
    }
    
    if (this.className == null) {
      this.className = 'Yylex';
    }
    
  }
}
