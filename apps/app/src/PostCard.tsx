import {type DocumentHandle, useDocumentProjection} from '@sanity/sdk-react'
import {Card, Flex, Stack, Text} from '@sanity/ui'
import {Suspense} from 'react'
import {PostTitleInput} from './PostTitleInput'

interface PostPreview {
  authorName?: string
  publishedAt?: string
  excerpt?: string
}

export function PostCard(handle: DocumentHandle) {
  const {data} = useDocumentProjection<PostPreview>({
    ...handle,
    projection: `{"authorName": author->name, publishedAt, excerpt}`,
  })

  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={4}>
        <Suspense fallback={<Text muted>Loading title…</Text>}>
          <PostTitleInput {...handle} />
        </Suspense>

        {data.excerpt && <Text muted>{data.excerpt}</Text>}

        <Flex gap={3}>
          <Text size={1} muted>
            {data.authorName ?? 'No author'}
          </Text>
          <Text size={1} muted>
            {data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Unpublished'}
          </Text>
        </Flex>
      </Stack>
    </Card>
  )
}
