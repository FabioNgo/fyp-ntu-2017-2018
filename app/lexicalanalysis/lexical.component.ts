import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'hammerjs';
import {JFlexTask} from '../../backend/libs/jflex/anttask/JFlexTask';

@Component({
  selector: 'app-lexical-analysis',
  templateUrl: './lexical.component.html',
  styleUrls: ['./lexical.component.css'],
})
export class LexicalComponent {
  jflexInputGroup: FormGroup;
  title = 'Lexical Analysis Place Holder\nasdasd';
  jflexTask: JFlexTask;
  output = '';
  content = [];
  
  constructor (fb: FormBuilder) {
    this.jflexInputGroup = fb.group({
      'jflexInputContent': '',
    });
  }
  
  generate () {
    // console.log(JavaShort.toSignedShort(65533));
    // const jflexInputContent = this.jflexInputGroup.value.jflexInputContent;
    const jflexInputContent = '/* You do not need to change anything up here. */\n' +
      'package lexer;\n' +
      '\n' +
      'import frontend.Token;\n' +
      'import static frontend.Token.Type.*;\n' +
      '\n' +
      '%%\n' +
      '\n' +
      '%public\n' +
      '%final\n' +
      '%class Lexer\n' +
      '%function nextToken\n' +
      '%type Token\n' +
      '%unicode\n' +
      '%line\n' +
      '%column\n' +
      '\n' +
      '%{\n' +
      '    /* These two methods are for the convenience of rules to create toke objects.\n' +
      '    * If you do not want to use them, delete them\n' +
      '    * otherwise add the code in\n' +
      '    */\n' +
      '\n' +
      '    private Token token(Token.Type type) {\n' +
      '        return new Token(type, yyline, yycolumn, yytext());\n' +
      '    }\n' +
      '\n' +
      '    /* Use this method for rules where you need to process yytext() to get the lexeme of the token.\n' +
      '     *\n' +
      '     * Useful for string literals; e.g., the quotes around the literal are part of yytext(),\n' +
      '     *       but they should not be part of the lexeme.\n' +
      '    */\n' +
      '    private Token token(Token.Type type, String text) {\n' +
      '        if (type.equals(Token.Type.STRING_LITERAL)) {\n' +
      '            text = text.substring(1, text.length()-1);\n' +
      '        }\n' +
      '        return new Token(type,yyline,yycolumn,text);\n' +
      '    }\n' +
      '%}\n' +
      '\n' +
      '/* This definition may come in handy. If you wish, you can add more definitions here. */\n' +
      'WhiteSpace = [ ] | \\t | \\f | \\n | \\r\n' +
      'Identifier = [a-zA-Z][a-zA-Z0-9_]*\n' +
      'IntLiteral = [0-9]+\n' +
      'StringLiteral = \\"([^\\"\\n])*\\"\n' +
      '\n' +
      '\n' +
      '%%\n' +
      '/* put in your rules here.    */\n' +
      '\n' +
      '// keywords\n' +
      '"boolean" \t{ return token(BOOLEAN); }\n' +
      '"break"\t\t{ return token(BREAK); }\n' +
      '"else"\t\t{ return token(ELSE); }\n' +
      '"false"\t\t{ return token(FALSE); }\n' +
      '"if"\t\t{ return token(IF); }\n' +
      '"import"\t{ return token(IMPORT); }\n' +
      '"int"\t\t{ return token(INT); }\n' +
      '"module"\t{ return token(MODULE); }\n' +
      '"public"\t{ return token(PUBLIC); }\n' +
      '"return"\t{ return token(RETURN); }\n' +
      '"true"\t\t{ return token(TRUE); }\n' +
      '"type"\t\t{ return token(TYPE); }\n' +
      '"void"\t\t{ return token(VOID); }\n' +
      '"while"\t\t{ return token(WHILE); }\n' +
      '\n' +
      '// punctuation symbols\n' +
      '","\t\t\t{ return token(COMMA); }\n' +
      '"["\t\t\t{ return token(LBRACKET); }\n' +
      '"{"\t\t\t{ return token(LCURLY); }\n' +
      '"("\t\t\t{ return token(LPAREN); }\n' +
      '"]"\t\t\t{ return token(RBRACKET); }\n' +
      '"}"\t\t\t{ return token(RCURLY); }\n' +
      '")"\t\t\t{ return token(RPAREN); }\n' +
      '";"\t\t\t{ return token(SEMICOLON); }\n' +
      '\n' +
      '// operators\n' +
      '"/"\t\t\t\t\t{ return token(DIV); }\n' +
      '"=="\t\t\t\t{ return token(EQEQ); }\n' +
      '"="\t\t\t\t\t{ return token(EQL); }\n' +
      '">="\t\t\t\t{ return token(GEQ); }\n' +
      '">"\t\t\t\t\t{ return token(GT); }\n' +
      '"<="\t\t\t\t{ return token(LEQ); }\n' +
      '"<"\t\t\t\t\t{ return token(LT); }\n' +
      '"-"\t\t\t\t\t{ return token(MINUS); }\n' +
      '"!="\t\t\t\t{ return token(NEQ); }\n' +
      '"+"\t\t\t\t\t{ return token(PLUS); }\n' +
      '"*"\t\t\t\t\t{ return token(TIMES); }\n' +
      '\n' +
      '// identifier\n' +
      '{Identifier}\t\t{ return token(ID); }\n' +
      '\n' +
      '// literals\n' +
      '{IntLiteral}\t\t{ return token(INT_LITERAL); }\n' +
      '{StringLiteral} \t{ return token(STRING_LITERAL,yytext()); }\n' +
      '\n' +
      '// whitespace\n' +
      '{WhiteSpace}+\t\t{ }\n' +
      '\n' +
      '\n' +
      '/* You don\'t need to change anything below this line. */\n' +
      '.\t\t\t\t\t\t\t{ throw new Error("unexpected character \'" + yytext() + "\'"); }\n' +
      ' <<EOF>>\t\t\t\t\t\t{ return token(EOF); }';
    if (jflexInputContent !== '') {
      // let a = JavaLong.ZERO;
      // console.log(jflexInputContent);
      // let a = new StateSet(0);
      this.jflexTask = new JFlexTask();
      this.content = this.jflexTask.execute(jflexInputContent);
      for (let i = 0; i < this.content.length; i++) {
        this.output = this.output + ( this.content[i] + '\n');
      }
      console.log(this.output);
      console.log('Done');
      // let a = 0;
    }
    
    // let task = new JFlexTask();
    
  }
}
