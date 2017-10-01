// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export class JavaString {
  
  public static hashCode (input: string) {
    let h = 0;
    if (h === 0 && input.length > 0) {
      for (let i = 0; i < input.length; i++) {
        h = 31 * h + input.charCodeAt(i);
      }
    }
    return h;
  }
  
  public static setCharAt (input: string, index: number, char: string): string {
    const first = input.substring(0, index);
    const second = input.substring(index + 1, input.length);
    return first + char + second;
    
  }
}
