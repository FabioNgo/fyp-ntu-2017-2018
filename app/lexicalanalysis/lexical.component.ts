import {Component, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'hammerjs';
import {Constants} from './Constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MainComponent} from '../main/main.component';
import 'jquery';
// import 'require';
declare var ace: any;
declare var $: any;
declare var UndoManager: any;

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
  
    const test_editor = ace.edit('test-editor');
    test_editor.setTheme('ace/theme/chrome');
    test_editor.getSession().setMode('ace/mode/java');
    // add readonly section
    
  }
  
  runtest () {
    // let httpParams: ;
    let value = '';
    // httpParams = new HttpParams();
    if (this.jflexFormGroup.value.jflexCtrl === '') {
      value = this.jflexDefault;
    } else {
      value = this.jflexFormGroup.value.jflexCtrl;
    }
    // console.log(value);
    const body = {
      content: [value],
      'token': MainComponent.token,
    };
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    this.http.post(this.generateUrl, body, {headers: headers}).subscribe(
      data => {
        this.consoleOutput = 'Generating: \n' + this.readResponse(data);
        if (this.testInputFormGroup.value.testCtrl === '') {
          value = this.testContentDefault;
        } else {
          value = this.testInputFormGroup.value.testCtrl;
        }
        body.content = [value];
        this.http.post(this.runUrl, body, {headers: headers}).subscribe(data1 => {
          this.consoleOutput += ('Running: \n' + this.readResponse(data1));
        });
      },
    )
    ;
    
  }
  
  readResponse (response): string {
    let result = '';
    // Compiling
    const compilingData = response[0];
    result += '\tCompiling: \n';
    if (compilingData.error) {
      result += ('\tError:' + compilingData.errorMessage + '\n');
    } else {
      result += ('\tOutput:' + compilingData.outputMessage + '\n');
    }
    const runningData = response[1];
    result += '\tRunning: \n';
    if (runningData.error) {
      result += ('\tError:' + runningData.errorMessage + '\n');
    } else {
      result += ('\tOutput:' + runningData.outputMessage + '\n');
    }
    return result;
  }
  
  private updateReadonlySection (editor, readonlyArray, markerIdArray) {
    const session = editor.getSession();
    for (let i = 0; i < readonlyArray.length; i++) {
      const range = editor.getSelectionRange().clone();
      session.removeGutterDecoration(i, 'readonly');
      session.removeMarker(markerIdArray[i]);
      range.setStart(i, 0);
      range.setEnd(i, 10);
      if (readonlyArray[i]) {
        
        session.addGutterDecoration(i, 'readonly');
        range.id = session.addMarker(range, 'readonly-marker', 'fullLine', false);
      } else {
        // session.addGutterDecoration(i, '');
        range.id = session.addMarker(range, '', 'fullLine', false);
      }
      markerIdArray[i] = range.id;
    }
  }
  
  private jflexEditorIni () {
    const jflex_editor = ace.edit('jflex-editor');
    
    jflex_editor.setTheme('ace/theme/chrome');
    const session = jflex_editor.getSession();
    
    const undoManager = session.getUndoManager();
    const document = session.getDocument();
    const selection = session.getSelection();
    let oldCursorPos = selection.getCursor();
    session.setMode('ace/mode/java');
    const jflexLines = this.jflexDefault.split('\n');
    for (let i = 0; i < jflexLines.length; i++) {
      if (jflexLines[i].includes('TO DO')) {
        this.jflexReadonly[i] = false;
        continue;
      }
      this.jflexReadonly[i] = true;
    }
    this.updateReadonlySection(jflex_editor, this.jflexReadonly, this.jflexIdMarker);
    const self = this;
    
    selection.on('changeCursor', function (e) {
      const cursor = selection.getCursor();
      if (self.jflexReadonly[cursor.row]) {
        selection.moveCursorTo(oldCursorPos.row, oldCursorPos.column, false);
      } else {
        oldCursorPos = cursor;
      }
      
    });
    selection.on('changeSelection', function (e) {
      const anchor = selection.getSelectionAnchor();
      if (self.jflexReadonly[anchor.row]) {
        selection.clearSelection();
      }
      
    });
    jflex_editor.on('change', function (e) {
      console.log(e);
      if (e.handled !== undefined) {
        return;
      }
      e.handled = true;
      // console.log(self.jflexReadonly);
      const start = e.start;
      const end = e.end;
      const diff = end.row - start.row;
      if (diff === 0) {
        return;
      }
      if (e.action === 'insert') {
        if (self.jflexReadonly[start.row]) {
          return;
        }
        // shift readonly section
        
        
        for (let i = self.jflexReadonly.length - 1; i >= end.row; i--) {
          self.jflexReadonly[i + diff] = self.jflexReadonly[i];
          // console.log(undoManager.$undoStack);
        }
        for (let i = start.row; i <= end.row; i++) {
          self.jflexReadonly[i] = false;
        }
        
      }
      if (e.action === 'remove') {
        for (let i = self.jflexReadonly.length - 1; i > end.row; i--) {
          self.jflexReadonly[i - diff] = self.jflexReadonly[i];
          // console.log(undoManager.$undoStack);
        }
        // for (let i = start.row; i <= end.row; i++) {
        //   self.jflexReadonly[i] = false;
        // }
        self.jflexReadonly = self.jflexReadonly.slice(0, -diff);
      }
      
      self.updateReadonlySection(jflex_editor, self.jflexReadonly, self.jflexIdMarker);
      
    });
    
  }
}
