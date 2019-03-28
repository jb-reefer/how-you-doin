package main

import (
	"testing"
)

func TestSimpleParsing(t *testing.T) {
	data := `{
  "sysstat": {
    "hosts": [{
      "statistics": [{
        "cpu-load": [{
          "cpu": "all",
          "idle": 95.38
        }, {
          "cpu": "0",
          "idle": 95.43
        }, {
          "cpu": "1",
          "idle": 95.33
        }]
      }]
    }]
  }
}`

	output, err := ParseMPStatJson([]byte(data))
	if err != nil {
		t.Error("Got an error parsing simple json!", err)
	}
	if len(output.Sysstat.Hosts[0].Statistics[0].CPULoad) == 0 {
		t.Error("Did not find any data!", output.Sysstat.Hosts[0].Statistics)
	}

	if len(output.Sysstat.Hosts[0].Statistics[0].CPULoad) != 3 {
		t.Error("Did not find correct data!", output.Sysstat.Hosts[0].Statistics)
	}
}

func TestRealParsing(t *testing.T) {
	data := `{"sysstat": {
        "hosts": [
                {
                        "nodename": "9b6d8d770ce8",
                        "sysname": "Linux",
                        "release": "4.9.125-linuxkit",
                        "machine": "x86_64",
                        "number-of-cpus": 2,
                        "date": "03/28/19",
                        "statistics": [
                                {
                                        "timestamp": "21:36:09",
                                        "cpu-load": [
                                                {"cpu": "all", "usr": 2.54, "nice": 0.00, "sys": 1.65, "iowait": 0.21, "irq": 0.00, "soft": 0.15, "steal": 0.00, "guest": 0.00, "gnice": 0.00, "idle": 95.46},
                                                {"cpu": "0", "usr": 2.49, "nice": 0.00, "sys": 1.65, "iowait": 0.18, "irq": 0.00, "soft": 0.22, "steal": 0.00, "guest": 0.00, "gnice": 0.00, "idle": 95.46},
                                                {"cpu": "1", "usr": 2.58, "nice": 0.00, "sys": 1.64, "iowait": 0.23, "irq": 0.00, "soft": 0.09, "steal": 0.00, "guest": 0.00, "gnice": 0.00, "idle": 95.45}
                                        ]
                                }
                        ]
                }
        ]
}}`

	output, err := ParseMPStatJson([]byte(data))
	if err != nil {
		t.Error("Got an error parsing simple json!", err)
	}
	if len(output.Sysstat.Hosts[0].Statistics[0].CPULoad) == 0 {
		t.Error("Did not find any data!", output.Sysstat.Hosts[0].Statistics)
	}

	if len(output.Sysstat.Hosts[0].Statistics[0].CPULoad) != 3 {
		t.Error("Did not find correct data!", output.Sysstat.Hosts[0].Statistics)
	}

}
