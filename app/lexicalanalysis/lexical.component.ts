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
    let editor = ace.edit('jflex-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
    editor = ace.edit('test-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
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
}
