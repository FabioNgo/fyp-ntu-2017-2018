import {Component, ElementRef} from '@angular/core';
import 'hammerjs';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from './Constants';
import {EditorUtils} from '../Utilities/EditorUtils';

declare var ace: any;
declare var $: any;
@Component({
  selector: 'app-code-generation',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  title = 'Code Generation Place Holder';
  exprCodeFormGroup: FormGroup;
  stmtCodeFormGroup: FormGroup;
  testInputFormGroup: FormGroup;
  exprCodeDefault = '';
  stmtCodeDefault = '';
  testContentDefault = '';
  http: HttpClient;
  output = '';
  content = [];
  generateUrl = 'http://localhost:8080/lab4/generate';
  runUrl = 'http://localhost:8080/lab4/run';
  consoleOutput = '';
  private exprReadonly = [];
  private exprIdMarker = [];
  private stmtReadonly = [];
  private stmtIdMarker = [];
  private testReadonly = [];
  private testIdMarker = [];
  
  
  constructor (fb: FormBuilder, http: HttpClient, ele: ElementRef) {
    this.http = http;
    this.exprCodeFormGroup = fb.group({
      'exprCodeCtrl': '',
    });
    this.stmtCodeFormGroup = fb.group({
      'stmtCodeCtrl': '',
    });
    this.exprCodeDefault = Constants.ExprCodeDefault;
    this.stmtCodeDefault = Constants.StmtCodeDefault;
    this.testInputFormGroup = fb.group({
      'testCtrl': '',
    });
    this.testContentDefault = Constants.testDefault;
  }
  
  ngAfterViewInit () {
    // console.log($('#jflex-editor'));
    this.exprEditorIni();
    this.stmtEditorIni();
    this.testEditorIni();
    let editor = ace.edit('expr-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
    editor = ace.edit('stmt-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
    editor = ace.edit('test-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
  }

  runtest () {
    // let httpParams: ;
    const self = this;
    EditorUtils.runtest(this.http, [this.exprCodeDefault, this.stmtCodeDefault], [this.testContentDefault], this.generateUrl, this.runUrl, function (output) {
      self.consoleOutput = output;
    });
  }
  
  private exprEditorIni () {
    const expr_editor = ace.edit('expr-editor');
    
    expr_editor.setTheme('ace/theme/chrome');
    const session = expr_editor.getSession();
    const selection = session.getSelection();
    const document = session.getDocument();
    const oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    this.exprReadonly = EditorUtils.iniReadOnlyArray(this.exprCodeDefault, 'TO DO');
    EditorUtils.updateReadonlySection(expr_editor, this.exprReadonly, this.exprIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      EditorUtils.cursorChangeEventHandler(expr_editor, self.exprReadonly, oldCursorPos);
      
    });
    selection.on('changeSelection', function (e) {
      EditorUtils.selectionChangeEventHandler(expr_editor, self.exprReadonly);
      
    });
    expr_editor.on('change', function (e) {
      EditorUtils.documentChangeEventHandler(e, expr_editor, self.exprReadonly, self.exprIdMarker);
      self.exprCodeDefault = document.getValue();
    });
    
  }
  
  private stmtEditorIni () {
    const jflex_editor = ace.edit('stmt-editor');
    
    jflex_editor.setTheme('ace/theme/chrome');
    const session = jflex_editor.getSession();
    const selection = session.getSelection();
    const document = session.getDocument();
    const oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    this.stmtReadonly = EditorUtils.iniReadOnlyArray(this.stmtCodeDefault, 'TO DO');
    EditorUtils.updateReadonlySection(jflex_editor, this.stmtReadonly, this.stmtIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      EditorUtils.cursorChangeEventHandler(jflex_editor, self.stmtReadonly, oldCursorPos);
      
    });
    selection.on('changeSelection', function (e) {
      EditorUtils.selectionChangeEventHandler(jflex_editor, self.stmtReadonly);
      
    });
    jflex_editor.on('change', function (e) {
      EditorUtils.documentChangeEventHandler(e, jflex_editor, self.stmtReadonly, self.stmtIdMarker);
      self.stmtCodeDefault = document.getValue();
    });
    
  }
  
  private testEditorIni () {
    const test_editor = ace.edit('test-editor');
    test_editor.setTheme('ace/theme/chrome');
    const session = test_editor.getSession();
    session.setMode('ace/mode/java');
    const document = session.getDocument();
    const selection = session.getSelection();
    const oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    this.testReadonly = EditorUtils.iniReadOnlyArray(this.testContentDefault, 'TO DO');
    EditorUtils.updateReadonlySection(test_editor, this.testReadonly, this.testIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      EditorUtils.cursorChangeEventHandler(test_editor, self.testReadonly, oldCursorPos);
      
    });
    selection.on('changeSelection', function (e) {
      EditorUtils.selectionChangeEventHandler(test_editor, self.testReadonly);
      
    });
    test_editor.on('change', function (e) {
      EditorUtils.documentChangeEventHandler(e, test_editor, self.testReadonly, self.testIdMarker);
      self.testContentDefault = document.getValue();
    });
  }
}
