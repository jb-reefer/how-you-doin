package main

import (
	"encoding/json"
	"log"
	"os/exec"
)

type CPUStats struct {
	CPU  string  `json:"cpu"`
	Idle float64 `json:"idle"`
}

type MPStatData struct {
	Sysstat struct {
		Hosts []struct {
			Statistics []struct {
				CPULoad []CPUStats `json:"cpu-load"`
			}
		}
	}
}

func getMPStatData() (MPStatData, error) {
	cmd := exec.Command("mpstat", "-P", "ON", "-o", "JSON")
	stdout, outputErr := cmd.StdoutPipe()
	if outputErr != nil {
		log.Print("Got an error calling MPStat: ")
		log.Fatal(outputErr)
	}
	if err := cmd.Start(); err != nil {
		log.Fatal("1", err)
	}
	var data MPStatData
	if err := json.NewDecoder(stdout).Decode(&data); err != nil {
		log.Fatal("2", err)
	}
	if err := cmd.Wait(); err != nil {
		log.Fatal("3", err)
	}
	log.Printf("Decoded data %+v\n", data)
	// TODO: FIX THIS ERROR HANDLING ASAP!!
	return data, nil
}

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() ([]CPUStats, error) {
	mpstatData, err := getMPStatData()

	if err != nil {
		return nil, err
	}

	return mpstatData.Sysstat.Hosts[0].Statistics[0].CPULoad, nil
}
