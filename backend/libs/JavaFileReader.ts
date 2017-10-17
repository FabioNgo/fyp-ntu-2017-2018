// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export class JavaFileReader extends FileReader {
  file: File;
  content: string;
  currentPos = 0;
  
  constructor (file?: File) {
    super();
    if (file) {
      
      this.file = file;
      this.readAsText(file);
      this.content = this.result;
    }
    
  }
  
  public read (off: number, len: number): [number, string] {
    let numRead = 0;
    if (off + len > this.content.length) {
      numRead = this.content.length - this.currentPos;
      
    } else {
      numRead = (off + len ) - this.currentPos;
    }
    
    if (numRead > 0) {
      this.currentPos = this.currentPos + numRead;
    } else {
      if (this.currentPos === this.content.length) {
        numRead = -1;
      } else {
        numRead = 0;
      }
    }
    
    
    return [numRead, <string>this.content.substr(off, len)];
  }
  
  public reset () {
    this.currentPos = 0;
  }
  
  public getContent () {
    return this.result;
  }
  
  public setContent (content: string) {
    this.content = content;
  }
  
  public close () {
  }
  
}
