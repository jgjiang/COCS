import { Injectable } from '@angular/core';
import {COLORS} from '../../assets/colors';

declare var io: any;
declare var ace: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;
  clientsInfo: Object = {};
  clientsNum: number = 0;

  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    this.collaborationSocket.on('change', (delta: string) => { // 监听server端的变化
      console.log('collaboration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]); // 让editor保持最新的changes
    });

    this.collaborationSocket.on('cursorMove', (cursor) => {
      console.log('cursor move: ' + cursor);
      let session = editor.getSession();
      cursor = JSON.parse(cursor);
      let x = cursor['row'];
      let y = cursor['column'];
      let changeClientId = cursor['socketId'];
      console.log(x + ' ' + y + ' ' + changeClientId);

      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        this.clientsInfo[changeClientId] = {};
        let css = document.createElement('style');
        css.type = "text/css";
        css.innerHTML = ".editor_cursor_" + changeClientId
          + "{ position: absolute; background:" + COLORS[this.clientsNum] + ";"
          + " z-index: 100; width: 3px !important; }";
        document.body.appendChild(css);
        this.clientsNum ++;
      }

      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker(new Range(x, y, x, y + 1), 'editor_cursor_' + changeClientId, true);
      this.clientsInfo[changeClientId]['marker'] = newMarker;
    });
    // for testing
    this.collaborationSocket.on('message', (message) => {
      console.log('received: ' + message);
    });
  }

  // change() 方法，用于向server端发送change
  change (delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

  // 向server端发送curve的变化
  cursorMove(cursor: string): void {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }

}
