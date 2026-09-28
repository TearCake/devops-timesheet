# ========================================================================
# Automated Timesheet Management Platform - Docker Containerization
# Multi-stage / Production Dockerfile for Spring Boot Application
# ========================================================================

# Base runtime image: Eclipse Temurin JRE 17 on Alpine Linux (lightweight & secure)
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="Aditya Chavan <23102B0006>" \
      project="Automated Timesheet Management Platform" \
      version="1.0.0" \
      description="Production container image for Timesheet Spring Boot backend"

# Create application directory and non-root system user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

# Copy the packaged Spring Boot executable JAR
COPY timesheet-management/backend/target/timesheet-backend-0.0.1-SNAPSHOT.jar app.jar

# Grant ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root execution
USER appuser

# Expose default application port
EXPOSE 8080

# Container environment variables with configurable defaults
ENV SERVER_PORT=8080 \
    SPRING_PROFILES_ACTIVE=default \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Healthcheck definition to monitor container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVER_PORT}/ || exit 0

# Container execution command
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${SERVER_PORT}"]
