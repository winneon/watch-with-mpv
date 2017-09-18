'use strict'

const native = require('chrome-native-messaging')
const MPV = require('node-mpv')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const version = require('./package.json').version

process.stdin
  .pipe(new native.Input())
  .pipe(new native.Transform((message, push, done) => {
    let directory = path.join(process.platform === 'linux' ? '/tmp' : process.env.TEMP, 'cookies.txt')
    fs.writeFileSync(directory, message.cookies.join('\n'))

    let player = new MPV({
      debug: false
    }, [
      '--cookies',
      process.platform === 'win32' ? `--cookies-file="${directory}"` : `--cookies-file=${directory}`,
      process.platform === 'win32' ? `--ytdl-raw-options=cookies=\"${directory}\"` : `--ytdl-raw-options=cookies=${directory}`
    ])

    let loadedBeforeEnded = false

    player.mpvPlayer.on('error', err => {
      console.error(err)

      push({
        error: err,
        version: version
      })

      done()
      process.exit(1)
    })

    player.socket.on('message', data => {
      if (data.event) {
        switch (data.event) {
          case 'file-loaded':
            loadedBeforeEnded = true

            push({
              error: 'success',
              version: version
            })

            done()
            process.exit(0)

            break
          case 'end-file':
            if (!loadedBeforeEnded) {
              push({
                error: 'error',
                version: version
              })

              done()
              process.exit(1)
            }

            process.exit(0)

            break
        }
      }
    })

    player.load(message.text)
  }))
  .pipe(new native.Output())
  .pipe(process.stdout)
