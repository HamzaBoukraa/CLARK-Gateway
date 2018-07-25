#!/bin/bash
PARENT_ECS_TASK_NAME=$ECS_TASK_NAME
BRANCH_NAME=$(echo "$CIRCLE_BRANCH" | sed "s|[/,]|-|g")
ECS_SERVICE_NAME="${ECS_SERVICE_NAME}-${BRANCH_NAME}"
ECS_SERVICE_NAME_JOINED=$(echo "$ECS_SERVICE_NAME" | sed "s|[-/,]||g")
ECS_SERVICE_NAME_LOWER=$(echo "$ECS_SERVICE_NAME" | sed -e 's/\(.*\)/\L\1/')


expr='.serviceArns[]|select(contains("'$ECS_SERVICE_NAME_JOINED'"))|split("/")|.[1]'
SNAME=$(aws ecs list-services --region $ECS_CLUSTER_REGION --output json --cluster $ECS_STAGING_CLUSTER_NAME | jq -r $expr)

if [ -n $SNAME]
then
    OLD_TASK_DEF=$(aws ecs describe-task-definition --region $ECS_CLUSTER_REGION --task-definition $ECS_SERVICE_NAME_LOWER --output json)
    # Create a new task definition for this build
    NEW_TASK_DEF=$(echo $OLD_TASK_DEF | jq --arg NDI $DOCKER_IMAGE '.taskDefinition.containerDefinitions[0].image=$NDI')
    FINAL_TASK=$(echo $NEW_TASK_DEF | jq '.taskDefinition|{family: .family, volumes: .volumes, containerDefinitions: .containerDefinitions}')
    # Update the service with the new task definition and desired count
    aws ecs register-task-definition  --region $ECS_CLUSTER_REGION --family $ECS_SERVICE_NAME_LOWER --cli-input-json "$(echo $FINAL_TASK)"
    aws ecs update-service  --region $ECS_CLUSTER_REGION --service $SNAME --task-definition $ECS_SERVICE_NAME_LOWER --cluster $ECS_CLUSTER_NAME
else
    # Create new template from service's default satging config
    aws s3 cp "s3://${S3_BUCKET_NAME}/services/${SERVICE_PATH}/service.yaml" ./service.yaml
    yq w ./service.yaml Resources.Service.Properties.LoadBalancers[0].ContainerName $ECS_SERVICE_NAME_LOWER
    yq w ./service.yaml Resources.TaskDefinition.Properties.Family $ECS_SERVICE_NAME_LOWER
    yq w ./service.yaml Resources.TaskDefinition.Properties.ContainerDefinitions[0].Name $ECS_SERVICE_NAME_LOWER
    yq w ./service.yaml Resources.TaskDefinition.Properties.ContainerDefinitions[0].Image $DOCKER_IMAGE
    # Upload to S3
    aws s3 cp ./service.yaml "s3://${S3_BUCKET_NAME}/services/${SERVICE_PATH}/${BRANCH_NAME}/service.yaml"

    # Add template to mater stack
    aws s3 cp "s3://${S3_BUCKET_NAME}/master.yaml" ./master.yaml
    # Add DNS Url
    yq w -i ./master.yaml Parameters."${ECS_SERVICE_NAME_JOINED}DnsUrl".Description "DNS Url for ${ECS_SERVICE_NAME_JOINED}"
    yq w -i ./master.yaml Parameters."${ECS_SERVICE_NAME_JOINED}DnsUrl".Type String
    yq w -i ./master.yaml Parameters."${ECS_SERVICE_NAME_JOINED}DnsUrl".Default "api-${ECS_SERVICE_NAME_LOWER}.clark.center"
    # Add ECS Resource
    PARENT_RESOURCE=$(yq r ./master.yaml Resources."${PARENT_ECS_TASK_NAME}")
    yq w -i ./master.yaml Resources."${ECS_SERVICE_NAME_JOINED}" $PARENT_RESOURCE
    yq w -i ./master.yaml Resources."${ECS_SERVICE_NAME_JOINED}".Properties.TemplateURL "s3://${S3_BUCKET_NAME}/services/${SERVICE_PATH}/${BRANCH_NAME}/service.yaml"
    PARENT_DNS=$(yq r ./master.yaml Resources."${PARENT_ECS_TASK_NAME}DNS")
    yq w -i ./master.yaml Resources."${ECS_SERVICE_NAME_JOINED}DNS" $PARENT_DNS
    yq w -i ./master.yaml Resources."${ECS_SERVICE_NAME_JOINED}DNS".Properties.Parameters.Name.Ref "${ECS_SERVICE_NAME_JOINED}DnsUrl"
    # Output DNS Url
    yq w -i ./master.yaml Outputs."${ECS_SERVICE_NAME_JOINED}Url".Description "The Url Endpoint for ${ECS_SERVICE_NAME_JOINED}"
    yq w -i ./master.yaml Outputs."${ECS_SERVICE_NAME_JOINED}Url".Value.Ref "${ECS_SERVICE_NAME_JOINED}DnsUrl"
    # Clean Up Multi-line Strings
    sed -i 's/|-//g' ./master.yaml
    # Uplod to S3
    aws s3 cp ./master.yaml "s3://${S3_BUCKET_NAME}/master.yaml"
    # Update CloudFormation Stack
    aws cloudformation update-stack --stack-name $CLOUD_FORMATION_STACK_NAME --template-url "s3://${S3_BUCKET_NAME}/master.yaml"
fi