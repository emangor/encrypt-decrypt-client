#!/usr/bin/env node

const request = require('request');
const http = require('http');
const headerValues = {
    'User-Agent': 'application/json'
}
const domain = "http://localhost:3000";

/*
 * node client.js rest-http encrypt "clear-string" // uses REST HTTP
 * node client.js rest-http decrypt "encrypted-string" // uses REST HTTP
 * node client.js json-rmq encrypt "clear-string" // uses RabbitMQ
 * node client.js json-rmq decrypt // uses RabbitMQ
 * args 0 -> protocol
 * args 1 -> method
 * args 2 -> string
 */
let args = process.argv.slice(2);
let protocolMethod = `${args[0]}|${args[1]}`;
let string = `${args[2]}`

function mediator(protocolMethod, string){
    switch (protocolMethod){
        case 'rest-http|encrypt':
            Rest.encrypt(string);
            break;
        case 'rest-http|decrypt':
            Rest.decrypt(string);
            break;
        case 'json-rmq|encrypt':
            Rmq.encrypt(string);
            break;
        case 'json-rmq|decrypt':
            Rmq.decrypt(string);
            break;
        default:
            console.log(`Error: ${args[0]} ${args[1]} not recognized`);
    }
}

//REST HTTP
let Rest = {
    encrypt : function(string){
        request({
            method: 'POST',
            headers: headerValues,
            url: `${domain}/encrypt`,
            json: {'string': string}
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.string);
            } else if (error) {
                console.log(`Error: ${error}`);
            }
        });
    },
    decrypt : function(string){
        request({
            method: 'POST',
            headers: headerValues,
            url: `${domain}/decrypt`,
            json: {'string': string}
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.string);
            } else if (error) {
                console.log(`Error: ${error}`);
            }
        });
    }
}

//JSON-RMQ
let Rmq = {
    encrypt : function(string){
        request({
            method: 'POST',
            headers: headerValues,
            url: `${domain}/queue`,
            json: { "jsonrpc": "2.0", 
                    "method": "encrypt", 
                    "params": string, 
                    "id": null}
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.result);
            } else if (error) {
                console.log(`Error: ${error}`);
            }
        });
    },
    decrypt : function(string){
        request({
            method: 'POST',
            headers: headerValues,
            url: `${domain}/queue`,
            json: { "jsonrpc": "2.0", 
                    "method": "decrypt", 
                    "id": null}
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.result);
            } else if (error) {
                console.log(`Error: ${error}`);
            }
        });
    }
}

//route request:
mediator(protocolMethod, string);
