#!/bin/bash
serve --ssl-cert /etc/letsencrypt/live/www.growino.app/fullchain.pem --ssl-key /etc/letsencrypt/live/www.growino.app/privkey.pem -s build

