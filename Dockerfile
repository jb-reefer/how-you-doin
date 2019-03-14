FROM golang

WORKDIR ${GOPATH}/src/app
COPY . .

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
RUN dep ensure
RUN go build -o how-you-doin

CMD [ "./how-you-doin" ]