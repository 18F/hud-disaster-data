set -e
if [ "$TRAVIS_BRANCH" = 'master' ]
then
    export SPACE='staging'
else
    export SPACE='dev'
fi

export PATH=$HOME:$PATH
#travis_retry curl -L -o $HOME/cf.tgz "https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.15.0"
curl -L -o $HOME/cf.tgz "https://cli.run.pivotal.io/stable?release=linux64-binary&version=6.15.0"
tar xzvf $HOME/cf.tgz -C $HOME
cf install-plugin autopilot -f -r CF-Community

API="https://api.fr.cloud.gov"
ORG="hud-disaster-data"

if [ $SPACE = 'staging' ]; then
  NAME="hud-disaster-data-staging"
  MANIFEST="./cg-deploy/manifests/manifest-staging.yml"
  CF_USERNAME=$CF_USERNAME_STAGING
  CF_PASSWORD=$CF_PASSWORD_STAGING
elif [ $SPACE = 'dev' ]; then
  NAME="hud-disaster-data-dev"
  MANIFEST="./cg-deploy/manifests/manifest-dev.yml"
  CF_USERNAME=$CF_USERNAME_DEV
  CF_PASSWORD=$CF_PASSWORD_DEV
else
echo "Unknown space: $SPACE"
exit
fi

cf login -a $API -u $CF_USERNAME -p $CF_PASSWORD -o $ORG -s $SPACE
cf zero-downtime-push $NAME -f $MANIFEST
