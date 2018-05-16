import * as assert from 'assert';
import * as vscode from 'vscode';

import { getAndUpdateModeHandler } from '../../extension';
import { Remappers } from '../../src/configuration/remapper';
import { ModeName } from '../../src/mode/mode';
import { ModeHandler } from '../../src/mode/modeHandler';
import { Configuration } from '../testConfiguration';
import { assertEqual, setupWorkspace, cleanUpWorkspace } from '../testUtils';

suite('Remapper', () => {
  let modeHandler: ModeHandler;
  const leaderKey = '\\';
  const insertModeKeyBindings = [
    {
      before: ['j', 'j'],
      after: ['<Esc>'],
    },
  ];
  const otherModeKeysRebindings = [
    {
      before: ['leader', 'w'],
      after: [],
      commands: [
        {
          command: 'workbench.action.closeActiveEditor',
          args: [],
        },
      ],
    },
  ];

  setup(async () => {
    let configuration = new Configuration();
    configuration.leader = leaderKey;
    configuration.insertModeKeyBindings = insertModeKeyBindings;
    configuration.otherModesKeyBindings = otherModeKeysRebindings;

    await setupWorkspace(configuration);
    modeHandler = await getAndUpdateModeHandler();
  });

  teardown(cleanUpWorkspace);

  test('jj -> <Esc>', async () => {
    // setup
    await modeHandler.handleKeyEvent('i');
    assertEqual(modeHandler.currentMode.name, ModeName.Insert);
    let remapper = new Remappers();

    // act
    let actual = false;
    let dummy;
    try {
      const res = await remapper.sendKey(['j', 'j'], modeHandler, modeHandler.vimState);
      actual = res.handled;
    } catch (e) {
      assert.fail(e);
    }

    // assert
    assert.equal(actual, true);
    assertEqual(modeHandler.currentMode.name, ModeName.Normal);
  });

  test('remapped command with leader ', async () => {
    // setup
    let remapper = new Remappers();
    assertEqual(modeHandler.currentMode.name, ModeName.Normal);

    // act
    let actual = false;
    try {
      const res = await remapper.sendKey([leaderKey, 'w'], modeHandler, modeHandler.vimState);
      actual = res.handled;
    } catch (e) {
      assert.fail(e);
    }

    // assert
    assert.equal(actual, true);
    assert.equal(vscode.window.visibleTextEditors.length, 0);
  });
});
