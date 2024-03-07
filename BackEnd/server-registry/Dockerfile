FROM eclipse-temurin:19-jdk-focal
EXPOSE 8761
ARG JAR_FILE=target/server-registry-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} server-registry.jar
ADD wait-for-it.sh wait-for-it.sh
RUN chmod +x /wait-for-it.sh
ENTRYPOINT ["java","-jar","/server-registry.jar"]