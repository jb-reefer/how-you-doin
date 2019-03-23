package main

import (
	"log"
	"os/exec"

	"github.com/c9s/goprocinfo/linux"
)

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() []linux.CPUStat {
	stat, err := linux.ReadStat("/proc/stat")

	if err != nil {
		log.Fatal(err)
	}

	return stat.CPUStats
}

func TestThinger() string {
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
