FROM openjdk:19
EXPOSE 8088
ARG JAR_FILE=target/config-server-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]