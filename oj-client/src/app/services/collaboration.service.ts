import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;

  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    this.collaborationSocket.on('change', (delta: string) => { // 监听server端的变化
      console.log('collaboration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]); // 让editor保持最新的changes
    });

    this.collaborationSocket.on('message', (message) => {
      console.log('received: ' + message);
    });
  }

  // change() 方法，用于向server端发送change
  change (delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

}
