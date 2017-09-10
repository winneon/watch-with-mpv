# watch-with-mpv

Watch with MPV is a Chrome extension that allows you to open your current tab in MPV, assuming you have it installed. This extension works with every URL that is supported by youtube-dl.

## Prerequisites

The below prerequisites are required to be in your system's `PATH` environment variable.

* `mpv`
* `youtube-dl`

## Installation

This Chrome extension makes use of a native host in order to work properly. This is because of Chrome's extension restrictions. Without the native host, the extension is unable to run MPV from the browser instance.

Be sure you have the [Chrome extension](https://chrome.google.com/webstore/detail/gbgfakmgjoejbcffelendicfedkegllf) installed before you continue.

### Windows

1. Download the [latest Windows release](https://github.com/winneon/watch-with-mpv/releases/download/1.2.4/native-windows.zip).
2. Unzip the archive into the directory of your choice.
3. Run `install.bat` as administrator.

**Do not remove the extracted directory after you have followed these steps.** If you wish to move or uninstall the native host, run `uninstall.bat` first. Then you may do as you like with the directory.

### Linux

Run the following commands in the terminal of your choice. **Requires Google Chrome, curl, and unzip to be installed.**

```
$ curl -L -O https://github.com/winneon/watch-with-mpv/releases/download/1.2.4/native-linux.zip
$ unzip native-linux.zip -d native-linux && cd native-linux
$ sudo ./install
```

## Usage

Just click on the MPV icon in the top right Chrome toolbar when you're on a playable webpage. Examples include YouTube, Twitch, Vimeo, a raw video file, even naughty websites! For a full list of supported URLs, visit youtube-dl's [documentation](https://rg3.github.io/youtube-dl/supportedsites.html).
