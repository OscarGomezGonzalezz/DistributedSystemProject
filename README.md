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


