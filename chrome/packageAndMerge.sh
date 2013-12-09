# package up metadata for the chrome web store
zip -r app.zip app

# clean up working web app directory
rm -fr www/*

# copy web assets from main project's www directory
cp -a ../www/ www/

# overwrite default web assets with any chrome-specific versions of those files
cp -a merges/ www/

# everything in the ./www directory is now ready to be uploaded to a hosting site
