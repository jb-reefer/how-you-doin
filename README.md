# Overview

This is a simple application that checks CPU load on a Linux system, using the MPStat tool and a Golang server. Originally I was going to use a websocket to pump errors to the frontend, but the problem description explicitly says that this is frontend-focused, and that would ruin the fun of the websocket 😄. 

I used React on the frontend and [react-vis](http://uber.github.io/react-vis/documentation/welcome-to-react-vis) for graphing. I didn't use a state management system like Redux or the React Context API because this is fundamentally a very simple application, and those are overkill. I have used Redux a good bit for managing state for hundreds on on-screen components, this is definitely not that! 

### To Run

Instead of worrying about the environment we're shipping this in, I just used Docker. Plus, I developed this on macOS so the CPU information retrieval and MPStat logic don't work, and I didn't want to develop this for macOS because no one uses it as a server platform. 

To run: `docker build . -t how-you-doin:latest && docker run -d  --name how-you-doin -p 8080:8080 how-you-doin:latest`

To run go tests: `go test`

To run Storybook: `cd client && npm ci && npm run storybook`

<!-- TODO: flesh this out more! -->