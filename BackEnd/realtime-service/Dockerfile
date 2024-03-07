#FROM maven:3.8.4-openjdk-19 as build
#WORKDIR /app
#COPPY config-server /app/config-server


#FROM openjdk:19
FROM eclipse-temurin:19-jdk-focal
EXPOSE 8082
ARG JAR_FILE=target/realtime-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} realtime-service.jar
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD  ["java","-jar","/realtime-service.jar"]