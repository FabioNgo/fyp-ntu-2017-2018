/**
 * Class for representing tokens. Each token is characterised by its token type, its lexeme,
 * and its source position (given by its line and column numbers).
 *
 * You do not need to change anything in this file.
 */
export enum Type {
  /** Token types are provided as an enum. */
  // keywords
  BOOLEAN,
  BREAK,
  ELSE,
  FALSE,
  IF,
  IMPORT,
  INT,
  MODULE,
  PUBLIC,
  RETURN,
  TRUE,
  TYPE,
  VOID,
  WHILE,
  
  // punctuation symbols
  COMMA, /* , */
  LBRACKET, /* [ */
  LCURLY, /* { */
  LPAREN, /* ( */
  RBRACKET, /* ] */
  RCURLY, /* } */
  RPAREN, /* ) */
  SEMICOLON, /* ; */
  
  // operators
  DIV, /* / */
  EQEQ, /* == */
  EQL, /* = */
  GEQ, /* >= */
  GT, /* > */
  LEQ, /* <= */
  LT, /* < */
  MINUS, /* - */
  NEQ, /* != */
  PLUS, /* + */
  TIMES, /* * */
  
  // identifier
  ID,
  
  // literals
  INT_LITERAL,
  STRING_LITERAL,
  
  // special end-of-file token
  EOF
}
