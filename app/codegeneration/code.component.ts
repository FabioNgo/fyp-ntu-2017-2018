import {Component} from '@angular/core';
import 'hammerjs';
import {Main} from '../../backend/libs/jflex/Main';

@Component({
  selector: 'app-code-generation',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  title = 'Code Generation Place Holder';
  temp: Main;
}
