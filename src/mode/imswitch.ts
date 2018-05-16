'use strict';

import * as vscode from 'vscode';
import { ModeName } from './mode';

export class ImSwitcher {
  private _nextInsertImOn: boolean;
  private _exec: any;

  constructor() {
    this._nextInsertImOn = false;
    this._exec = require("child_process").execSync;
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
    this._nextInsertImOn = false;
    try {
      this._exec("setime get");
    } catch (e) {
      this._nextInsertImOn = true;
    }
    this._exec("setime off");
  }

  private enterInsert() {
    if (this._nextInsertImOn) {
      this._exec("setime on");
    }
  }
}