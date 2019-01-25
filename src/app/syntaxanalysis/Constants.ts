export class Constants {
  public static readonly parserDefault = `// package the generated Java class lives in; no need to change this
%package "parser";

// name of the generated Java class; no need to change this
%class "Parser";

// no need to change this either
%embed {:
	// turn off automated error recovery
	@Override
	protected void recoverFromError(Symbol token, TokenStream in) throws java.io.IOException, Exception {
		super.recoverFromError(new Symbol(0), in);
	}
:};

// the list of all terminals; no need to change this
%terminals MODULE, INT, VOID, IF, ELSE, WHILE, RETURN, BREAK, BOOLEAN, PUBLIC, TRUE, FALSE,
           INT_LITERAL, STRING_LITERAL, ID, TYPE, IMPORT,
           PLUS, MINUS, TIMES, DIV, MOD, EQEQ, NEQ, LEQ, GEQ, LT, GT,
           LBRACKET, RPAREN, COMMA, RCURLY, LCURLY, SEMICOLON, RBRACKET, LPAREN, EQL;
           
// declaration of start symbol; no need to change this
%goal Module;

// temporary declaration, you can remove this once you have written all other rules
// %goal Dummy;

/* TODO: Flesh out the rule for Module, and add rules for other nonterminals. Here is an example
         of a rule you may want to add:
         
   Accessibility = PUBLIC
		  |
		  ;
  */

//TO DO

/**/

/* Dummy rule to make the lexer compile. Copy ths to "TODO" part to make the lexer compile
Remove this once you have written all other rules.
Dummy = MODULE INT VOID IF ELSE WHILE RETURN BREAK BOOLEAN PUBLIC TRUE FALSE INT_LITERAL STRING_LITERAL ID TYPE IMPORT
           PLUS MINUS TIMES DIV MOD EQEQ NEQ LEQ GEQ LT GT LBRACKET RPAREN COMMA RCURLY LCURLY SEMICOLON RBRACKET LPAREN EQL;*/`;
  // public static readonly testDefault = '' +
  // '@Test\n' +
  // 'public void testEmptyModule() {\n' +
  // '\t\truntest("module Test { }");\n' +
  // '\t}';
  public static readonly testDefault = `package parser;

import static org.junit.Assert.fail;

import java.io.StringReader;

import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class ParserTests {
  public static void main(String... args){
    String output = "";
    Result result = JUnitCore.runClasses(ParserTests.class);
    for (Failure failure : result.getFailures()) {
      output += (failure.toString()+"\\n");
    }
    output += (result.wasSuccessful() +"\\n");
    System.out.println(output);
    return ;
  }
	private void runtest(String src) {
		runtest(src, true);
	}

	private void runtest(String src, boolean succeed) {
		Parser parser = new Parser();
		try {
			parser.parse(new Lexer(new StringReader(src)));
			if(!succeed) {
				fail("Test was supposed to fail, but succeeded");
			}
		} catch (beaver.Parser.Exception e) {
			if(succeed) {
				e.printStackTrace();
				fail(e.getMessage());
			}
		} catch (Throwable e) {
			e.printStackTrace();
			fail(e.getMessage());
		}
	}
	@Test
	public void testEmptyModule() {
	  runtest("module Test { }");
	}
  //TO DO
}`;
}
