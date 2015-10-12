#!/usr/bin/env bash

cd vendor-packages

unzip *.zip

cd ../

cordova platform add vendor-packages/tabris-android
cordova platform add vendor-packages/tabris-ios

