#FROM maven:3.8.4-openjdk-19 as build
#WORKDIR /app
#COPPY config-server /app/config-server


#FROM openjdk:19
FROM eclipse-temurin:19-jdk-focal
EXPOSE 8088
ARG JAR_FILE=target/server-config-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} server-config.jar
CMD  ["java","-jar","/server-config.jar"]