import {Component, ElementRef} from '@angular/core';
import 'hammerjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Constants} from './Constants';
import {EditorUtils} from '../Utilities/EditorUtils';

declare var ace: any;
declare var $: any;

@Component({
  selector: 'app-semantic-analysis',
  templateUrl: './semantic.component.html',
  styleUrls: ['./semantic.component.css'],
})
export class SemanticComponent {
  testInputFormGroup: FormGroup;
  testContentDefault = '';
  title = 'Semantic Analysis Place Holder';
  http: HttpClient;
  output = '';
  content = [];
  generateUrl = 'http://localhost:8080/lab3/generate';
  runUrl = 'http://localhost:8080/lab3/run';
  consoleOutput = '';
  selector;
  private testReadonly = [];
  private testIdMarker = [];
  
  constructor (fb: FormBuilder, http: HttpClient, ele: ElementRef) {
    this.http = http;
    
    this.testInputFormGroup = fb.group({
      'testCtrl': '',
    });
    this.testContentDefault = Constants.testDefault;
  }
  
  ngAfterViewInit () {
    this.testEditorIni();
  }
  runtest () {
    // let httpParams: ;
    const self = this;
    EditorUtils.runtest(this.http, [''], [this.testContentDefault], this.generateUrl, this.runUrl, function (output) {
      self.consoleOutput = output;
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
