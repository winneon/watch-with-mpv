'use strict'

const archiver = require('archiver')
const path = require('path')
const fs = require('fs')

try {
  fs.mkdirSync(path.join(__dirname, 'dist'))
} catch (err){
  if (err.code !== 'EEXIST') throw err
}

let output = fs.createWriteStream(path.join(__dirname, 'dist', 'native.zip'))

let archive = archiver('zip', {
  zlib: { level: 9 }
})

output.on('close', () => {
  console.log('Finished building. The zip file can be found in dist/.')
})

archive.on('warning', (err) => {
  if (err.code === 'ENOENT'){
    console.error(err)
  } else {
    throw err
  }
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

archive.directory('build/', false)
archive.finalize()
