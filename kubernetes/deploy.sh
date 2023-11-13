#!/usr/bin/env bash

kubectl apply -f ./config_maps/message_broker_client.yaml
kubectl apply -f ./secrets/message_broker_client.yaml

kubectl apply -f ./config_maps/room_service_mq_client.yaml
kubectl apply -f ./secrets/room_service_mq_client.yaml

kubectl apply -f ./deployments/api.yaml
kubectl apply -f ./services/api.yaml
kubectl apply -f ./hpas/api.yaml
