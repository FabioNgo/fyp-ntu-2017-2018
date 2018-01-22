import {MainComponent} from '../main/main.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export class EditorUtils {
  static updateReadonlySection (editor, readonlyArray, markerIdArray) {
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
  
  static iniReadOnlyArray (content: string, editableRegionKeyWord: string): boolean[] {
    const lines = content.split('\n');
    const readOnlyArray = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(editableRegionKeyWord)) {
        readOnlyArray[i] = false;
        continue;
      }
      readOnlyArray[i] = true;
    }
    return readOnlyArray;
  }
  
  static cursorChangeEventHandler (editor, readOnlyArray, oldCursorPos) {
    const selection = editor.getSession().getSelection();
    const cursor = selection.getCursor();
    if (readOnlyArray[cursor.row]) {
      selection.moveCursorTo(oldCursorPos.row, oldCursorPos.column, false);
    } else {
      oldCursorPos.row = cursor.row;
      oldCursorPos.column = cursor.column;
    }
  }
  
  static selectionChangeEventHandler (editor, readOnlyArray) {
    const selection = editor.getSession().getSelection();
    const anchor = selection.getSelectionAnchor();
    if (readOnlyArray[anchor.row]) {
      selection.clearSelection();
    }
  }
  
  static documentChangeEventHandler (e, editor, readonlyArray, markerIdsArray) {
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
      if (readonlyArray[start.row]) {
        return;
      }
      // shift readonly section
      
      
      for (let i = readonlyArray.length - 1; i >= start.row; i--) {
        readonlyArray[i + diff] = readonlyArray[i];
        // console.log(undoManager.$undoStack);
      }
      for (let i = start.row; i <= end.row; i++) {
        readonlyArray[i] = false;
      }
      
    }
    if (e.action === 'remove') {
      // for (let i = readonlyArray.length - 1; i > end.row; i--) {
      for (let i = start.row; i < readonlyArray.length - diff; i++) {
        readonlyArray[i] = readonlyArray[i + diff];
        // console.log(undoManager.$undoStack);
      }
      // for (let i = start.row; i <= end.row; i++) {
      //   self.jflexReadonly[i] = false;
      // }
      readonlyArray.splice(-diff, readonlyArray.length);
    }
    
    this.updateReadonlySection(editor, readonlyArray, markerIdsArray);
  }
  
  static runtest (http: HttpClient, generatingContentBody: string[], runContentBody: string[], generateUrl: string, runUrl: string, callback: (output) => void) {
    // let httpParams: ;
    let consoleOutput = '';
    const body = {
      content: generatingContentBody,
      'token': MainComponent.token,
    };
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    
    http.post(generateUrl, body, {headers: headers}).subscribe(
      data => {
        consoleOutput = 'Generating: \n' + this.readResponse(data);
        body.content = runContentBody;
        http.post(runUrl, body, {headers: headers}).subscribe(data1 => {
          consoleOutput += ('Running: \n' + this.readResponse(data1));
          callback(consoleOutput);
        });
      },
    )
    ;
    
  }
  
  static readResponse (response): string {
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
