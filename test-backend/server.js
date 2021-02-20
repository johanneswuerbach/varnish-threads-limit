const http = require('http')

const port = 3000

let calls = 0

const server = http.createServer((request, response) => {
  console.log(`Received request: ${request.url}, ${JSON.stringify(request.headers)}`)
  const cacheName = request.headers['cf-cache-name']
  if (cacheName) {
    response.setHeader('cf-cache-name', cacheName)
  }

  const forceError = request.headers['cf-force-error']
  if (forceError) {
    response.statusCode = 500
    response.statusMessage = "Internal Server Error"
    console.log("Sending 500 internal server error")
  }

  console.log(`Responding with: ${response.statusCode}, ${JSON.stringify(response.getHeaders)}`)
  console.log(`Call counter: ${calls + 1}`)

  const responseTimeout = request.headers['cf-response-timeout']
  if (responseTimeout) {
    console.log('Responding after', responseTimeout)
    setTimeout(() => {

      response.end(String(++calls))
    }, responseTimeout)
  } else {
    response.end(String(++calls))
  }
})

server.listen(port, async (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

process.on('SIGTERM', function() {
  console.log('Received SIGTERM')
  server.close()
})
