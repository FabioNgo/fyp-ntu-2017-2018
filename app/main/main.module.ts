import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainComponent} from './main.component';
import {MatButtonModule, MatInputModule, MatTabsModule} from '@angular/material';
import {LexicalComponent} from '../lexicalanalysis/lexical.component';
import {SemanticComponent} from '../semanticanalysis/semantic.component';
import {CodeComponent} from '../codegeneration/code.component';
import {SyntaxComponent} from '../syntaxanalysis/syntax.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    MainComponent,
    LexicalComponent,
    SemanticComponent,
    SyntaxComponent,
    CodeComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatInputModule, MatTabsModule, MatButtonModule, FormsModule, ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule {
}
