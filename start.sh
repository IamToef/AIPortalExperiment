#!/bin/bash
ls -la /app
ls -la /app/server
ls -la /app/client
ls -la /client/dist
cd /app/apiServer && python main.py &
cd /app/server && node index.js 