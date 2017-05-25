import test from 'ava'
import cdnjs from './index'

const searchWithoutOptions = cdnjs.search('jquery')
test('search has result', async t => {
  await searchWithoutOptions.then(result => {
    t.true(Array.isArray(result))
    t.true(result.length > 0)
  })
})

test('should contains valid result of `jquery` library', async t => {
  await searchWithoutOptions.then(result => {
    const filteredResult = result.filter(item => item.name === 'jquery')
    t.is(filteredResult[0].name, 'jquery')
  })
})

const searchWithOptions = cdnjs.search('jquery', {fields: {description: true}})
test('should contains description in `jquery` library', async t => {
  await searchWithOptions.then(result => {
    t.true('description' in result[0])
  })
})

const searchPrettify = cdnjs.search('jquery', {json: false})
test('search output is readable string', async t => {
  await searchPrettify.then(result => {
    t.is(typeof result, 'string')
  })
})

const jquery = cdnjs.lib('jquery')
test('data of the `jquery` library is valid', async t => {
  await jquery.then(result => {
    t.is(result.name, 'jquery')
    t.true(Array.isArray(result.assets))
    t.true(result.assets.length > 0)
  })
})

const jqueryVersion = cdnjs.versions('jquery')
test('versions list of `jquery` library is valid', async t => {
  await jqueryVersion.then(versions => {
    t.true(Array.isArray(versions))
    t.true(versions.length > 0)
  })
})

const jqueryFiles = cdnjs.files('jquery')
test('files list of `jquery` library is valid', async t => {
  await jqueryFiles.then(files => {
    t.true(Array.isArray(files))
    t.true(files.length > 0)
  })
})

const jqueryFilesVersion = cdnjs.files('jquery@1.12.0')
test('files list of `jquery` version `1.12.0` is valid', async t => {
  await jqueryFilesVersion.then(files => {
    t.true(Array.isArray(files))
    t.true(files.length > 0)
    t.deepEqual(files, ['jquery.js', 'jquery.min.js', 'jquery.min.map'])
  })
})

test('get `jquery` version `3.2.1` url', t => {
  t.is(cdnjs.url('jquery@3.2.1', 'jquery.min.js'), 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js')
})
