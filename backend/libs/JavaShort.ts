// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export class JavaShort {
  
  public static toSignedShort (input: number): number {
    let a = input.toString(2);
    a = a.substr(a.length - 16, 16);
    let b = Number.parseInt(a, 2);
    if (b > 32767) {
      b = b - 65536;
    }
    return b.valueOf();
  }
}
