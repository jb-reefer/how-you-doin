package main

import (
	"encoding/json"
	"fmt"
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

func formatMPStatError(err error) error {
	return fmt.Errorf("Got an error calling MPStat: %+v", err)
}

func getMPStatData() (MPStatData, error) {
	cmd := exec.Command("mpstat", "-P", "ON", "-o", "JSON")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return MPStatData{}, formatMPStatError(err)
	}
	if err := cmd.Start(); err != nil {
		return MPStatData{}, formatMPStatError(err)
	}
	var data MPStatData
	if err := json.NewDecoder(stdout).Decode(&data); err != nil {
		return MPStatData{}, fmt.Errorf("Got an error decoding MPStat json: %+v", err)
	}
	if err := cmd.Wait(); err != nil {
		return MPStatData{}, formatMPStatError(err)
	}

	return data, nil
}

// GetUsedCPUPercent Get average load percentage per CPU (linux only)
func GetUsedCPUPercent() ([]CPUStats, error) {
	mpstatData, err := getMPStatData()

	if err != nil {
		return nil, err
	}

	return mpstatData.Sysstat.Hosts[0].Statistics[0].CPULoad, nil
}
