export class GeneratorException extends Error {
  public constructor () {
    super('Generation aborted');
  }
}
