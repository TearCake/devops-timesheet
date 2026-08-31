@echo off
title Jenkins CI Server (Port 9090)
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo =======================================================
echo Starting Jenkins CI Server on http://localhost:9090
echo =======================================================

java -jar "%USERPROFILE%\jenkins\jenkins.war" --httpPort=9090
pause
