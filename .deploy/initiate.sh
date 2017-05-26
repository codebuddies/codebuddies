#!/bin/bash
set -e

# ### Configuration ###

DEPLOYMENT_TARGET="$1"

 if [[ -z $DEPLOYMENT_TARGET ]]; then
   echo "-- Must pass target arg >> ./deploy/initiate.sh <target> (either production or development) --"
   exit 1
 fi


 if [[ $DEPLOYMENT_TARGET == "production" ]]; then
   APP_NAME=cb-prod
 else
   APP_NAME=cb-stage
 fi

 SERVER=codeship@104.236.145.198
 APP_DIR=/var/www/$APP_NAME
 KEYFILE=
 REMOTE_SCRIPT_PATH=/tmp/deploy-myapp.sh


# ### Library ###
#
 function run()
 {
   echo "Running: $@"
   "$@"
 }


### Automation steps ###
if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

run meteor build --architecture os.linux.x86_64 --server-only ../new_package && mv ../new_package/*.tar.gz package.tar.gz

run scp $KEYARG package.tar.gz $SERVER:$APP_DIR/
run scp $KEYARG .deploy/work.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH $DEPLOYMENT_TARGET
rm package.tar.gz
echo "---- All done ----"
