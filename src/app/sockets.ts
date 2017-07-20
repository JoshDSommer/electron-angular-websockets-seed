import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';

@Injectable()
export class SocketServer {

	private _webSocket$ = Observable.webSocket('ws://localhost:3000/');

	public asObservable(): Observable<any> {
		return this._webSocket$.retry();
	}

	public sendData(value) {
		this._webSocket$.next(value);
	}
}