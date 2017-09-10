'use strict'

let interval = undefined

function setIcon(type, callback) {
  switch (type) {
    case 'mpv':
      chrome.browserAction.setIcon({ path: 'icons/mpv.png' }, () => {
        chrome.browserAction.setBadgeText({ text: '' })
        if (callback) callback()
      })

      if (interval) {
        clearInterval(interval)
        interval = undefined
      }

      break
    case 'error':
      chrome.browserAction.setIcon({ path: 'icons/error.png' }, () => {
        chrome.browserAction.setBadgeText({ text: '' })

        if (callback) callback()
        setIcon('mpv')
      })

      if (interval) {
        clearInterval(interval)
        interval = undefined
      }

      break
    case 'completed':
      chrome.browserAction.setIcon({ path: 'icons/checkmark.png' }, () => {
        chrome.browserAction.setBadgeText({ text: '' })
        setTimeout(() => chrome.browserAction.setIcon({ path: 'icons/mpv.png' }), 1000)
      })

      if (interval) {
        clearInterval(interval)
        interval = undefined
      }

      break
    case 'working':
      function run(num) {
        chrome.browserAction.setIcon({ path: 'icons/timer.png' }, () => {
          let str = ' '

          for (i = 0; i < num; i++){
            str += '. '
          }

          chrome.browserAction.setBadgeText({ text: str })
        })
      }

      let i = 1
      run(i)

      interval = setInterval(() => {
        if (i < 3) {
          i++
          run(i)
        } else {
          i = 1
          run(i)
        }
      }, 500)

      break
  }
}

function runNative(url){
  let split = url.split('/')

  chrome.cookies.getAll({
    url: `${split[0]}//${split[2]}`
  }, (cookies) => {
    let list = [ '# Netscape HTTP Cookie File' ]

    cookies.forEach((cookie) => {
      let expirationDate = cookie.expirationDate ? Math.round(cookie.expirationDate) : 0
      let dot = cookie.domain.startsWith('.').toString().toUpperCase()

      list.push(`${cookie.domain} ${dot} ${cookie.path} ${cookie.secure.toString().toUpperCase()} ${expirationDate} ${cookie.name} ${cookie.value}`.replace(/\s/g, '\t'))
    })

    setIcon('working')

    chrome.runtime.sendNativeMessage('moe.winneon.watchwithmpv', {
      text: url,
      cookies: list
    }, (data) => {
      let runtimeError = chrome.runtime.lastError
      console.log(runtimeError)

      if (runtimeError && runtimeError.message === 'Specified native messaging host not found.'){
        console.log(runtimeError.message)
        let bool = confirm('Unable to connect to the native host. You may not have it installed.\nClick OK to redirect to the download page.')

        if (bool){
          chrome.tabs.create({ url: 'https://github.com/winneon/watch-with-mpv/releases/latest' })
        }

        setIcon('mpv')
      } else {
        if (!data.version || data.version !== chrome.app.getDetails().version) {
          setIcon('error', () => {
            alert(
`Your extension's version does not match the native host's
version. Please make sure that this extension and the
native host are both updated and are the same version.

Afterwards, try again.`)
          })
        } else if (data.error === 'success') {
          setIcon('completed')
        } else {
          setIcon('error', () => {
            let bool = confirm(
  `An error occured while trying to open MPV. The error has
  been logged in the console.

  This error is most likely because the URL you specified is
  not supported by youtube-dl, or you do not have youtube-dl
  installed.

  Make sure that youtube-dl is installed, and then
  click OK to view supported URLs. Otherwise, click Cancel.`)

            if (bool){
              chrome.tabs.create({ url: 'https://rg3.github.io/youtube-dl/supportedsites.html' })
            }
          })
        }
      }
    })
  })
}

chrome.contextMenus.create({
  title: 'Watch with MPV',
  contexts: [ 'link' ],
  onclick: (info, tab) => runNative(info.linkUrl)
}, (error) => {
  if (chrome.runtime.lastError){
    console.log((chrome.runtime.lastError))
  }
})

chrome.browserAction.onClicked.addListener(tab => runNative(tab.url))
