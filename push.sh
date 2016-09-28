#!/bin/sh
# this assumes you created the openshift directory in your home directory
# modify the script if this is not the case
 
meteor build prod
cp prod/cb-v2-scratch.tar.gz ~/openshift
rm prod/cb-v2-scratch.tar.gz
cd ~/openshift
tar -xvf cb-v2-scratch.tar.gz -s '/^bundle//'
rm cb-v2-scratch.tar.gz
git add .
git commit -am "a change"
git push
