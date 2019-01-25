import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainComponent} from './main.component';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';
import {LexicalComponent} from '../lexicalanalysis/lexical.component';
import {SemanticComponent} from '../semanticanalysis/semantic.component';
import {CodeComponent} from '../codegeneration/code.component';
import {EditTerminalDialog, SyntaxComponent} from '../syntaxanalysis/syntax.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
  // {path: 'lab1', component: LexicalComponent},
  // {path: 'lab2', component: SyntaxComponent},
  // {path: 'lab3', component: SemanticComponent},
  // {path: 'lab4', component: CodeComponent},

  // { path: '**', component: MainComponent }
];

@NgModule({
  declarations: [
    MainComponent,
    LexicalComponent,
    SemanticComponent,
    SyntaxComponent,
    CodeComponent,
    EditTerminalDialog
  ],
  entryComponents: [
    EditTerminalDialog
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule, BrowserAnimationsModule, MatInputModule, MatTabsModule, MatButtonModule, FormsModule,
    ReactiveFormsModule, MatGridListModule, MatStepperModule, HttpClientModule, MatCardModule, MatIconModule, MatListModule, MatTableModule,
    MatChipsModule, MatRadioModule, MatSnackBarModule, MatDialogModule
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class MainModule {
  constructor() {
    // MainModule._token = Date.now().toString(10);
    MainModule._token = "140393";
  }

  private static _token: string;

  static get token(): string {
    return this._token;
  }
}
