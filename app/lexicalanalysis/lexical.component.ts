import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'hammerjs';
import 'jquery';
import {MatTableDataSource} from '@angular/material';
import {RulesManager} from '../Models/RulesManager';
import {Rule} from '../Models/Rule';
import {DefinitionsManager} from '../Models/DefinitionsManager';
import {Definition} from '../Models/Definition';
// import 'require';
declare var ace: any;
declare var $: any;


@Component({
  selector: 'app-lexical-analysis',
  templateUrl: './lexical.component.html',
  styleUrls: ['./lexical.component.css'],
})
export class LexicalComponent {
  defIdFormControl: FormControl;
  defExprFormControl: FormControl;
  keywordFormControl: FormControl;
  tokenFormControl: FormControl;
  definitionsDataSource: MatTableDataSource<Definition>;
  rulesDataSource: MatTableDataSource<Rule>;
  defDisplayedColumns = ['Identifier', 'Expression', 'Remove'];
  ruleDisplayedColumns = ['Keyword', 'Token', 'Remove'];
  // $: JQueryStatic;
  // editor: any;
  constructor() {

    this.definitionsDataSource = new MatTableDataSource(DefinitionsManager.getInstance().getDefinitions());
    this.rulesDataSource = new MatTableDataSource(RulesManager.getInstance().getRules());
    this.defExprFormControl = new FormControl('');
    this.defIdFormControl = new FormControl('');
    this.keywordFormControl = new FormControl('');
    this.tokenFormControl = new FormControl('');
    const self = this;
    RulesManager.getInstance().addRulesChangeListener({
      update() {
        self.rulesDataSource.data = RulesManager.getInstance().getRules();
      }
    });
    DefinitionsManager.getInstance().addDefinitionsChangeListener({
      update() {
        self.definitionsDataSource.data = DefinitionsManager.getInstance().getDefinitions();
      }
    });
  }

  addRule() {
    const rule = {
      keyword: this.keywordFormControl.value,
      token: this.tokenFormControl.value,
    };
    RulesManager.getInstance().addRule(rule);

  }

  addDefinition() {
    DefinitionsManager.getInstance().addDefinition({
      identifier: this.defIdFormControl.value,
      expression: this.defExprFormControl.value,
    })
    ;
  }


  ngAfterViewInit() {
    // console.log($('#jflex-editor'));
    // this.jflexEditorIni();
    // this.testEditorIni();

    // add readonly section

  }


  removeDefinition(row) {
    DefinitionsManager.getInstance().removeDefinition(row);

  }

  removeRule(row) {
    RulesManager.getInstance().removeRule(row);


  }
}
