package main

import "testing"

func TestSimpleParsing(t *testing.T) {
	data := `{"sysstat" : {"hosts": [{"statistics": [{"cpu": "all","idle": 95.38},{"cpu": "0", "idle": 95.43},{"cpu": "1","idle": 95.33}]}]}}`

	output, err := ParseMPStatJson([]byte(data))
	if err != nil {
		t.Error("Got an error parsing simple json!", err)
	}
	if len(output.Sysstat.Hosts[0].Statistics) == 0 {
		t.Error("Did not find any data!", output.Sysstat.Hosts[0].Statistics)
	}

	if len(output.Sysstat.Hosts[0].Statistics) != 3 {
		t.Error("Did not find correct data!", output.Sysstat.Hosts[0].Statistics)
	}
}

func TestRealParsing(t *testing.T) {
	data := `{
  "sysstat": {
    "hosts": [{
      "nodename": "94a66b993c0e",
      "sysname": "Linux",
      "release": "4.9.125-linuxkit",
      "machine": "x86_64",
      "number-of-cpus": 2,
      "date": "03/26/19",
      "statistics": [{
          "cpu": "all",
          "usr": 2.69,
          "nice": 0.00,
          "sys": 1.55,
          "iowait": 0.21,
          "irq": 0.00,
          "soft": 0.16,
          "steal": 0.00,
          "guest": 0.00,
          "gnice": 0.00,
          "idle": 95.38
        },
        {
          "cpu": "0",
          "usr": 2.63,
          "nice": 0.00,
          "sys": 1.53,
          "iowait": 0.18,
          "irq": 0.00,
          "soft": 0.23,
          "steal": 0.00,
          "guest": 0.00,
          "gnice": 0.00,
          "idle": 95.43
        },
        {
          "cpu": "1",
          "usr": 2.76,
          "nice": 0.00,
          "sys": 1.58,
          "iowait": 0.24,
          "irq": 0.00,
          "soft": 0.09,
          "steal": 0.00,
          "guest": 0.00,
          "gnice": 0.00,
          "idle": 95.33
        }
      ]
    }]
  }
}`

	output, err := ParseMPStatJson([]byte(data))
	if err != nil {
		t.Error("Got an error parsing simple json!", err)
	}
	if len(output.Sysstat.Hosts[0].Statistics) == 0 {
		t.Error("Did not find any data!", output.Sysstat.Hosts[0].Statistics)
	}

	if len(output.Sysstat.Hosts[0].Statistics) != 3 {
		t.Error("Did not find correct data!", output.Sysstat.Hosts[0].Statistics)
	}

}
