# Rightmove Commute Time - Chrome Extension

![](https://j.gifs.com/XLmZ5g.gif)

# Changelog

## [1.1.3]

- Darkmode is now toggleable using an in-app icon

  ![](https://j.gifs.com/YWo4Yp.gif)

- You can now specify an arrival time for commutes. At present this only affects public transport.

  ![](https://j.gifs.com/k89zjx.gif)

- Fixed a bug whereby viewing the gallery or map would remove the commute times from the webpage when the user returned to the main page.

## [1.1.0]

- Darkmode for those using night-shift

  ![](https://user-images.githubusercontent.com/36296712/115534767-05217080-a290-11eb-9b48-91ce8da57b14.png)

## Getting started

Clone this repo.

Navigate to the directory and install the dependencies.

```
$ yarn install
```

To build the extension, and rebuild it when the files are changed, run

```
$ yarn start
```

Otherwise, to build a production version, run

```
$ yarn build
```

After the project has been built, a directory named `dist` has been created. You have to add this directory to your Chrome browser:

1. Open Chrome.
2. Navigate to `chrome://extensions`.
3. Enable _Developer mode_.
4. Click _Load unpacked_.
5. Select the `dist` directory.

## Backend

https://github.com/nialldickin/rightmove-commute-backend
