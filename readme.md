# encrypt / decrypt client
1. clone install and run `encrypt-decrypt` app
2. clone repo
3. navigate to directory
4. run `npm install`

## encrypts string and returns it
`node client.js rest-http encrypt "clear-string"`

## decrypts string and returns it
`node client.js rest-http decrypt "encrypted-string"`
 
## pushes string to RabbitMQ after it is encrypted
`node client.js json-rmq encrypt "clear-string"`
 
## pops oldest record off of RabbitMQ and decrypts the string
`node client.js json-rmq decrypt`

## you can also run as a bash script:
`chmod +x client.js`

`./client.js rest-http encrypt "clear-string"`
