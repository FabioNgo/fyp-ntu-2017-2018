import {Terminal} from "./Terminal";
import {TerminalsChangeListener} from "../Controllers/TerminalsChangeListener";


export class TerminalsManager {
  private static instance: TerminalsManager;
  private terminals: Terminal[];
  private terminalsChangeListeners: TerminalsChangeListener[];

  constructor() {
    this.terminals = [
      {
        identifier: "Module",
        isStartSymbol: true,
        rule: "module Identifier { Declaration* }",
        baseTerminal: ''
      },
      {
        identifier: "Declaration",
        isStartSymbol: false,
        rule: "",
        baseTerminal: ""
      },
      {
        identifier: "FunctionDeclaration",
        isStartSymbol: false,
        rule: "TypeName Identifier ( VarDecl*(,) ) BlockStatement",
        baseTerminal: "Declaration"
      },
      {
        identifier: "FieldDeclaration",
        isStartSymbol: false,
        rule: "VarDecl ;",
        baseTerminal: "Declaration"
      },
      {
        identifier: "VarDecl",
        isStartSymbol: false,
        rule: "TypeName Identifier",
        baseTerminal: ""
      },
      // {
      //   identifier: "TypeDeclaration",
      //   isStartSymbol: false,
      //   rule: "type Identifier = StringLiteral ;",
      //   baseTerminal: "Declaration"
      // },
      // {
      //   identifier: "AccessId",
      //   isStartSymbol: false,
      //   rule: "public?",
      //   baseTerminal: ""
      // },
      {
        identifier: "TypeName",
        isStartSymbol: false,
        rule: "",
        baseTerminal: ""
      },
      {
        identifier: "PrimitiveTypeName",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "TypeName"
      },
      {
        identifier: "IntTypeName",
        isStartSymbol: false,
        rule: "int",
        baseTerminal: "PrimitiveTypeName"
      },
      {
        identifier: "BooleanTypeName",
        isStartSymbol: false,
        rule: "boolean",
        baseTerminal: "PrimitiveTypeName"
      },
      {
        identifier: "VoidTypeName",
        isStartSymbol: false,
        rule: "void",
        baseTerminal: "TypeName"
      },
      // {
      //   identifier: "UserTypeName",
      //   isStartSymbol: false,
      //   rule: "Identifier",
      //   baseTerminal: "TypeName"
      // },
      {
        identifier: "ArrayTypeName",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "TypeName"
      },
      {
        identifier: "LrBrackets",
        isStartSymbol: false,
        rule: "[ ]",
        baseTerminal: ""
      },
      {
        identifier: "PrimitiveArrayTypeName",
        isStartSymbol: false,
        rule: "PrimitiveTypeName LrBrackets+",
        baseTerminal: "ArrayTypeName"
      },
      {
        identifier: "UserArrayTypeName",
        isStartSymbol: false,
        rule: "Identifier LrBrackets+",
        baseTerminal: "ArrayTypeName"
      },
      {
        identifier: "Statement",
        isStartSymbol: false,
        rule: "",
        baseTerminal: ""
      },
      {
        identifier: "LocalVariableDeclaration",
        isStartSymbol: false,
        rule: "VarDecl ;",
        baseTerminal: "Statement"
      },
      {
        identifier: "BlockStatement",
        isStartSymbol: false,
        rule: "{ Statement* }",
        baseTerminal: "Statement"
      },
      {
        identifier: "IfStatement",
        isStartSymbol: false,
        rule: "if ( Expression ) Statement ElseStatement?",
        baseTerminal: "Statement"
      },
      {
        identifier: "ElseStatement",
        isStartSymbol: false,
        rule: "else Statement",
        baseTerminal: "Statement"
      },
      {
        identifier: "LoopStatement",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Statement"
      },
      {
        identifier: "WhileStatement",
        isStartSymbol: false,
        rule: "while ( Expression ) Statement",
        baseTerminal: "LoopStatement"
      },
      {
        identifier: "ForStatement",
        isStartSymbol: false,
        rule: "for ( Assignment*(,) ; Expression*(,) ; Expression*(,) ) Statement",
        baseTerminal: "LoopStatement"
      },
      {
        identifier: "BreakStatement",
        isStartSymbol: false,
        rule: "break Expression? ;",
        baseTerminal: "Statement"
      },
      {
        identifier: "ReturnStatement",
        isStartSymbol: false,
        rule: "return Expression? ;",
        baseTerminal: "Statement"
      },
      {
        identifier: "ExpressionStatement",
        isStartSymbol: false,
        rule: "Expression ;",
        baseTerminal: "Statement"
      },
      {
        identifier: "Expression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: ""
      },
      {
        identifier: "Assignment",
        isStartSymbol: false,
        rule: "LhsExpression = Expression",
        baseTerminal: "Expression"
      },
      {
        identifier: "LhsExpression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Expression"
      },
      {
        identifier: "UnaryExpression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Expression"
      },
      {
        identifier: "NegateExpression",
        isStartSymbol: false,
        rule: "- Expression",
        baseTerminal: "UnaryExpression"
      },
      {
        identifier: "BinaryExpression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Expression"
      },
      {
        identifier: "ArithmeticExpression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "BinaryExpression"
      },
      {
        identifier: "AddExpr",
        isStartSymbol: false,
        rule: "Expression + Expression",
        baseTerminal: "ArithmeticExpression"
      },
      {
        identifier: "SubExpr",
        isStartSymbol: false,
        rule: "Expression - Expression",
        baseTerminal: "ArithmeticExpression"
      },
      {
        identifier: "MulExpr",
        isStartSymbol: false,
        rule: "Expression * Expression",
        baseTerminal: "ArithmeticExpression"
      },
      {
        identifier: "DivExpr",
        isStartSymbol: false,
        rule: "Expression / Expression",
        baseTerminal: "ArithmeticExpression"
      },
      {
        identifier: "ModExpr",
        isStartSymbol: false,
        rule: "Expression % Expression",
        baseTerminal: "ArithmeticExpression"
      },
      {
        identifier: "ComparisionExpression",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "BinaryExpression"
      },

      {
        identifier: "EqualExpr",
        isStartSymbol: false,
        rule: "Expression == Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "NotEqualExpr",
        isStartSymbol: false,
        rule: "Expression != Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "LessThanExpr",
        isStartSymbol: false,
        rule: "Expression < Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "GreaterThanExpr",
        isStartSymbol: false,
        rule: "Expression > Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "GreaterThanEqualExpr",
        isStartSymbol: false,
        rule: "Expression >= Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "LessThanEqualExpr",
        isStartSymbol: false,
        rule: "Expression <= Expression",
        baseTerminal: "ComparisionExpression"
      },
      {
        identifier: "FunctionCall",
        isStartSymbol: false,
        rule: "Identifier ( Expression*(,) )",
        baseTerminal: "Expression"
      },
      // {
      //   identifier: "FunctionName",
      //   isStartSymbol: false,
      //   rule: "Identifier",
      //   baseTerminal: ""
      // },
      {
        identifier: "Literal",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Expression"
      },
      {
        identifier: "StringLiteral",
        isStartSymbol: false,
        rule: "StringLiteral",
        baseTerminal: "Literal"
      },
      {
        identifier: "IntLiteral",
        isStartSymbol: false,
        rule: "IntLiteral",
        baseTerminal: "Literal"
      },
      {
        identifier: "BooleanLiteral",
        isStartSymbol: false,
        rule: "",
        baseTerminal: "Literal"
      },
      {
        identifier: "TrueLiteral",
        isStartSymbol: false,
        rule: "true",
        baseTerminal: "BooleanLiteral"
      },
      {
        identifier: "FalseLiteral",
        isStartSymbol: false,
        rule: "false",
        baseTerminal: "BooleanLiteral"
      },
      {
        identifier: "ArrayLiteral",
        isStartSymbol: false,
        rule: "{ Expression*(,) }",
        baseTerminal: "Literal"
      },
      {
        identifier: "ArrayIndex",
        isStartSymbol: false,
        rule: "Expression [ Expression ]",
        baseTerminal: "LhsExpression"
      },
      {
        identifier: "VarName",
        isStartSymbol: false,
        rule: "Identifier",
        baseTerminal: "LhsExpression"
      },


    ];
    this.terminalsChangeListeners = [];
  }

