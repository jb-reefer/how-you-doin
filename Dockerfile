FROM golang:1.12.1-alpine3.9

WORKDIR ${GOPATH}/src/app
COPY . .

# Go build
RUN apk add --update coreutils nodejs nodejs-npm sysstat 
RUN go build -o how-you-doin

# TS build
RUN cd client && npm ci && npm run build

CMD [ "stdbuf", "-i0", "-o0", "-e0", "./how-you-doin" ]