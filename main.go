package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "HTTP service address")

func main() {
	log.Println("Starting CPU telemetry on port ", addr)
	flag.Parse()
	http.Handle("/", http.FileServer(http.Dir("./client/build")))
	http.HandleFunc("/api/cpu", cpuController)

	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func errorWriter(w http.ResponseWriter, err error) {
	w.WriteHeader(500)
	w.Write([]byte("Received error"))
	fmt.Fprint(w, "Server error: ", err.Error())
}

func cpuController(w http.ResponseWriter, r *http.Request) {
	percentageData, percentageError := GetUsedCPUPercent()
	if percentageError != nil {
		errorWriter(w, percentageError)
		return
	}
	cpuJSON, marshallError := json.Marshal(percentageData)
	if marshallError != nil {
		errorWriter(w, marshallError)
		return
	}

	fmt.Fprint(w, string(cpuJSON))
}
