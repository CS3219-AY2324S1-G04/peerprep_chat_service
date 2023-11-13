#!/usr/bin/env bash

kubectl delete -f ./config_maps/message_broker_client.yaml
kubectl delete -f ./secrets/message_broker_client.yaml

kubectl delete -f ./config_maps/room_service_mq_client.yaml
kubectl delete -f ./secrets/room_service_mq_client.yaml

kubectl delete -f ./deployments/api.yaml
kubectl delete -f ./services/api.yaml
kubectl delete -f ./hpas/api.yaml
