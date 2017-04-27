set -e

export PATH=$HOME:$PATH
#travis_retry curl -L -o $HOME/cf.tgz "https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.15.0"
curl -L -o $HOME/cf.tgz "https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.15.0"
tar xzvf $HOME/cf.tgz -C $HOME
cf install-plugin autopilot -f -r CF-Community

API="https://api.fr.cloud.gov"
ORG="hud-disaster-data"
SPACE=$1

if [ $# -ne 1 ]; then
echo "Usage: deploy <space>"
exit
fi

if [ $SPACE = 'prod' ]; then
echo "YOU SHOULD NOT RUN THIS!!!"
exit 3
  ## NAME="hud-disaster-data"
  ## MANIFEST="./cg-deploy/manifests/manifest-prod.yml"
  ## CF_USERNAME=$CF_USERNAME_PROD
  ## CF_PASSWORD=$CF_PASSWORD_PROD
elif [ $SPACE = 'staging' ]; then
  NAME="hud-disaster-data-staging"
  MANIFEST="./cg-deploy/manifests/manifest-staging.yml"
  CF_USERNAME=$CF_USERNAME_DEV
  CF_PASSWORD=$CF_PASSWORD_DEV
else
echo "Unknown space: $SPACE"
exit
fi

cf login --a $API --u $CF_USERNAME --p $CF_PASSWORD --o $ORG -s $SPACE
cf zero-downtime-push $NAME -f $MANIFEST
