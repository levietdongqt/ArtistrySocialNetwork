FROM maven:3.8.4-openjdk-19 as build
WORKDIR /app
COPPY config-server /app/config-server


FROM openjdk:19
EXPOSE 8761
ARG JAR_FILE=target/config-server-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]