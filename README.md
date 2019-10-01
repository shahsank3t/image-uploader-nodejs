# image-uploader-nodejs
Simple node application that lets user upload image file of dimensions 1024 x 1024 and crops into various other dimensions and displays that to the user.

## To install npm packages run the following command:
        `npm install`

## To run the application, run the following command:
        `node server.js`

This will start your application on port 3000.
Hit the URL: http://localhost:3000 in your web browser.

## Note:
If you get any error for `ImageMagick`, it is because ImageMagic is not installed on you machine.

### To install on ubuntu, run the following command:
  `apt-get install imagemagick`

### To install on mac, run the following command:
  `brew update && brew install imagemagick`
