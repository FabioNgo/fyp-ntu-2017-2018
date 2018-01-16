import {Component, ElementRef} from '@angular/core';
import 'hammerjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Constants} from './Constants';
import {MainComponent} from '../main/main.component';

declare var ace: any;
declare var $: any;
@Component({
  selector: 'app-semantic-analysis',
  templateUrl: './semantic.component.html',
  styleUrls: ['./semantic.component.css']
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
  
  constructor (fb: FormBuilder, http: HttpClient, ele: ElementRef) {
    this.http = http;
    
    this.testInputFormGroup = fb.group({
      'testCtrl': '',
    });
    this.testContentDefault = Constants.testDefault;
  }
  
  ngAfterViewInit () {
    // console.log($('#jflex-editor'));
    // let editor = ace.edit("parser-editor");
    // editor.setTheme("ace/theme/chrome");
    // editor.getSession().setMode("ace/mode/java");
    let editor = ace.edit('test-editor');
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/java');
  }
  
  runtest () {
    // let httpParams: ;
    let value = '';
    // httpParams = new HttpParams();
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
