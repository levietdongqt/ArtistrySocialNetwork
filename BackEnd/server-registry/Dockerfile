FROM openjdk:19
EXPOSE 8761
ARG JAR_FILE=target/server-registry-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} server-registry.jar
ENTRYPOINT ["java","-jar","/server-registry.jar"]