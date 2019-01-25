import {Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'hammerjs';
import {HttpClient} from '@angular/common/http';
import {Rule} from '../Models/Rule';
import {RulesManager} from '../Models/RulesManager';
import {Terminal} from "../Models/Terminal";
import {TerminalsManager} from "../Models/TerminalsManager";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from "@angular/material";
import {DefinitionsManager} from "../Models/DefinitionsManager";
import {BackendCommunicationFacades} from "../Utilities/BackendCommunicationFacades";

declare var ace: any;
declare var $: any;

@Component({
  selector: 'app-dialog-nonterminal-edit',
  templateUrl: './editTerminalDialog.html'
})
export class EditTerminalDialog {
  nonTerminalFormControl: FormControl;
  nonTerminal: string;

  constructor(public dialogRef: MatDialogRef<EditTerminalDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.nonTerminal = data.nonTerminal;
    this.nonTerminalFormControl = new FormControl("");
  }

  onSubmit(): void {
    if (this.nonTerminalFormControl.value === undefined && this.nonTerminalFormControl.value === '') {
      return;
    }
    this.dialogRef.close({
      rule: this.nonTerminalFormControl.value
    });
  }
}

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
  nonTerminalDisplayedColumns = ['IsStartSymbol', 'Identifier', 'Rule', 'Remove'];
  isStartSymbolValue = "";
  snackbar: MatSnackBar;
  dialog: MatDialog;


  constructor(http: HttpClient, snackbar: MatSnackBar, dialog: MatDialog) {
    this.dialog = dialog;
    this.snackbar = snackbar;
    this.http = http;
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


  isStartSymbolChanged(event) {
    this.isStartSymbolValue = event.value;
  }

  addNonTerminal() {
    let isStartSymbol = false;
    if (this.startSymbol === this.ruleFormControl.value) {
      isStartSymbol = true;
    }
    TerminalsManager.getInstance().addTerminal({
      rule: this.ruleFormControl.value,
      identifier: this.identifierFormControl.value,
      isStartSymbol: isStartSymbol,
      baseTerminal: ""
    });
  }

  removeNonterminal(row) {
    TerminalsManager.getInstance().removeTerminal(row);
  }

  editNonterminal(row: Terminal) {
    const dialogRef = this.dialog.open(EditTerminalDialog, {
      width: '250px',
      data: {nonTerminal: row.identifier}
    });

    dialogRef.afterClosed().subscribe(result => {
      row.rule = result.rule;
      TerminalsManager.getInstance().editTerminal(row);
    });

  }

  sendRequest() {

    const body = {
      definitions: DefinitionsManager.getInstance().getDefinitions(),
      rules: RulesManager.getInstance().getRules(),
      terminals: TerminalsManager.getInstance().getTerminals()
    };
    if (this.isStartSymbolValue === "") {
      this.snackbar.open("please select start symbol", '', {
        duration: 500,

      });
      return;
    }
    const terminals = RulesManager.getInstance().getRules();
    const refinedNonTerminals = [];
    for (let j = 0; j < body.terminals.length; j++) {
      const nonTerminal: Terminal = {
        identifier: body.terminals[j].identifier,
        rule: body.terminals[j].rule,
        isStartSymbol: body.terminals[j].isStartSymbol,
        baseTerminal: body.terminals[j].baseTerminal
      };
      let temp = " " + nonTerminal.rule + " ";
      for (let i = 0; i < terminals.length; i++) {
        const terminal = terminals[i];

        temp = temp.split(" " + terminal.keyword).join(" " + terminal.token);
        temp = temp.split("(" + terminal.keyword + ")").join("(" + terminal.token + ")");
      }
      nonTerminal.rule = temp.trim();
      refinedNonTerminals.push(nonTerminal);
    }
    body.terminals = refinedNonTerminals;
    BackendCommunicationFacades.getInstance().sendRequest(body, this.http, "http://localhost:8080/create");
  }
}
