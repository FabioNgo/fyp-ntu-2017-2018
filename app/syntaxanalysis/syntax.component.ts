import {Component, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'hammerjs';
import {HttpClient} from '@angular/common/http';
import {Constants} from './Constants';
import {EditorUtils} from '../Utilities/EditorUtils';

declare var ace: any;
declare var $: any;

@Component({
  selector: 'app-syntax-analysis',
  templateUrl: './syntax.component.html',
  styleUrls: ['./syntax.component.css'],
})
export class SyntaxComponent {
  parserFormGroup: FormGroup;
  testInputFormGroup: FormGroup;
  parserDefault = '';
  testContentDefault = '';
  title = 'Syntax Analysis Place Holder';
  http: HttpClient;
  output = '';
  content = [];
  generateUrl = 'http://localhost:8080/lab2/generate';
  runUrl = 'http://localhost:8080/lab2/run';
  consoleOutput = '';
  private parserReadonly = [];
  private parserIdMarker = [];
  private testReadonly = [];
  private testIdMarker = [];
  
  constructor (fb: FormBuilder, http: HttpClient, ele: ElementRef) {
    this.http = http;
    this.parserFormGroup = fb.group({
      'parserCtrl': '',
    });
    this.parserDefault = Constants.parserDefault;
    this.testInputFormGroup = fb.group({
      'testCtrl': '',
    });
    this.testContentDefault = Constants.testDefault;
    
  }
  
  ngAfterViewInit () {
    this.parserEditorIni();
    this.testEditorIni();
  }
  
  runtest () {
    // let httpParams: ;
    const self = this;
    EditorUtils.runtest(this.http, [this.parserDefault], [this.testContentDefault], this.generateUrl, this.runUrl, function (output) {
      self.consoleOutput = output;
    });
  }
  
  private parserEditorIni () {
    const parser_editor = ace.edit('parser-editor');
    
    parser_editor.setTheme('ace/theme/chrome');
    const session = parser_editor.getSession();
    const selection = session.getSelection();
    const document = session.getDocument();
    const oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    this.parserReadonly = EditorUtils.iniReadOnlyArray(this.parserDefault, 'TO DO');
    EditorUtils.updateReadonlySection(parser_editor, this.parserReadonly, this.parserIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      EditorUtils.cursorChangeEventHandler(parser_editor, self.parserReadonly, oldCursorPos);
      
    });
    selection.on('changeSelection', function (e) {
      EditorUtils.selectionChangeEventHandler(parser_editor, self.parserReadonly);
      
    });
    parser_editor.on('change', function (e) {
      EditorUtils.documentChangeEventHandler(e, parser_editor, self.parserReadonly, self.parserIdMarker);
      self.parserDefault = document.getValue();
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
