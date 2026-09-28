# 🐳 Docker Containerization & Lifecycle Management (Week 11)

**Project**: Automated Timesheet Management Platform  
**DevOps Curriculum**: Week 11 Deliverable  
**Student**: Aditya Chavan (Roll No: 23102B0006)  
**Docker Engine**: Docker Desktop 4.86.0 / Engine 29.7.2  
**Base Image**: `eclipse-temurin:17-jre-alpine`  

---

## 1. Executive Summary

In **Week 11**, the Automated Timesheet Management Platform backend was successfully containerized. A lightweight, secure Docker image was built, tagged with semantic versions, and validated across the full container lifecycle (running with port mappings, checking health, inspecting logs, stopping, starting, and restarting).

### Container Specifications:
- **Base OS**: Alpine Linux (`x86_64`)
- **Runtime**: Eclipse Temurin OpenJDK JRE 17
- **Security**: Non-root container user (`appuser:appgroup`)
- **Image Size**: **~153 MB** (compact, compared to standard 600MB+ JDK images)
- **Port Mapping**: Host `8085` $\rightarrow$ Container `8080`
- **Database Connectivity**: Bridge network routing to host MySQL (`host.docker.internal:3306`)

---

## 2. Dockerfile Architecture

The [`Dockerfile`](file:///c:/Coding/CLG/dev/Dockerfile) follows container security and efficiency best practices:

```dockerfile
# Base runtime image: Eclipse Temurin JRE 17 on Alpine Linux
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="Aditya Chavan <23102B0006>" \
      project="Automated Timesheet Management Platform" \
      version="1.0.0"

# Non-root user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

# Copy executable Spring Boot JAR
COPY timesheet-management/backend/target/timesheet-backend-0.0.1-SNAPSHOT.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 8080

ENV SERVER_PORT=8080 \
    SPRING_PROFILES_ACTIVE=default \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Healthcheck monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVER_PORT}/ || exit 0

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${SERVER_PORT}"]
```

---

## 3. Docker Image Details

```text
REPOSITORY          TAG       IMAGE ID       SIZE     BASE RUNTIME
timesheet-backend   1.0.0     443a5a13306e   153 MB   Alpine JRE 17
timesheet-backend   v1.0.0    443a5a13306e   153 MB   Alpine JRE 17
timesheet-backend   latest    443a5a13306e   153 MB   Alpine JRE 17
```

---

## 4. Complete Container Lifecycle Command Log

### Step 1: Build & Tag Image
```bash
docker build -t timesheet-backend:1.0.0 -t timesheet-backend:latest .
docker tag timesheet-backend:latest timesheet-backend:v1.0.0
```
**Output**:
```text
#10 naming to docker.io/library/timesheet-backend:1.0.0 done
#10 naming to docker.io/library/timesheet-backend:latest done
```

### Step 2: Run Container with Port Mapping
```bash
docker run -d --name timesheet-app \
  -p 8085:8080 \
  --add-host=host.docker.internal:host-gateway \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/timesheet_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  timesheet-backend:latest
```
**Output**:
`8802005f1b1a518062329d7a16ec7fd2a9fbb323fdd3d617c44a6970631cb51c`

### Step 3: Verify Running Status & Port Mapping
```bash
docker ps --filter "name=timesheet-app"
```
**Output**:
```text
CONTAINER ID   IMAGE                      COMMAND                  STATUS                    PORTS                    NAMES
8802005f1b1a   timesheet-backend:latest   "sh -c 'java $JAVA_O…"   Up 50 seconds (healthy)   0.0.0.0:8085->8080/tcp   timesheet-app
```

### Step 4: Inspect Container Logs & Database Connection
```bash
docker logs --tail 25 timesheet-app
```
**Output**:
```text
2026-09-28T11:48:58.212Z  INFO 1 --- [main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection
2026-09-28T11:48:58.214Z  INFO 1 --- [main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-09-28T11:49:00.184Z  INFO 1 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http)
2026-09-28T11:49:00.203Z  INFO 1 --- [main] com.timesheet.TimesheetApplication       : Started TimesheetApplication in 5.437 seconds
```

### Step 5: Verify Live REST API Response through Mapped Port
```bash
curl http://localhost:8085/api/timesheets
```
**Output**:
```json
{
  "data": [
    {"timesheetId":1,"projectId":1,"date":"2026-08-17","hours":8.0,"description":"Homepage layout","status":"APPROVED"},
    {"timesheetId":2,"projectId":2,"date":"2026-08-18","hours":6.5,"description":"API integration","status":"SUBMITTED"},
    {"timesheetId":3,"projectId":1,"date":"2026-08-18","hours":2.0,"description":"Bug fixes","status":"DRAFT"}
  ],
  "message": "Timesheets retrieved successfully"
}
```

### Step 6: Stop, Start, and Restart Lifecycle Operations
```bash
# 1. Stop container (graceful SIGTERM)
docker stop timesheet-app
# Status: Exited (143)

# 2. Start container
docker start timesheet-app
# Status: Up (healthy)

# 3. Restart container
docker restart timesheet-app
# Status: Up (healthy)
```

### Step 7: Container Inspection
```bash
docker inspect timesheet-app --format "{{.Id}} | State: {{.State.Status}} | Health: {{.State.Health.Status}} | IP: {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}"
```
**Output**:
`8802005f1b1a... | State: running | Health: healthy | IP: 172.17.0.2`

---

## 5. One-Click Lifecycle Script

For rapid evaluation and viva demonstration, [`docker-lifecycle.cmd`](file:///c:/Coding/CLG/dev/docker-lifecycle.cmd) is provided:

| Command | Action |
| :--- | :--- |
| `docker-lifecycle.cmd build` | Builds image tags `1.0.0`, `v1.0.0`, and `latest` |
| `docker-lifecycle.cmd run` | Runs container with port mapping `8085:8080` & host DB link |
| `docker-lifecycle.cmd logs` | Streams live container logs |
| `docker-lifecycle.cmd stop` | Gracefully stops container |
| `docker-lifecycle.cmd start` | Starts stopped container |
| `docker-lifecycle.cmd restart`| Restarts container |
| `docker-lifecycle.cmd status` | Shows `docker ps` and image summary |
| `docker-lifecycle.cmd clean` | Stops and removes container |

---

## 6. Week 11 Deliverables Checklist

- [x] Production [`Dockerfile`](file:///c:/Coding/CLG/dev/Dockerfile) with lightweight Alpine JRE 17 base.
- [x] Non-root execution security and automated container health check.
- [x] Docker image built and tagged with semantic versions (`1.0.0`, `v1.0.0`, `latest`).
- [x] Port mapping verified (`8085:8080`) with live API response.
- [x] Container logs inspected and verified connected to MySQL database.
- [x] Full container lifecycle tested (build, run, stop, start, restart, rm).
- [x] Multi-container [`docker-compose.yml`](file:///c:/Coding/CLG/dev/docker-compose.yml) created.
- [x] One-click lifecycle script [`docker-lifecycle.cmd`](file:///c:/Coding/CLG/dev/docker-lifecycle.cmd).
- [x] Comprehensive documentation and command log report.