  static getInstance(): TerminalsManager {
    if (this.instance === undefined) {
      this.instance = new TerminalsManager();
    }
    return this.instance;
  }

  getTerminals(): Terminal[] {
    return this.terminals;
  }

  addTerminalsChangeListener(listener: TerminalsChangeListener) {
    this.terminalsChangeListeners.push(listener);
  }

  terminalsChanged() {
    this.terminalsChangeListeners.forEach(listener => {
      listener.update();
    });
  }

  removeTerminal(terminal: Terminal) {
    for (let i = 0; i < this.terminals.length; i++) {
      if (this.terminals[i].identifier === terminal.identifier) {
        this.terminals.splice(i, 1);
        break;
      }
    }
    this.terminalsChanged();
  }

  editTerminal(terminal: Terminal) {
    for (let i = 0; i < this.terminals.length; i++) {
      if (this.terminals[i].identifier === terminal.identifier) {
        this.terminals[i] = terminal;
        break;
      }
    }
    this.terminalsChanged();
  }
  addTerminal(terminal: Terminal) {
    if (terminal.identifier === undefined || terminal.identifier === undefined || terminal.identifier === '' || terminal.rule === '') {

    } else {
      for (let i = 0; i < this.terminals.length; i++) {
        if (this.terminals[i].identifier === terminal.identifier) {
          return;
        } else {

        }
      }

      this.terminals.push(terminal);
    }
    this.terminalsChanged();
  }

}
