#!/usr/bin/env bash

cd vendor-packages

ls | grep -v .zip | xargs rm -r

for i in *.zip; do unzip $i; done

cd ../

cordova platform add vendor-packages/tabris-android
cordova platform add vendor-packages/tabris-ios

