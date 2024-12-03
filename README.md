##### DESCRIPTION #####
I have created a REST Service for HTTP operations(testable with POSTMAN), besides a Grpc one(testeable with POSTMAN too). You can find attached the diagram of the project

##### DOCKER COMPOSE LOGIC #####

docker-compose up --build -d

##### STACK LOGIC #####

docker login

docker build -t oscargomezgonzalezz/order-service:1.1 ./orderservice
docker build -t oscargomezgonzalezz/confirmation-service:1.1 ./confirmation-service
docker build -t oscargomezgonzalezz/confirmation-grpc-service:1.1 ./confirmation-service

#We updload the created images to dockerHub
docker push oscargomezgonzalezz/order-service:1.1
docker push oscargomezgonzalezz/confirmation-service:1.1
docker push oscargomezgonzalezz/confirmation-grpc-service:1.1

#If I were a third user, I had to do a pull to these created images

#Finally, we deploy with docker stack
docker stack deploy -c ./stack.yml <stack_name>


