import dynamic from 'next/dynamic'
import withRepoBasic from '../../components/with-repo-basic'
import { request } from '../../lib/api'

const MDRenderer = dynamic(import('../../components/MarkdownRenderer'), {
  loading: () => <p>loading</p>
})

const Detail = ({ readme }) => {
  const isBase64 = readme.encoding === 'base64'
  return <MDRenderer content={readme.content} isBase64={isBase64} />
}

Detail.getInitialProps = async function({
  ctx: {
    query: { owner, name },
    req,
    res
  }
}) {
  const readmeResp = await request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    req,
    res
  )

  return {
    readme: readmeResp.data
  }
}

export default withRepoBasic(Detail, 'detail')
