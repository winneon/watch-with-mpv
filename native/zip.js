'use strict'

const archiver = require('archiver')
const path = require('path')
const fs = require('fs')

function finishLog(target){
  console.log(`Finished building the ${target} target. The zip file can be found in dist/.`)
}

function archiveWarn(err){
  if (err.code === 'ENOENT'){
    console.error(err)
  } else {
    throw err
  }
}

function archiveError(err){
  throw err
}

try {
  fs.mkdirSync(path.join(__dirname, 'dist'))
} catch (err){
  if (err.code !== 'EEXIST') throw err
}

let jsonName = 'moe.winneon.watchwithmpv.json'

let execLinux = 'watch-with-mpv-native-linux'
let execWin = 'watch-with-mpv-native-win.exe'

let jsonFile = require(`./build/${jsonName}`)

jsonFile.path = '/usr/bin/' + execLinux
fs.writeFileSync(path.join('build', 'linux', jsonName), JSON.stringify(jsonFile, null, 2))

jsonFile.path = execWin
fs.writeFileSync(path.join('build', 'win', jsonName), JSON.stringify(jsonFile, null, 2))

fs.renameSync(path.join('build', execLinux), path.join('build', 'linux', execLinux))
fs.renameSync(path.join('build', execWin), path.join('build', 'win', execWin))

let outputLinux = fs.createWriteStream(path.join(__dirname, 'dist', 'native-linux.zip'))
let outputWin = fs.createWriteStream(path.join(__dirname, 'dist', 'native-windows.zip'))

let archiveLinux = archiver('zip', {
  zlib: { level: 9 }
})

let archiveWin = archiver('zip', {
  zlib: { level: 9 }
})

outputLinux.on('close', () => finishLog('linux'))
outputWin.on('close', () => finishLog('windows'))

archiveLinux.on('warning', archiveWarn)
archiveWin.on('warning', archiveWarn)

archiveLinux.on('error', archiveError)
archiveWin.on('error', archiveError)

archiveLinux.pipe(outputLinux)
archiveWin.pipe(outputWin)

archiveLinux.directory(path.join('build', 'linux'), false)
archiveWin.directory(path.join('build', 'win'), false)

archiveLinux.finalize()
archiveWin.finalize()
