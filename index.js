const axios = require('axios')
const merge = require('lodash.merge')
const findVersions = require('find-versions')

const apiUrl = 'https://api.cdnjs.com/libraries'
const fileUrl = 'https://cdnjs.cloudflare.com/ajax/libs'

const defaultOptions = {
  fields: {
    version: false,
    description: false,
    homepage: false,
    keywords: false,
    license: false,
    repository: false,
    autoupdate: false,
    author: false,
    assets: false
  },
  json: true
}

const buildParams = (query, options) => {
  const fields = []
  for (const key in options.fields) {
    if (Object.prototype.hasOwnProperty.call(options.fields, key) && options.fields[key]) {
      fields.push(key)
    }
  }

  const params = {}

  if (query) {
    params.search = query
  }

  if (options.json === false) {
    params.output = 'human'
  }

  if (fields.length > 0) {
    params.fields = fields.join(',')
  }

  return params
}

const search = (query, options = {}) => {
  const validOptions = merge(merge({}, defaultOptions), options)
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: apiUrl,
      params: buildParams(query, validOptions)
    }).then(response => {
      resolve((validOptions.json === false) ? response.data : response.data.results)
    }).catch(err => {
      reject(err)
    })
  })
}

const lib = (name, options = {}) => {
  const validOptions = merge(merge({}, defaultOptions), options)
  return new Promise((resolve, reject) => {
    if (!name) {
      throw new Error('Library name should provided.')
    }
    axios({
      method: 'get',
      url: `${apiUrl}/${name}`,
      params: buildParams(null, validOptions)
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

const versions = (name, options = {}) => {
  return new Promise((resolve, reject) => {
    lib(name, options).then(result => {
      let _versions = []
      if ('assets' in result && Array.isArray(result.assets) && result.assets.length > 0) {
        const {assets} = result
        if (assets.length > 0) {
          _versions = assets.map(item => item.version)
        }
      }

      resolve(_versions)
    }).catch(err => {
      reject(err)
    })
  })
}

const getVersion = name => {
  const foundVersions = findVersions(name)
  let version

  if (/(.*)@/.test(name) && foundVersions.length > 0) {
    version = foundVersions[0]
    name = name.replace(/(.[^@]*)@(.*)/, '$1')
  }

  return {name, version}
}

const getUrl = (libname, filename) => {
  const {name, version} = getVersion(libname)

  if (!libname || !name || !version || !filename) {
    throw new Error('Library name, version, or filename undefined.')
  }

  if (Array.isArray(filename)) {
    return filename.map(item => `${fileUrl}/${name}/${version}/${item}`)
  }

  return `${fileUrl}/${name}/${version}/${filename}`
}

const files = (name, options = {}, fullUrl = false) => {
  const availableVersion = getVersion(name)
  return new Promise((resolve, reject) => {
    lib(availableVersion.name, options).then(result => {
      let fileList = []
      if ('assets' in result && Array.isArray(result.assets) && result.assets.length > 0) {
        const {assets} = result
        let {version} = result
        if (availableVersion.version) {
          version = availableVersion.version
        }

        const filteredFiles = assets.filter(item => item.version === version)
        fileList = filteredFiles[0].files
      }

      if (fullUrl) {
        fileList = getUrl(name, fileList)
      }

      resolve(fileList)
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports.search = search
module.exports.lib = lib
module.exports.versions = versions
module.exports.url = getUrl
module.exports.files = files
