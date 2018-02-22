import {Rule} from './Rule';
import {RulesChangeListener} from '../Controllers/RulesChangeListener';

export class RulesManager {
  private static instance: RulesManager;
  private readonly columnTable = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  private rules: Rule[];
  private rulesChangeListeners: RulesChangeListener[];

  constructor() {
    this.rules = [
      {
        keyword: "boolean",
        token: "A",
        isIdentifier: false,
        ignore: false,
      },
      {
        keyword: "break",
        token: "B",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "else",
        token: "C",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "false",
        token: "D",
        isIdentifier: false,
        ignore: false,
        javaType: "Boolean"
      },
      {
        keyword: "if",
        token: "E",
        isIdentifier: false,
        ignore: false
      },
      // {
      //   keyword: "import",
      //   token: "F",
      //   isIdentifier: false,
      //   ignore: false
      // },
      {
        keyword: "int",
        token: "G",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "module",
        token: "H",
        isIdentifier: false,
        ignore: false
      },
      // {
      //   keyword: "public",
      //   token: "I",
      //   isIdentifier: false,
      //   ignore: false
      // },
      {
        keyword: "return",
        token: "J",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "true",
        token: "K",
        isIdentifier: false,
        ignore: false,
        javaType: "Boolean"
      },
      // {
      //   keyword: "type",
      //   token: "L",
      //   isIdentifier: false,
      //   ignore: false
      // },
      {
        keyword: "void",
        token: "M",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "while",
        token: "N",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: ",",
        token: "O",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "[",
        token: "P",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "{",
        token: "Q",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "(",
        token: "R",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "]",
        token: "S",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "}",
        token: "T",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: ")",
        token: "U",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: ";",
        token: "V",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "/",
        token: "W",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "==",
        token: "X",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "=",
        token: "Y",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: ">=",
        token: "Z",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: ">",
        token: "AA",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "<=",
        token: "AB",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "<",
        token: "AC",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "-",
        token: "AD",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "!=",
        token: "AE",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "+",
        token: "AF",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "*",
        token: "AG",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "Identifier",
        token: "AH",
        isIdentifier: true,
        ignore: false,
        javaType: "String"
      },
      {
        keyword: "IntLiteral",
        token: "AI",
        isIdentifier: false,
        ignore: false,
        javaType: "Integer"
      },
      {
        keyword: "StringLiteral",
        token: "AJ",
        isIdentifier: false,
        ignore: false,
        javaType: "String"
      },
      {
        keyword: "WhiteSpace",
        token: "AK",
        isIdentifier: false,
        ignore: true
      },
      {
        keyword: "%",
        token: "AL",
        isIdentifier: false,
        ignore: false
      },
      {
        keyword: "for",
        token: "AM",
        isIdentifier: false,
        ignore: false
      }
    ];
    this.rulesChangeListeners = [];
  }

  static getInstance(): RulesManager {
    if (this.instance === undefined) {
      this.instance = new RulesManager();
    }
    return this.instance;
  }

  addRulesChangeListener(listener: RulesChangeListener) {
    this.rulesChangeListeners.push(listener);
  }

  getRules(): Rule[] {
    return this.rules;
  }

  rulesChanged() {
    this.rulesChangeListeners.forEach(listener => {
      listener.update();
    });
  }

  removeRule(rule: Rule) {
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].keyword === rule.keyword) {
        this.rules.splice(i, 1);
        break;
      }
    }
    this.rulesChanged();
  }

  addRule(rule: Rule) {
    if (rule.keyword === undefined || rule.keyword === '') {

    } else {
      for (let i = 0; i < this.rules.length; i++) {
        if (this.rules[i].keyword === rule.keyword) {
          return;
        } else {

        }
      }
      const lastRule = this.rules[this.rules.length - 1];
      rule.token = this.getNextToken(lastRule.token);
      this.rules.push(rule);

    }
    this.rulesChanged();
  }

  private getNextToken(lastToken: string): string {
    let cout = false;
    let result = "";
    for (let i = lastToken.length - 1; i >= 0; i--) {
      const char = lastToken.charAt(i);
      let index = this.columnTable.indexOf(char);
      if (i === lastToken.length - 1) {
        index++;
      }
      if (cout) {
        index++;
      }
      if (index > this.columnTable.length - 1) {
        index = index % this.columnTable.length;
        cout = true;
      } else {
        cout = false;
      }
      result += this.columnTable[index];
    }
    if (cout) {
      result += 'A';
    }
    return result;
  }

}
