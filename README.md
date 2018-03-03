# hydra-sample

A light-weight library for building distributed applications such as Microservices.  
[Hydra Github](https://github.com/flywheelsports/hydra)  

This is a proof of concept (PoC) to see how Hydra works and what it offers.  

## Run it

    $ docker-compose up --build

## What is going on

This example includes several components which are working together.  

### consumer

Consumes arriving messages and log them.

### cronjob

Runs every minutes and send a message to the worker.

### server

Express application with two routes `/` and `/action`, every request sends two messages, one to the consumer the other to the worker.  

### worker

There are two workers running to share the work, they are doing some data processing with the arriving messages.  

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give feedback on this repo.  
