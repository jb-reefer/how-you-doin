package main

import (
	"log"
	"os/exec"
	"strings"
)

func getMPStatData() string {
	cmd := exec.Command("mpstat")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		log.Fatal(err)
	}

	defer stdin.Close()

	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatal(err)
	}

	return string(out[:])
}

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() string {
	output := getMPStatData()
	// TODO: check for -1, which means no ' '
	lastSpace := strings.LastIndex(output, " ")
	percentage := output[lastSpace+1:]

	return percentage
}
