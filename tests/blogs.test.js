const Page = require('./helpers/page')

let page

const BLOG_TITLE = 'My title'
const BLOG_CONTENT = 'My input'

beforeEach(async () => {
  page = await Page.build()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  await page.close()
})

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login()
    await page.click('a.btn-floating')
  })

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label')

    expect(label).toEqual('Blog Title')
  })

  describe('Using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', BLOG_TITLE)
      await page.type('.content input', BLOG_CONTENT)

      await page.click('form button')
    })

    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5')

      expect(text).toEqual('Please confirm your entries')
    })

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green')
      await page.waitFor('.card')

      const title = await page.getContentsOf('.card-title')
      const content = await page.getContentsOf('p')

      expect(title).toEqual(BLOG_TITLE)
      expect(content).toEqual(BLOG_CONTENT)
    })
  })

  describe('Using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button')
    })

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text')
      const contentError = await page.getContentsOf('.content .red-text')

      expect(titleError).toEqual('You must provide a value')
      expect(contentError).toEqual('You must provide a value')
    })
  })
})

describe('When user not logged in', async () => {
  test('user can not create new blog', async () => {
    const result = await page.evaluate(
      () => {
        return fetch('/api/blogs', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'My title',
            content: 'My content'
          })
        }).then(res =>
          res.json()
        )
      }
    )

    expect(result).toEqual({ error: 'You must log in!' })
  })

  test('user can not get list of blogs', async () => {
    const result = await 

    expect(result).toEqual({ error: 'You must log in!' })
  })

})
