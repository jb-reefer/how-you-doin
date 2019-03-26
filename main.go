// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "home.html")
	http.Handle("/", http.FileServer(http.Dir("./static")))
}

func main() {
	flag.Parse()
	http.Handle("/", http.FileServer(http.Dir("./client/build")))
	http.HandleFunc("/api/cpu", cpuController)

	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func cpuController(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, GetUsedCPUPercent())
}

// docker kill how-you-doin && docker rm how-you-doin && docker build . -t how-you-doin:latest && docker run -d  --name how-you-doin -p 8080:8080 how-you-doin:latest
