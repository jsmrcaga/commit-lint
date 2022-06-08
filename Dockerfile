FROM node:18-alpine3.15

# Get all files from action
COPY . /

CMD ["node",  "src/index.js"]
