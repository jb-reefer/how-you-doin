package main

import (
	"errors"
	"log"
	"os/exec"
	"strconv"
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

func mpstatError(err error) {
	log.Print(err)
	log.Fatal("Could not parse CPU data from MPStat")
}

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() float64 {
	mpstatData := getMPStatData()
	lastSpace := strings.LastIndex(mpstatData, " ")

	if lastSpace == -1 {
		mpstatError(errors.New("Could not find CPU percentage"))
	}

	idlePercentage, err := strconv.ParseFloat(mpstatData[lastSpace+1:lastSpace+6], 32)

	if err != nil {
		mpstatError(err)
	}

	return 100.00 - idlePercentage
}
