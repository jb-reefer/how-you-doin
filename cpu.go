package main

import (
	"encoding/json"
	"log"
	"os/exec"
)

type CPUStats struct {
	Cpu  string  `json:"cpu"`
	Idle float64 `json:"idle"`
}

type MPStatData struct {
	Sysstat struct {
		Hosts []struct {
			Statistics []CPUStats
		}
	}
}

func getMPStatData() []byte {
	cmd := exec.Command("mpstat", " -P ON", "-o JSON")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		log.Fatal(err)
	}

	defer stdin.Close()

	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatal(err)
	}

	return out
}

func mpstatError(err error) {
	log.Print(err)
	log.Fatal("Could not parse CPU data from MPStat")
}

func ParseMPStatJson(mpstatJson []byte) (MPStatData, error) {
	var data MPStatData
	err := json.Unmarshal(mpstatJson, &data)

	if err != nil {
		return data, err
	}

	return data, nil
}

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() []CPUStats {
	mpstatData := getMPStatData()
	mpstats, err := ParseMPStatJson(mpstatData)

	if err != nil {
		log.Fatal(err)
	}

	return mpstats.Sysstat.Hosts[0].Statistics
}
