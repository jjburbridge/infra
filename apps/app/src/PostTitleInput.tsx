import {type DocumentHandle, useDocument, useEditDocument} from '@sanity/sdk-react'
import {TextInput} from '@sanity/ui'

/**
 * Writes straight to the Content Lake on every keystroke, so edits made here and
 * in the Studio stay in sync without a save step.
 */
export function PostTitleInput(handle: DocumentHandle) {
  const {data: title} = useDocument<string, 'title'>({...handle, path: 'title'})
  const editTitle = useEditDocument<string>({...handle, path: 'title'})

  return (
    <TextInput
      aria-label="Post title"
      fontSize={2}
      padding={3}
      placeholder="Untitled post"
      value={title ?? ''}
      onChange={(event) => editTitle(event.currentTarget.value)}
    />
  )
}
