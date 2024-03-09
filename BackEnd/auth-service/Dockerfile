FROM eclipse-temurin:19-jdk-focal
EXPOSE 8083
ARG JAR_FILE=target/auth-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} auth-service.jar
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD  ["java","-jar","/auth-service.jar"]
