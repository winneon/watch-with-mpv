'use strict'

let port = chrome.runtime.connectNative('moe.winneon.watchwithmpv')

port.onMessage.addListener((error) => {
  errorShowing = true
  let opening = 'An error occured while trying to open MPV.\nThe error has been logged in the console.\n\n'

  chrome.browserAction.setIcon({ path: 'icons/error.png' }, () => {
    console.log(error.stderr.length > 0 ? error.stderr : error.stdout)

    switch (error.code){
      default:
      case 0:
        alert(opening + 'To open the console, go to chrome://extensions and\nclick \'Inspect views: background page\' under Watch with MPV.')
        break
      case 1:
        let bool = confirm(opening + 'This error is most likely because the URL you\nspecified is not supported by youtube-dl.\n\nClick OK to view supported URLs. Otherwise, click Cancel.')

        if (bool){
          chrome.tabs.create({ url: 'https://rg3.github.io/youtube-dl/supportedsites.html' })
        }

        break
      case 2:
        alert(opening + 'This error is most likely because youtube-dl cannot be found by MPV.')
        break
    }

    chrome.browserAction.setIcon({ path: 'icons/mpv.png' }, () => errorShowing = false)
  })
})

chrome.browserAction.onClicked.addListener((tab) => {
  try {
    port.postMessage(tab.url)

    chrome.browserAction.setIcon({ path: 'icons/checkmark.png' }, () => {
      setTimeout(() => {
        if (!errorShowing){
          chrome.browserAction.setIcon({ path: 'icons/mpv.png' })
        }
      }, 1000)
    })
  } catch (err){
    console.log(err)
    let bool = confirm('Unable to connect to the native host. You may not have it installed.\nClick OK to redirect to the download page.')

    if (bool){
      chrome.tabs.create({ url: 'https://github.com/winneon/watch-with-mpv/releases/latest' })
    }
  }
})
