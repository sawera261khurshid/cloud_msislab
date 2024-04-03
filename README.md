
##########Create a MQTT DOcker
docker run -d --name mqtt_sf -v /home/ubuntu/mqtt_configs/no_auth_websocket.conf:/mosquitto/config/mosquitto.conf -p 1883:1883 -p 9001:9001 eclipse-mosquitto

########## Check the created docker is working fine
mosquitto_sub -h 43.202.141.234 -t 'smartfactory/message/mold-0001/#'

##### If docker is stop please restart
docker restart mqtt_sf

#### Ifd error ocure like
Error response from daemon: Cannot restart container fa1: driver failed programming external connectivity on endpoint mqtt_sf 
(91ad331f9de5c090edc30da50ed62f8bb5f868944ce46c293eb8591371f75f0d): 
Error starting userland proxy: listen tcp4 0.0.0.0:1883: bind: address already in use


##### please get the port number and kill the process and then rtestart the docker
sudo lsof -t -i:1883
kill 1883
