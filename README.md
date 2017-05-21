# :globe_with_meridians: Unofficial CDNJS API
Search cdnjs libraries just a snap - More Information about API https://cdnjs.com/api

## Install
Using NPM  
`npm install cdnjs-api --save`

Using Yarn  
`yarn add cdnjs-api`

## Usage
`cdnjs.search|lib|versions|files(query: string, options?: Object)`

```javascript
const cdnjs = require('cdnjs-api')

// Search jquery
cdnjs.search('jquery').then(result => {
  console.log(result)
})

// Display custom fields
// See available fields on documentation below
cdnjs.search('jquery', {
  fields: {
    description: true,
    version: true
  }
}).then(result => {
  console.log(result)
})

// Print HTML instead of JSON
cdnjs.search('jquery', {
  json: false
}).then(result => {
  console.log(result)
})

// Get jquery data
cdnjs.lib('jquery').then(result => {
  console.log(result)
})

// Get jquery versions
cdnjs.versions('jquery').then(result => {
  console.log(result)
})

// Get jquery files
cdnjs.files('jquery').then(result => {
  console.log(result)
})

// Get jquery version 1.12.0 files
cdnjs.files('jquery@1.12.0').then(result => {
  console.log(result)
})
```

### API

| Methods | Description |
| --- | --- |
| **search** | Search with query |
| **lib** | Get library data |
| **versions** | Get library versions |
| **files** | Get library files |

**Default Options**
```javascript
{
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
```

**Available Fields**
* version
* description
* homepage
* keywords
* license
* repository
* autoupdate
* author
* assets

## License
MIT © [oknoorap](https://github.com/oknoorap)
