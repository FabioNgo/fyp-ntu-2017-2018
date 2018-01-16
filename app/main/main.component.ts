import {Component} from '@angular/core';
import 'hammerjs';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  public static readonly token = Date.now().toString(10);
  title = 'FYP';
  
  constructor () {
  
  }
  
}
