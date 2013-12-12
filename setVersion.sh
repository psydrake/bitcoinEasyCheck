# Run this script to set the versions in each platform to the values declared below

# Before packaging a new version for distribution:
# 1. Increment VERSION and VERSION_CODE 
# 2. run this script: ./setVersion.sh

# Universal version - in Android, this is versionName
VERSION=1.2

# Only used in Android. Appended as minor version number if avaliable
VERSION_CODE=2

perl -pi -e "s/\sversion=\"\d+\.\d+\"\s/\ version=\"${VERSION}\"\ /" www/config.xml

perl -pi -e "s/return\s\'\d+\.\d+\.\d+\'\;/return\ \'${VERSION}\.${VERSION_CODE}\'\;/" www/js/services.js 

perl -pi -e "s/android\:versionCode=\"\d+\"/android\:versionCode=\"${VERSION_CODE}\"/" platforms/android/AndroidManifest.xml

perl -pi -e "s/\"version\"\:\ \"\d+\.\d+\.\d+\"/\"version\"\:\ \"${VERSION}\.${VERSION_CODE}\"/" chrome/app/manifest.json
