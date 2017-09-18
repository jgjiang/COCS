#!/bin/bash
fuser -k 3000/tcp
fuser -k 5000/tcp

/usr/local/bin/redis-server /usr/local/etc/redis.conf

cd ./oj-server
npm install
nodemon server.js &
cd ../oj-client
npm install
ng build --watch
cd ../executor
pip install -r requirements.txt
python executor_server.py &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp






