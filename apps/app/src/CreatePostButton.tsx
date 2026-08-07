import {useCreateDocument} from '@sanity/sdk-react'
import {Button, useToast} from '@sanity/ui'
import {useState} from 'react'
import {type Post} from './sanity.types'

export function CreatePostButton() {
  const createPost = useCreateDocument<Post>({documentType: 'post'})
  const [isCreating, setIsCreating] = useState(false)
  const toast = useToast()

  async function handleClick() {
    setIsCreating(true)
    try {
      await createPost({title: 'Untitled post'})
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Could not create post',
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Button
      text="New post"
      tone="primary"
      disabled={isCreating}
      onClick={handleClick}
    />
  )
}
