import { Component } from '@angular/core';
import { SocketServer } from './sockets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hello World';

  fromSocket = [];

  constructor(private socketServer: SocketServer) {
    socketServer.asObservable().do(console.log).subscribe(value => this.fromSocket = [...this.fromSocket, value]);
  }

  sendMessage(value){
    this.socketServer.sendData(value);
  }
}
