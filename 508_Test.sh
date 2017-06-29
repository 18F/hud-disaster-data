set -x
# will run the server in the background, and will run pa11y against it.

node index & 
node_id=$!
sleep 5 

./node_modules/.bin/pa11y -i notice 'http://localhost:3000' && kill -9 $node_id
