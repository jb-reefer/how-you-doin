// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
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
	hub := newHub()
	go hub.run()
	http.Handle("/", http.FileServer(http.Dir("./build")))
	http.HandleFunc("/api/cpu", cpuController)
	http.HandleFunc("/api/ram", ramController)
	http.HandleFunc("/api/thinger", thingerController)
	// http.Handle("/api/limits/ram")
	// http.Handle("/api/limits/cpu")
	http.HandleFunc("/ws", wsController(hub))
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func wsController(hub *Hub) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	}
}

func cpuController(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, GetUsedCPUPercent())
}

func ramController(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, GetFreePercent())
}

func thingerController(w http.ResponseWriter, r *http.Request) {
	output := TestThinger()
	// TODO: check for -1, which means no ' '
	lastSpace := strings.LastIndex(output, " ")
	percentage := output[lastSpace+1:]
	fmt.Fprint(w, percentage)
}

// docker kill how-you-doin && docker rm how-you-doin && docker build . -t how-you-doin:latest && docker run -d  --name how-you-doin -p 8080:8080 how-you-doin:latest
