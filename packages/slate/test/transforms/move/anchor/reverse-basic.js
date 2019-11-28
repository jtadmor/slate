/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.move(editor, { edge: 'anchor', reverse: true })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <anchor /> tw
      <focus />o three
    </block>
  </editor>
)
