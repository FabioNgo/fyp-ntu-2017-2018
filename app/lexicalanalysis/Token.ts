/**
 * Class for representing tokens. Each token is characterised by its token type, its lexeme,
 * and its source position (given by its line and column numbers).
 *
 * You do not need to change anything in this file.
 */


import {Type} from './Type';

export class Token {
  column: number;
  /** Token types are provided as an enum. */
  
  
  private type: Type;
  private line: number;
  private lexeme = '';
  
  public constructor (type: Type, line: number, column: number, lexeme: string) {
    
    this.type = type;
    this.line = line;
    this.column = column;
    this.lexeme = lexeme;
  }
  
  public isEOF (): boolean {
    return this.type === Type.EOF;
  }
  
  
  public toString (): string {
    return this.type + '@' + this.line + ':' + this.column + '=\'' + this.lexeme + '\'';
  }
  
  
  public equals (obj): boolean {
    if (obj instanceof Token) {
      const that = <Token>obj;
      return this.type === that.type &&
        this.line === that.line &&
        this.column === that.column &&
        this.lexeme === that.lexeme;
    } else {
      return false;
    }
  }
}
