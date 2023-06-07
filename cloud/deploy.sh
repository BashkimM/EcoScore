#!/bin/bash

echo "delete old pod" 
kubectl delete -f node-app.yml

echo "build new image" 

docker build -t fhkiel/ecoscore ./

echo "deploy new pod"
kubectl apply -f node-app.yml
