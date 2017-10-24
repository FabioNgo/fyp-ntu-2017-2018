import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import 'hammerjs';
import {JFlexTask} from '../../backend/libs/jflex/anttask/JFlexTask';
import {Main} from '../../backend/libs/jflex/Main';

@Component({
  selector: 'app-lexical-analysis',
  templateUrl: './lexical.component.html',
  styleUrls: ['./lexical.component.css'],
})
export class LexicalComponent {
  jflexInputGroup: FormGroup;
  title = 'Lexical Analysis Place Holder';
  jflexTask: JFlexTask;
  output = '';
  content = [];
  
  constructor (fb: FormBuilder) {
    this.jflexInputGroup = fb.group({
      'jflexInputContent': '',
    });
  }
  
  generate () {
  
    // console.log(JavaShort.toSignedShort(65533));
    // const jflexInputContent = this.jflexInputGroup.value.jflexInputContent;
    const jflexInputContent = this.jflexInputGroup.value.jflexInputContent;
    if (jflexInputContent !== '') {
      // let a = JavaLong.ZERO;
      // console.log(jflexInputContent);
      // let a = new StateSet(0);
      this.output = '';
      this.jflexTask = new JFlexTask();
      this.content = this.jflexTask.execute(jflexInputContent);
      // this.output = this.content.toString();
      for (let i = 0; i < Main.output.length; i++) {
        this.output += Main.output[i];
      }
      // this.output = Main.output.toString();
      // let a = 0;
    }
    
    // let task = new JFlexTask();
    
  }
}
