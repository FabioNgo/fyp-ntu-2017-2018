import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainComponent} from './main.component';
import {MdButtonModule, MdCheckboxModule, MdTabsModule} from '@angular/material';
import {LexicalComponent} from '../lexicalanalysis/lexical.component';
import {SemanticComponent} from '../semanticanalysis/semantic.component';
import {CodeComponent} from '../codegeneration/code.component';
import {SyntaxComponent} from '../syntaxanalysis/syntax.component';

@NgModule({
  declarations: [
    MainComponent,
    LexicalComponent,
    SemanticComponent,
    SyntaxComponent,
    CodeComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MdButtonModule, MdCheckboxModule, MdTabsModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule {
}
