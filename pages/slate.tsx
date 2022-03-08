// Import React dependencies.
import React, { useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

// Also you must annotate `useState<Descendant[]>` and the editor's initial value.
export default function SlateEditor() {
    const initialValue: CustomElement[] = [{type: 'paragraph', children: [{text: "Insert text here"}]}]
    const [value, setValue] = useState<Descendant[]>(initialValue)
    const [editor] = useState(() => withReact(createEditor()))
    return (
      <Slate value={value} onChange={setValue} editor={editor} >
        <Editable />
      </Slate>
    )
  }