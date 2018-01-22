import {Component, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'hammerjs';
import {Constants} from './Constants';
import {HttpClient} from '@angular/common/http';
import 'jquery';
import {EditorUtils} from '../Utilities/EditorUtils';
// import 'require';
declare var ace: any;
declare var $: any;

@Component({
  selector: 'app-lexical-analysis',
  templateUrl: './lexical.component.html',
  styleUrls: ['./lexical.component.css'],
})
export class LexicalComponent {
  jflexFormGroup: FormGroup;
  testInputFormGroup: FormGroup;
  jflexDefault = '';
  testContentDefault = '';
  title = 'Lexical Analysis Place Holder';
  http: HttpClient;
  output = '';
  content = [];
  generateUrl = 'http://localhost:8080/lab1/generate';
  runUrl = 'http://localhost:8080/lab1/run';
  consoleOutput = '';
  jflexReadonly = [];
  jflexIdMarker = [];
  testReadonly = [];
  testIdMarker = [];
  // $: JQueryStatic;
  // editor: any;
  constructor (fb: FormBuilder, http: HttpClient, ele: ElementRef) {
    this.http = http;
    this.jflexFormGroup = fb.group({
      'jflexCtrl': '',
    });
    this.jflexDefault = Constants.jflexDefault;
  
    this.testInputFormGroup = fb.group({
      'testCtrl': '',
    });
    this.testContentDefault = Constants.testDefault;
    
    
  }
  
  ngAfterViewInit () {
    // console.log($('#jflex-editor'));
    this.jflexEditorIni();
    this.testEditorIni();
    
    // add readonly section
    
  }
  
  runtest () {
    // let httpParams: ;
    const self = this;
    EditorUtils.runtest(this.http, [this.jflexDefault], [this.testContentDefault], this.generateUrl, this.runUrl, function (output) {
      self.consoleOutput = output;
    });
  }
  
  private jflexEditorIni () {
    const jflex_editor = ace.edit('jflex-editor');
    
    jflex_editor.setTheme('ace/theme/chrome');
    const session = jflex_editor.getSession();
    const selection = session.getSelection();
    const document = session.getDocument();
    const oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    this.jflexReadonly = EditorUtils.iniReadOnlyArray(this.jflexDefault, 'TO DO');
    EditorUtils.updateReadonlySection(jflex_editor, this.jflexReadonly, this.jflexIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      EditorUtils.cursorChangeEventHandler(jflex_editor, self.jflexReadonly, oldCursorPos);
      
    });
    selection.on('changeSelection', function (e) {
      EditorUtils.selectionChangeEventHandler(jflex_editor, self.jflexReadonly);
      
    });
    jflex_editor.on('change', function (e) {
      EditorUtils.documentChangeEventHandler(e, jflex_editor, self.jflexReadonly, self.jflexIdMarker);
      self.jflexDefault = document.getValue();
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
