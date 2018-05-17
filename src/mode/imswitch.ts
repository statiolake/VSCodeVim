'use strict';

import * as vscode from 'vscode';
import { ModeName } from './mode';

export class ImSwitcher {
  private _nextInsertImOn: boolean;
  private _execSync: any;

  constructor() {
    this._nextInsertImOn = false;
    this._execSync = require('child_process').execSync;
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
    let res = false;
    try {
      this._execSync('ime-remote get');
    } catch (e) {
      res = true;
    }
    return res;
  }

  public setIMEOn() {
    this._execSync('ime-remote on');
  }

  public setIMEOff() {
    this._execSync('ime-remote off');
  }
}
