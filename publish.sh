#!/bin/bash
git checkout master
git pull
git checkout gh-pages
git merge master
git push
git checkout master

