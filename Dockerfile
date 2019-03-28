FROM golang:1.12.1-alpine3.9

WORKDIR ${GOPATH}/src/app
COPY . .

# Go build
RUN apk add --update nodejs nodejs-npm sysstat coreutils
RUN go build -o how-you-doin
# TODO: remove this hack
RUN stdbuf -i0 -o0 -e0 mpstat -o JSON -P ON >> output.txt

# TS build
RUN cd client && npm ci && npm run build

CMD [ "./how-you-doin" ]