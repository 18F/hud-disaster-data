# set -x
# will run the server in the background, and will run pa11y against it.

RED=`echo -e '\033[0;31m'`
GREEN=`echo -e '\033[0;32m'`
NC=`echo -e '\033[0m'` # No Color

node index & 
node_id=$!
sleep 5 

./node_modules/.bin/pa11y -i notice 'http://localhost:3000' 
retCode=$?
if [[ $retCode = 0 ]]
then
  echo $GREEN 
  echo "==========================================="
  echo "==========================================="
  echo "=========  pa11y run SUCESSFUL ============"
  echo "==========================================="
  echo "==========================================="
  echo $NC
else
  echo $RED
  echo "==========================================="
  echo "==========================================="
  echo "==========  pa11y run FAILED =============="
  echo "==========================================="
  echo "==========================================="
  echo $NC
fi

kill -9 $node_id
