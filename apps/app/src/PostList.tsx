import {useDocuments} from '@sanity/sdk-react'
import {Box, Button, Card, Container, Flex, Heading, Stack, Text} from '@sanity/ui'
import {Suspense} from 'react'
import {CreatePostButton} from './CreatePostButton'
import {PostCard} from './PostCard'

export function PostList() {
  const {data, hasMore, loadMore, isPending} = useDocuments({
    documentType: 'post',
    batchSize: 10,
    orderings: [{field: '_updatedAt', direction: 'desc'}],
  })

  return (
    <Container width={1}>
      <Stack space={4} paddingY={5}>
        <Flex align="center" justify="space-between" gap={3}>
          <Heading as="h1">Posts</Heading>
          <CreatePostButton />
        </Flex>

        {data.length === 0 ? (
          <Card padding={4} radius={3} tone="transparent">
            <Text muted>No posts yet. Create one here or in the Studio.</Text>
          </Card>
        ) : (
          <Stack space={3}>
            {data.map((handle) => (
              <Suspense
                key={handle.documentId}
                fallback={
                  <Card padding={4} radius={3} shadow={1}>
                    <Text muted>Loading…</Text>
                  </Card>
                }
              >
                <PostCard {...handle} />
              </Suspense>
            ))}
          </Stack>
        )}

        {hasMore && (
          <Box>
            <Button
              mode="ghost"
              text="Load more"
              disabled={isPending}
              onClick={loadMore}
              width="fill"
            />
          </Box>
        )}
      </Stack>
    </Container>
  )
}
