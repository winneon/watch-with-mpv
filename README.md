# watch-with-mpv

Watch with MPV is a Chrome extension that allows you to open your current tab in MPV, assuming you have it installed. This extension works with every URL that is supported by youtube-dl.

## Prerequisites

* `mpv` installed into your system's `PATH`
* Nothing else at the moment.

## Installation

This Chrome extension makes use of a native host in order to work properly. This is because of Chrome's extension restrictions. Without the native host, the extension is unable to run MPV from the browser instance.

If you've already installed the Chrome extension from the webstore, skip the first step.

1. Download and install the [Chrome extension](https://chrome.google.com/webstore/detail/gbgfakmgjoejbcffelendicfedkegllf) from the webstore.
2. Download the latest release of the native host from the [releases page](https://github.com/winneon/watch-with-mpv/releases/latest). It should be called `native.zip`.
3. Unzip the downloaded archive into a folder of your choice.
4. Run `install.bat` as administrator.

**Do not remove the extracted folder after you have followed these steps.** If you wish to move or uninstall the native host, run `uninstall.bat` first. Then you may do as you like with the folder.

## Usage

Just click on the MPV icon in the top right Chrome toolbar when you're on a playable webpage. Examples include YouTube, Twitch, Vimeo, a raw video file, even naughty websites! For a full list of supported URLs, visit youtube-dl's [documentation](https://rg3.github.io/youtube-dl/supportedsites.html).
