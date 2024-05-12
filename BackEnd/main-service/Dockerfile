FROM eclipse-temurin:19-jdk-focal
EXPOSE 8061
ARG JAR_FILE=target/main-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} main-service.jar
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD  ["java","-jar","/main-service.jar"]
