/** @jsx h */

import h from '../../../helpers/h'

const fragment = (
  <document>
    <table>
      <thead>
        <tr>
          <th>
            <paragraph>Column 1</paragraph>
          </th>
          <th>
            <paragraph>Column 2</paragraph>
          </th>
          <th>
            <paragraph>Column 3</paragraph>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <paragraph>Plain text</paragraph>
          </td>
          <td>
            <paragraph>
              <b>Bolded text</b>
            </paragraph>
          </td>
          <td />
        </tr>
      </tbody>
    </table>
    <list>
      <item>
        <paragraph>Plain text</paragraph>
      </item>
      <item>
        <emoji />
      </item>
      <item />
    </list>
  </document>
)

export default function(editor) {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    <document>
      <paragraph>
        Some initial text.<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Some initial text.<cursor />
      </paragraph>
      <table>
        <thead>
          <tr>
            <th>
              <paragraph>Column 1</paragraph>
            </th>
            <th>
              <paragraph>Column 2</paragraph>
            </th>
            <th>
              <paragraph>Column 3</paragraph>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <paragraph>Plain text</paragraph>
            </td>
            <td>
              <paragraph>
                <b>Bolded text</b>
              </paragraph>
            </td>
            <td>
              <text />
            </td>
          </tr>
        </tbody>
      </table>
      <list>
        <item>
          <paragraph>Plain text</paragraph>
        </item>
        <item>
          <text />
          <emoji>
            <text />
          </emoji>
          <text />
        </item>
        <item>
          <text>
            <cursor />
          </text>
        </item>
      </list>
    </document>
  </value>
)
