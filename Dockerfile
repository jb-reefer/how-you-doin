FROM golang:1.12.1-alpine3.9

WORKDIR ${GOPATH}/src/app
COPY . .

# Go build
RUN apk add --update nodejs nodejs-npm sysstat git
RUN wget https://raw.githubusercontent.com/golang/dep/master/install.sh 
RUN chmod +x install.sh && ./install.sh
RUN dep ensure
RUN go build -o how-you-doin

# TS build
RUN cd client && npm ci && npm run build

CMD [ "./how-you-doin" ]