/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'insert_node',
    path: [1],
    node: {
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              marks: [],
              object: 'leaf',
              text: '',
            },
          ],
        },
      ],
      type: 'paragraph',
      object: 'block',
    },
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        Word
      </paragraph>
      <paragraph>
        Some other word
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        Word
      </paragraph>
      <paragraph />
      <paragraph>
        Some other word
        <focus />
      </paragraph>
    </document>
  </value>
)
