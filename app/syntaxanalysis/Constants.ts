export class Constants {
  public static readonly parserDefault = '// package the generated Java class lives in; no need to change this\n' +
    '%package "parser";\n' +
    '\n' +
    '// name of the generated Java class; no need to change this\n' +
    '%class "Parser";\n' +
    '\n' +
    '\n' +
    '\n' +
    '// the list of all terminals; no need to change this\n' +
    '%terminals MODULE, INT, VOID, IF, ELSE, WHILE, RETURN, BREAK, BOOLEAN, PUBLIC, TRUE, FALSE,\n' +
    '           INT_LITERAL, STRING_LITERAL, ID, TYPE, IMPORT,\n' +
    '           PLUS, MINUS, TIMES, DIV, MOD, EQEQ, NEQ, LEQ, GEQ, LT, GT,\n' +
    '           LBRACKET, RPAREN, COMMA, RCURLY, LCURLY, SEMICOLON, RBRACKET, LPAREN, EQL;\n' +
    '           \n' +
    '// declaration of start symbol; no need to change this\n' +
    '%goal Module;\n' +
    '\n' +
    '// temporary declaration, you can remove this once you have written all other rules\n' +
    '%goal Dummy;\n' +
    '\n' +
    '/* TODO: Flesh out the rule for Module, and add rules for other nonterminals. Here is an example\n' +
    '         of a rule you may want to add:\n' +
    '         \n' +
    '   Accessibility = PUBLIC\n' +
    '\t\t  |\n' +
    '\t\t  ;\n' +
    '  */\n' +
    '  Accessibility = PUBLIC|;\n' +
    '  Import = IMPORT ID SEMICOLON;\n' +
    '  LocalVariableDeclaration = TypeName ID SEMICOLON;\n' +
    '  BlockStatements = LCURLY  Statement* RCURLY;\n' +
    '  IfStatement = IF LPAREN Expression RPAREN Statement | IF LPAREN Expression RPAREN Statement ElseStatement;\n' +
    '  ElseStatement = ELSE Statement;\n' +
    '  WhileStatement = WHILE LPAREN Expression RPAREN Statement;\n' +
    '  BreakStatement = BREAK SEMICOLON;\n' +
    '  ReturnStatement =  RETURN Expression? SEMICOLON;\n' +
    '  ExpressionStatement = Expression SEMICOLON;\n' +
    '  Expression = Assignment | RHSExpression;\n' +
    '\n' +
    '  Assignment = LHSExpression EQL Expression;\n' +
    '  ComparisonOperatorArithmeticExpression = ComparisonOperator ArithmeticExpression;\n' +
    '  LHSExpression = ID | ArrayAccess;\n' +
    '  ArrayAccess = ID LBRACKET Expression RBRACKET | ArrayAccess LBRACKET Expression RBRACKET;\n' +
    '  RHSExpression = ArithmeticExpression ComparisonOperatorArithmeticExpression?;\n' +
    '  ComparisonOperator =  EQEQ | NEQ | LEQ | GEQ | LT | GT;\n' +
    '  ArithmeticExpression = ArithmeticExpression AdditiveOperator Term | Term;\n' +
    '  AdditiveOperator = PLUS|MINUS;\n' +
    '  Term = Term MultiplicativeOperator Factor | Factor;\n' +
    '  MultiplicativeOperator = TIMES  | DIV | MOD;\n' +
    '  Factor = MINUS Factor | PrimaryExpression;\n' +
    '  PrimaryExpression  = LHSExpression | FunctionCall | ArrayExpression | STRING_LITERAL | INT_LITERAL | BooleanLiteral | ParenthesisedExpression;\n' +
    '  FunctionCallParam = Expression OtherFunctionCallParam*;\n' +
    '  OtherFunctionCallParam = COMMA Expression ;\n' +
    '  FunctionCall = ID LPAREN FunctionCallParam* RPAREN;\n' +
    '  ListExpression = Expression OtherExpression*;\n' +
    '  OtherExpression = COMMA Expression ;\n' +
    '  ArrayExpression = LBRACKET ListExpression+ RBRACKET;\n' +
    '  BooleanLiteral =  TRUE|FALSE;\n' +
    '  ParenthesisedExpression = LPAREN Expression RPAREN;\n' +
    '\n' +
    '  Statement = LocalVariableDeclaration | BlockStatements | IfStatement | WhileStatement | BreakStatement | ReturnStatement | ExpressionStatement;\n' +
    '  Parameter = TypeName ID;\n' +
    '  OtherParameter = COMMA Parameter ;\n' +
    '  ParameterList = Parameter OtherParameter*;\n' +
    '  ArrayType = TypeName LBRACKET RBRACKET;\n' +
    '  PrimitiveType = VOID|BOOLEAN|INT;\n' +
    '  TypeName = PrimitiveType|ArrayType|ID;\n' +
    '  FieldDeclaration = Accessibility TypeName ID SEMICOLON;\n' +
    '  TypeDeclaration = Accessibility TYPE ID EQL STRING_LITERAL SEMICOLON;\n' +
    '  FunctionDeclaration = Accessibility TypeName ID LPAREN ParameterList* RPAREN LCURLY Statement* RCURLY;\n' +
    '  Declaration = FunctionDeclaration | FieldDeclaration | TypeDeclaration;\n' +
    'Module = MODULE ID LCURLY Import* Declaration* RCURLY;\n' +
    '\n' +
    '/**/\n' +
    '\n' +
    '/* Dummy rule to make the lexer compile. Remove this once you have written all other rules. */\t  \n' +
    'Dummy = MODULE INT VOID IF ELSE WHILE RETURN BREAK BOOLEAN PUBLIC TRUE FALSE INT_LITERAL STRING_LITERAL ID TYPE IMPORT\n' +
    '           PLUS MINUS TIMES DIV MOD EQEQ NEQ LEQ GEQ LT GT LBRACKET RPAREN COMMA RCURLY LCURLY SEMICOLON RBRACKET LPAREN EQL;';
  public static readonly testDefault = '' +
    '@Test\n' +
    'public void testEmptyModule() {\n' +
    '\t\truntest("module Test { }");\n' +
    '\t}';
}
