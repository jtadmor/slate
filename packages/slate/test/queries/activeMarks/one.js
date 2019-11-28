/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <mark key="a">
        o<cursor />
        ne
      </mark>
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.activeMarks(editor))
}

export const output = [{ key: 'a' }]
