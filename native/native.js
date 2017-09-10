'use strict'

const native = require('chrome-native-messaging')
const MPV = require('node-mpv')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

process.stdin
  .pipe(new native.Input())
  .pipe(new native.Transform((message, push, done) => {
    let directory = path.join(process.platform === 'linux' ? '/tmp' : process.env.TEMP, 'cookies.txt')
    fs.writeFileSync(directory, message.cookies.join('\n'))

    let player = new MPV({
      debug: false
    }, [
      '--cookies',
      `--cookies-file=${directory}`,
      `--ytdl-raw-options=cookies=${directory}`
    ])

    let loadedBeforeEnded = false

    player.socket.on('message', data => {
      if (data.event) {
        switch (data.event) {
          case 'file-loaded':
            loadedBeforeEnded = true
            push({ error: 'success' })
            done()

            break
          case 'end-file':
            if (!loadedBeforeEnded) {
              player.quit()
              push({ error: 'error' })
              done()
            }

            break
        }
      }
    })

    player.load(message.text)
  }))
  .pipe(new native.Output())
  .pipe(process.stdout)
