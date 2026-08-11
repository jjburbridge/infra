import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {Flex, Spinner} from '@sanity/ui'
import {dataset, projectId} from './env'
import {PostList} from './PostList'
import {SanityUI} from './SanityUI'

// apps can access many different projects or other sources of data
const sanityConfigs: SanityConfig[] = [
  {
    projectId,
    dataset,
  },
]

function Loading() {
  return (
    <Flex justify="center" align="center" height="fill" style={{width: '100vw' color: 'red'}}>
      <Spinner />
    </Flex>
  )
}

function App() {
  return (
    <SanityUI>
      <SanityApp config={sanityConfigs} fallback={<Loading />}>
        <PostList />
      </SanityApp>
    </SanityUI>
  )
}

export default App
