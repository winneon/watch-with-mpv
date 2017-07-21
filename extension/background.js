'use strict'

let errorShowing = false

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.runtime.sendNativeMessage('moe.winneon.watchwithmpv', { text: tab.url }, (error) => {
    errorShowing = true
    let runtimeError = chrome.runtime.lastError

    chrome.browserAction.setIcon({ path: 'icons/error.png' }, () => {
      if (runtimeError && runtimeError.message === "Specified native messaging host not found."){
        console.log(runtimeError.message)
        let bool = confirm('Unable to connect to the native host. You may not have it installed.\nClick OK to redirect to the download page.')

        if (bool){
          chrome.tabs.create({ url: 'https://github.com/winneon/watch-with-mpv/releases/latest' })
        }

        chrome.browserAction.setIcon({ path: 'icons/mpv.png' }, () => errorShowing = false)

        return
      }

      let opening = 'An error occured while trying to open MPV.\nThe error has been logged in the console.\n\n'
      console.log(error.stdout)

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

  chrome.browserAction.setIcon({ path: 'icons/checkmark.png' }, () => {
    setTimeout(() => {
      if (!errorShowing){
        chrome.browserAction.setIcon({ path: 'icons/mpv.png' })
      }
    }, 1000)
  })
})
