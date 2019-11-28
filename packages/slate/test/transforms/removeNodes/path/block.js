/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  Editor.removeNodes(editor, { at: [0] })
}

export const output = (
  <editor>
    <block>two</block>
  </editor>
)
