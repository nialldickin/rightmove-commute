# Rightmove Commute Time - Chrome Extension


![example usage video](https://j.gifs.com/XLmZ5g.gif)



## Changenotes

- V1.1: darkmode
  
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
