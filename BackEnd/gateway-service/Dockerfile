FROM eclipse-temurin:19-jdk-focal
EXPOSE 8060
ARG JAR_FILE=target/gateway-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} gateway-service.jar
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD  ["java","-jar","/gateway-service.jar"]
