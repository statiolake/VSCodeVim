'use strict';

import * as vscode from 'vscode';
import { ModeName } from './mode';

export class ImSwitcher {
  private _nextInsertImOn: boolean;
  private _exec: any;

  constructor() {
    this._nextInsertImOn = false;
    this._exec = require('child_process').exec;
  }

  public modeChanged(prev: ModeName, curr: ModeName) {
    if (prev === ModeName.Insert) {
      this.leaveInsert();
    } else if (curr === ModeName.Insert) {
      this.enterInsert();
    } else {
      // nothing to do.
    }
  }

  private leaveInsert() {
    this._nextInsertImOn = this.isIMEOn();
    this.setIMEOff();
  }

  private enterInsert() {
    if (this._nextInsertImOn) {
      this.setIMEOn();
    }
  }

  public isIMEOn(): boolean {
    return this._exec('setime get', (isEnabled: any, out: any, err: any) => {
      return isEnabled;
    });
    // let res = false;
    // try {
    //   this._exec('setime get');
    // } catch (e) {
    //   res = true;
    // }
    // return res;
  }

  public setIMEOn() {
    this._exec('setime on');
  }

  public setIMEOff() {
    this._exec('setime off');
  }
}
