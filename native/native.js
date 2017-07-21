'use strict'

const native = require('chrome-native-messaging')
const { spawn } = require('child_process')

process.stdin
  .pipe(new native.Input())
  .pipe(new native.Transform((message, push, done) => {
    let mpv = spawn('mpv', [ message.text ])

    mpv.stdout.setEncoding('utf8')
    mpv.stderr.setEncoding('utf8')

    mpv.stderr.on('data', (data) => {
      // nothing.
    })

    mpv.stdout.on('data', (data) => {
      let stdout = data
      let obj = { stdout }

      if (stdout.includes('youtube-dl failed')) obj.code = 2
      if (stdout.includes('ERROR: Unsupported URL')) obj.code = 1
      if (stdout.includes('No protocol handler found to open URL')) obj.code = 1

      if (obj.code !== undefined){
        push(obj)
        done()
      }
    })
  }))
  .pipe(new native.Output())
  .pipe(process.stdout)
