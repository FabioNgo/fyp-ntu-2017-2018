import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'hammerjs';
import 'jquery';
import {MatTableDataSource} from '@angular/material';
// import 'require';
declare var ace: any;
declare var $: any;

interface Definitions {
  identifier: string;
  expression: string;
}

interface Rules {
  keyword: string;
  token: string;
}

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
  definitions = [];
  rules = [];
  definitionsDataSource: MatTableDataSource<Definitions>;
  rulesDataSource: MatTableDataSource<Rules>;
  defDisplayedColumns = ['Identifier', 'Expression', 'Remove'];
  ruleDisplayedColumns = ['Keyword', 'Token', 'Remove'];
  // $: JQueryStatic;
  // editor: any;
  constructor () {
    
    this.definitionsDataSource = new MatTableDataSource(this.definitions);
    this.rulesDataSource = new MatTableDataSource(this.rules);
    this.defExprFormControl = new FormControl('');
    this.defIdFormControl = new FormControl('');
    this.keywordFormControl = new FormControl('');
    this.tokenFormControl = new FormControl('');
  }
  
  addRule () {
    if (this.keywordFormControl.value === undefined || this.tokenFormControl.value === undefined || this.keywordFormControl.value === '' || this.tokenFormControl.value === '') {
    
    } else {
      for (let i = 0; i < this.rules.length; i++) {
        if (this.rules[i].keyword === this.keywordFormControl.value || this.rules[i].token === this.tokenFormControl.value) {
          return;
        } else {
        
        }
      }
      this.rules.push({
        keyword: this.keywordFormControl.value,
        token: this.tokenFormControl.value,
      })
      ;
      this.updateRulesData();
    }
  }
  
  addDefinition () {
    // console.log(this.identifier);
    if (this.defIdFormControl.value === undefined || this.defExprFormControl.value === undefined || this.defIdFormControl.value === '' || this.defExprFormControl.value === '') {
    
    } else {
      for (let i = 0; i < this.definitions.length; i++) {
        if (this.definitions[i].identifier === this.defIdFormControl.value) {
          return;
        } else {
        
        }
      }
      this.definitions.push({
        identifier: this.defIdFormControl.value,
        expression: this.defExprFormControl.value,
      })
      ;
      this.updateDefinitionsData();
    }
    
  }
  
  updateDefinitionsData () {
    this.definitionsDataSource.data = this.definitions;
  }
  
  ngAfterViewInit () {
    // console.log($('#jflex-editor'));
    // this.jflexEditorIni();
    // this.testEditorIni();
    
    // add readonly section
    
  }
  
  
  removeDefinition (row) {
    for (let i = 0; i < this.definitions.length; i++) {
      if (this.definitions[i].identifier === row.identifier) {
        this.definitions.splice(i, 1);
        break;
      }
    }
    this.updateDefinitionsData();
    
  }
  
  removeRule (row) {
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].keyword === row.keyword) {
        this.rules.splice(i, 1);
        break;
      }
    }
    this.updateRulesData();
    
  }
  
  private updateRulesData () {
    this.rulesDataSource.data = this.rules;
  }
}
