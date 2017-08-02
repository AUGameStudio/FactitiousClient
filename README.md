This is the repository containing the client-side Angular app.

# Setup #

As usual, after cloning this repo, you'll need to fetch the node / bower libraries, thusly:

    npm install
    bower install

# Building #

When you're ready for a build, use

    gulp clean
    gulp build

These commands first clear out any existing `dist/` files, and then builds the project into the `dist` folder.

After the build is done, copy the files within the `dist/` to the html root (`/usr/share/nginx/html/`) on the factitious.augamestudio.com server via ftp.

# For Local testing #

The `gulp/server.js` file is setup to proxy to the local django app on port 8000; so before running `gulp serve`, make sure that you've already activated an environment in another terminal and launched `python manage.py runserver` as directed in the README.md file in the `fact2server` repository.
