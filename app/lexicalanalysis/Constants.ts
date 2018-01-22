export class Constants {
  public static readonly jflexDefault = `/* You do not need to change anything up here. */
package lexer;

import lexer.Token;
import static lexer.Token.Type.*;

%%

%public
%final
%class Lexer
%function nextToken
%type Token
%unicode
%line
%column

%{
	/* These two methods are for the convenience of rules to create toke objects.
	* If you do not want to use them, delete them
	* otherwise add the code in
	*/
	
	private Token token(Token.Type type) {
	  //TO DO
	}
	
	/* Use this method for rules where you need to process yytext() to get the lexeme of the token.
	 *
	 * Useful for string literals; e.g., the quotes around the literal are part of yytext(),
	 *       but they should not be part of the lexeme.
	*/
	private Token token(Token.Type type, String text) {
	  //TO DO
	}
%}

/* This definition may come in handy. If you wish, you can add more definitions here. Added */
WhiteSpace = [ ] | \\t | \\f | \\n | \\r
//TO DO

%%
/* put in your rules here.    */
//TO DO

/* You don't need to change anything below this line. */
.							{ throw new Error("unexpected character '" + yytext() + "'"); }
<<EOF>>						{ return token(EOF); }
`;
  // public static readonly jflexDefault = '/* You do not need to change anything up here. */\n' +
  //   'package lexer;\n' +
  //   '\n' +
  //   '\n' +
  //   'import static lexer.Token.Type.*;\n' +
  //   '%%\n' +
  //   '\n' +
  //   '%public\n' +
  //   '%final\n' +
  //   '%class Lexer\n' +
  //   '%function nextToken\n' +
  //   '%type Token\n' +
  //   '%unicode\n' +
  //   '%line\n' +
  //   '%column\n' +
  //   '\n' +
  //   '%{\n' +
  //   '    /* These two methods are for the convenience of rules to create toke objects.\n' +
  //   '    * If you do not want to use them, delete them\n' +
  //   '    * otherwise add the code in\n' +
  //   '    */\n' +
  //   '\n' +
  //   '    private Token token(Token.Type type) {\n' +
  //   '        return new Token(type, yyline, yycolumn, yytext());\n' +
  //   '    }\n' +
  //   '\n' +
  //   '    /* Use this method for rules where you need to process yytext() to get the lexeme of the token.\n' +
  //   '     *\n' +
  //   '     * Useful for string literals; e.g., the quotes around the literal are part of yytext(),\n' +
  //   '     *       but they should not be part of the lexeme.\n' +
  //   '    */\n' +
  //   '    private Token token(Token.Type type, String text) {\n' +
  //   '        if (type.equals(Token.Type.STRING_LITERAL)) {\n' +
  //   '            text = text.substring(1, text.length()-1);\n' +
  //   '        }\n' +
  //   '        return new Token(type,yyline,yycolumn,text);\n' +
  //   '    }\n' +
  //   '%}\n' +
  //   '\n' +
  //   '/* This definition may come in handy. If you wish, you can add more definitions here. */\n' +
  //   'WhiteSpace = [ ] | \\t | \\f | \\n | \\r\n' +
  //   'Identifier = [a-zA-Z][a-zA-Z0-9_]*\n' +
  //   'IntLiteral = [0-9]+\n' +
  //   'StringLiteral = \\"([^\\"\\n])*\\"\n' +
  //   '\n' +
  //   '\n' +
  //   '%%\n' +
  //   '/* put in your rules here.    */\n' +
  //   '\n' +
  //   '// keywords\n' +
  //   '\"boolean" \t{ return token(BOOLEAN); }\n' +
  //   '\"break"\t\t{ return token(BREAK); }\n' +
  //   '\"else"\t\t{ return token(ELSE); }\n' +
  //   '\"false"\t\t{ return token(FALSE); }\n' +
  //   '\"if"\t\t{ return token(IF); }\n' +
  //   '\"import"\t{ return token(IMPORT); }\n' +
  //   '\"int"\t\t{ return token(INT); }\n' +
  //   '\"module"\t{ return token(MODULE); }\n' +
  //   '\"public"\t{ return token(PUBLIC); }\n' +
  //   '\"return"\t{ return token(RETURN); }\n' +
  //   '\"true"\t\t{ return token(TRUE); }\n' +
  //   '\"type"\t\t{ return token(TYPE); }\n' +
  //   '\"void"\t\t{ return token(VOID); }\n' +
  //   '\"while"\t\t{ return token(WHILE); }\n' +
  //   '\n' +
  //   '// punctuation symbols\n' +
  //   '\","\t\t\t{ return token(COMMA); }\n' +
  //   '\"["\t\t\t{ return token(LBRACKET); }\n' +
  //   '\"{"\t\t\t{ return token(LCURLY); }\n' +
  //   '\"("\t\t\t{ return token(LPAREN); }\n' +
  //   '\"]"\t\t\t{ return token(RBRACKET); }\n' +
  //   '\"}"\t\t\t{ return token(RCURLY); }\n' +
  //   '\")"\t\t\t{ return token(RPAREN); }\n' +
  //   '\";"\t\t\t{ return token(SEMICOLON); }\n' +
  //   '// operators\n' +
  //   '\"/"\t\t\t\t\t{ return token(DIV); }\n' +
  //   '\"=="\t\t\t\t{ return token(EQEQ); }\n' +
  //   '\"="\t\t\t\t\t{ return token(EQL); }\n' +
  //   '\">="\t\t\t\t{ return token(GEQ); }\n' +
  //   '\">"\t\t\t\t\t{ return token(GT); }\n' +
  //   '\"<="\t\t\t\t{ return token(LEQ); }\n' +
  //   '\"<"\t\t\t\t\t{ return token(LT); }\n' +
  //   '\"-"\t\t\t\t\t{ return token(MINUS); }\n' +
  //   '\"!="\t\t\t\t{ return token(NEQ); }\n' +
  //   '\"+"\t\t\t\t\t{ return token(PLUS); }\n' +
  //   '\"*"\t\t\t\t\t{ return token(TIMES); }\n' +
  //   '\n' +
  //   '// identifier\n' +
  //   '{Identifier}\t\t{ return token(ID); }\n' +
  //   '\n' +
  //   '// literals\n' +
  //   '{IntLiteral}\t\t{ return token(INT_LITERAL); }\n' +
  //   '{StringLiteral} \t{ return token(STRING_LITERAL,yytext()); }\n' +
  //   '\n' +
  //   '// whitespace\n' +
  //   '{WhiteSpace}+\t\t{ }\n' +
  //   '\n' +
  //   '\n' +
  //   '/* You don\'t need to change anything below this line. */\n' +
  //   '.\t\t\t\t\t\t\t{ throw new Error("unexpected character \'" + yytext() + "\'"); }\n' +
  //   ' <<EOF>>\t\t\t\t\t\t{ return token(EOF); }';
  public static readonly testDefault = `package lexer;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

import java.io.IOException;
import java.io.StringReader;

import static lexer.Token.Type.*;
import static org.junit.Assert.*;

//import org.junit.Test;

/**
 * This class contains unit tests for your lexer. You
 * are strongly encouraged to write your own tests.
 */
public class LexerTests {
  public static void main(String... args){
    String output = "";
    Result result = JUnitCore.runClasses(LexerTests.class);
    for (Failure failure : result.getFailures()) {
      output += (failure.toString()+"\\n");
    }
    output += (result.wasSuccessful() +"\\n");
    System.out.println(output);
    return ;
  }
  // helper method to run tests; no need to change this
  private final void runtest(String input, Token... output) {
    Lexer lexer = new Lexer(new StringReader(input));
    int i=0;
    Token actual, expected;
    try {
      do {
        assertTrue(i < output.length);
        expected = output[i++];
        try {
          actual = lexer.nextToken();
          assertEquals(expected, actual);
        } catch(Error e) {
          if(expected != null)
            fail(e.getMessage());
          return;
        }
      } while(!actual.isEOF());
    } catch (IOException e) {
      e.printStackTrace();
      fail(e.getMessage());
    }
  }

  /** Example unit test. */
  @Test
	public void testKWs() {
		// first argument to runtest is the string to lex; the remaining arguments
		// are the expected tokens
		runtest("module false\\nreturn while",
				new Token(MODULE, 0, 0, "module"),
				new Token(FALSE, 0, 7, "false"),
				new Token(RETURN, 1, 0, "return"),
				new Token(WHILE, 1, 7, "while"),
				new Token(EOF, 1, 12, ""));
	}

	
	@Test
	public void testStringLiteralWithDoubleQuote() {
		runtest("\\"\\"\\"",
				(Token)null);
	}
	
	@Test
	public void testStringLiteralEscapeCharacter() {
		runtest("\\"\\\\n\\"",
				new Token(STRING_LITERAL, 0, 0, "\\\\n"),
				new Token(EOF, 0, 4, ""));
	}
  //TO DO

}`;
}
