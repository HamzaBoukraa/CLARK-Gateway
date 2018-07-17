#!/bin/bash
expr='.serviceArns[]|select(contains("${ECS_SERVICE_NAME}"))|split("/")|.[1]'
SNAME=$(aws ecs list-services --output json --cluster $ECS_CLUSTER_NAME | jq -r $expr)

# Create a new task definition for this build
OLD_TASK_DEF=$(aws ecs describe-task-definition --task-definition $ECS_TASK_NAME --output json)
NEW_TASK_DEF=$(echo $OLD_TASK_DEF | jq --arg NDI $DOCKER_IMAGE '.taskDefinition.containerDefinitions[0].image=$NDI')
FINAL_TASK=$(echo $NEW_TASK_DEF | jq '.taskDefinition|{family: .family, volumes: .volumes, containerDefinitions: .containerDefinitions}')

# Update the service with the new task definition and desired count
aws ecs register-task-definition --family $ECS_TASK_NAME --cli-input-json "$(echo $FINAL_TASK)"
aws ecs update-service --service $SNAME --task-definition $ECS_TASK_NAME --cluster $ECS_CLUSTER_NAME