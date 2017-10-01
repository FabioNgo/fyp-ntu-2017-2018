// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export class JavaFileReader extends FileReader {
  file: File;
  
  constructor (file: File) {
    super();
    this.file = file;
    this.readAsText(file);
  }
  
  public read (off: number, len: number) {
    return <string>this.result.substr(off, len);
  }
  
  public getContent () {
    return this.result;
  }
  
  public close () {
  }
  
}
