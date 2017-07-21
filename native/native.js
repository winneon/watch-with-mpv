'use strict'

const native = require('chrome-native-messaging')
const { execSync } = require('child_process')

process.stdin
  .pipe(new native.Input())
  .pipe(new native.Transform((message, push, done) => {
    try {
      execSync(`mpv ${message}`, { encoding: 'utf8'})
    } catch (error){
      let stderr = error.stderr
      let stdout = error.stdout
      let obj = { stderr, stdout }

      if (stderr.length > 0) stdout = stderr
      if (stdout.includes('youtube-dl failed')) obj.code = 2
      if (stdout.includes('ERROR: Unsupported URL')) obj.code = 1
      if (stdout.includes('No protocol handler found to open URL')) obj.code = 1
      if (obj.code === undefined) obj.code = 0

      push(obj)
    }

    done()
  }))
  .pipe(new native.Output())
  .pipe(process.stdout)
