package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	// "os/exec"
)

type CPUStats struct {
	Cpu  string  `json:"cpu"`
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

func getMPStatData() []byte {
	// TODO: i think i need to use a buffer to avoid this issues
	// the problem is that the return is extremely long so i get bum output
	// out, outputErr := exec.Command("mpstat", "-P", "ON", "-o", "JSON", ">>", "output.txt").CombinedOutput()
	// log.Printf("tot %s", out)
	// if outputErr != nil {
	// 	log.Print("Got an error calling MPStat: ")
	// 	log.Fatal(outputErr)
	// }
	fileContents, err := ioutil.ReadFile("output.txt")
	log.Printf("tot %s", fileContents)
	if err != nil {
		log.Print("Got an error reading MPStat data: ")
		log.Fatal(err)
	}
	return fileContents
}

func mpstatError(err error) {
	log.Print(err)
	log.Fatal("Could not parse CPU data from MPStat")
}

func ParseMPStatJson(mpstatJSON []byte) (MPStatData, error) {
	var data MPStatData
	err := json.Unmarshal(mpstatJSON, &data)

	// This is a hack because of a flaw in sysstat's JSON output. I filed a ticket here: https://github.com/sysstat/sysstat/issues/216
	if err != nil {
		fixedJSON := bytes.Replace(mpstatJSON, []byte("}]"), []byte(""), 1)
		err = json.Unmarshal(fixedJSON, &data)
	}

	return data, err
}

// GetUsedCPUPercent Get percent of current cpu (linux only)
func GetUsedCPUPercent() []CPUStats {
	mpstatData := getMPStatData()
	mpstats, err := ParseMPStatJson(mpstatData)

	if err != nil {
		mpstatError(err)
	}

	log.Printf("%+v", mpstats)
	return mpstats.Sysstat.Hosts[0].Statistics[0].CPULoad
}
