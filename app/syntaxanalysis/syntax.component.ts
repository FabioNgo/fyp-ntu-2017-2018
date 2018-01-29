import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'hammerjs';
import {HttpClient} from '@angular/common/http';
import {Rule} from '../Models/Rule';
import {RulesManager} from '../Models/RulesManager';
import {Terminal} from "../Models/Terminal";
import {TerminalsManager} from "../Models/TerminalsManager";
import {MatTableDataSource} from "@angular/material";

declare var ace: any;
declare var $: any;

@Component({
  selector: 'app-syntax-analysis',
  templateUrl: './syntax.component.html',
  styleUrls: ['./syntax.component.css'],
})
export class SyntaxComponent {
  startSymbolFormControl: FormControl;
  title = 'Syntax Analysis Place Holder';
  http: HttpClient;
  output = '';
  content = [];
  generateUrl = 'http://localhost:8080/lab2/generate';
  runUrl = 'http://localhost:8080/lab2/run';
  rules: Rule[];
  startSymbol: string;
  terminals: Terminal[];
  identifierFormControl: FormControl;
  ruleFormControl: FormControl;
  nonTerminalDataSource: MatTableDataSource<Terminal>;
  nonTerminalDisplayedColumns = ['Identifier', 'Rule', 'Remove'];

  constructor() {
    this.rules = RulesManager.getInstance().getRules();
    this.terminals = TerminalsManager.getInstance().getTerminals();
    this.nonTerminalDataSource = new MatTableDataSource<Terminal>(this.terminals);
    this.identifierFormControl = new FormControl('');
    this.ruleFormControl = new FormControl('');
    this.startSymbolFormControl = new FormControl("");
    const self = this;
    RulesManager.getInstance().addRulesChangeListener({
      update() {
        self.rules = RulesManager.getInstance().getRules();
      }
    });
    TerminalsManager.getInstance().addTerminalsChangeListener({
      update() {
        self.nonTerminalDataSource.data = TerminalsManager.getInstance().getTerminals();
      }
    });
  }

  ngAfterViewInit() {

  }

  addStartSymbol() {
    if (this.startSymbolFormControl.value === "" || this.startSymbolFormControl.value === undefined) {
      return;
    }
    this.startSymbol = this.startSymbolFormControl.value;
    this.startSymbolFormControl.disable();
  }

  removeStartSymbol() {
    this.startSymbol = "";
    this.startSymbolFormControl.enable();
  }

  addNonTerminal() {
    TerminalsManager.getInstance().addTerminal({
      rule: this.ruleFormControl.value,
      identifier: this.identifierFormControl.value
    });
  }

  removeNonterminal(row) {
    TerminalsManager.getInstance().removeTerminal(row);
  }
}
