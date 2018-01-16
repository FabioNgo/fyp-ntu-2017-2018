import {Component, ElementRef} from '@angular/core';
import 'hammerjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from './Constants';
import {MainComponent} from '../main/main.component';

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
    let value = [];
    // httpParams = new HttpParams();
    if (this.exprCodeFormGroup.value.exprCodeCtrl === '') {
      value[0] = this.exprCodeDefault;
    } else {
      value = this.exprCodeFormGroup.value.exprCodeCtrl;
    }
    if (this.stmtCodeFormGroup.value.stmtCodeCtrl === '') {
      value[1] = this.stmtCodeDefault;
    } else {
      value = this.stmtCodeFormGroup.value.stmtCodeCtrl;
    }
    // console.log(value);
    const body = {
      content: value,
      'token': MainComponent.token,
    };
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    this.http.post(this.generateUrl, body, {headers: headers}).subscribe(
      data => {
        this.consoleOutput = 'Generating: \n' + this.readResponse(data);
        if (this.testInputFormGroup.value.testCtrl === '') {
          value[0] = this.testContentDefault;
        } else {
          value[0] = this.testInputFormGroup.value.testCtrl;
        }
        body.content = value;
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
}
