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

1. Download the [latest Windows release](https://github.com/winneon/watch-with-mpv/releases/download/1.2.6/native-windows.zip).
2. Unzip the archive into the directory of your choice.
3. Run `install.bat` as administrator.

**Do not remove the extracted directory after you have followed these steps.** If you wish to move or uninstall the native host, run `uninstall.bat` first. Then you may do as you like with the directory.

### Linux

Run the following commands in the terminal of your choice. **Requires Google Chrome, curl, and unzip to be installed.**

```
$ curl -L -O https://github.com/winneon/watch-with-mpv/releases/download/1.2.6/native-linux.zip
$ unzip native-linux.zip -d native-linux && cd native-linux
$ sudo ./install
```

## Usage

Just click on the MPV icon in the top right Chrome toolbar when you're on a playable webpage. Examples include YouTube, Twitch, Vimeo, a raw video file, even naughty websites! For a full list of supported URLs, visit youtube-dl's [documentation](https://rg3.github.io/youtube-dl/supportedsites.html).

## Contributing

To install the development version, run the following commands. Running the development version **requires** node.js, npm, and git to be installed.

```
$ git clone https://github.com/winneon/watch-with-mpv
$ cd watch-with-mpv/native
$ npm install
```

The extension's source files are located in `extension/`, and the native host's source files are located in `native/`. These two directories are independent of each other.

To load the extension into Chrome, go to `chrome://extensions` and click `Load unpacked extension`. Then select the `native/` directory.

To install the native host, run the following commands according to your platform. You will need to re-install the native host each time you edit its files.

### Windows

```
> cd native/build/win
> npm run build
> install.bat
```

### Linux

```
$ cd native/build/linux
$ npm run build
$ sudo ./install
```
