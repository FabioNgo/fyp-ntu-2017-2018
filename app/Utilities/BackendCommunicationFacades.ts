import {MainComponent} from "../main/main.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export class BackendCommunicationFacades {
  private static instance: BackendCommunicationFacades;

  public static getInstance(): BackendCommunicationFacades {
    if (this.instance === undefined) {
      this.instance = new BackendCommunicationFacades();
    }
    return this.instance;
  }

  public sendRequest(object: any, http: HttpClient, url: string, callback?: (response: any) => void) {
    const body = {
      content: object,
      'token': MainComponent.token,
    };
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');

    http.post(url, body, {headers: headers}).subscribe(
      data => {
        callback(data);
      },
    );
  }
}
