package com.timesheet.e2e;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;

/**
 * Base class for Selenium WebDriver E2E tests.
 * Automatically manages WebDriver lifecycle, embedded UI test server,
 * and failure screenshot capture.
 */
@ExtendWith(ScreenshotExtension.class)
public abstract class BaseSeleniumTest {

    protected WebDriver driver;
    private static HttpServer localServer;
    private static int serverPort;

    @BeforeAll
    public static void startLocalServer() throws IOException {
        // Start embedded HTTP server on ephemeral port to serve test UI fixture
        localServer = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        localServer.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                InputStream is = getClass().getResourceAsStream("/static/timesheet-app.html");
                if (is == null) {
                    byte[] notFound = "Fixture not found".getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(404, notFound.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(notFound);
                    }
                    return;
                }
                byte[] bytes = is.readAllBytes();
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            }
        });
        localServer.setExecutor(null);
        localServer.start();
        serverPort = localServer.getAddress().getPort();
        System.out.println("🌐 [E2E Server] Embedded test UI server started at: " + getBaseUrl());
    }

    @AfterAll
    public static void stopLocalServer() {
        if (localServer != null) {
            localServer.stop(0);
            System.out.println("🛑 [E2E Server] Embedded test UI server stopped.");
        }
    }

    @BeforeEach
    public void setupDriver() {
        boolean headless = Boolean.parseBoolean(System.getProperty("headless", "true"));

        try {
            ChromeOptions chromeOptions = new ChromeOptions();
            if (headless) {
                chromeOptions.addArguments("--headless=new");
            }
            chromeOptions.addArguments("--no-sandbox");
            chromeOptions.addArguments("--disable-dev-shm-usage");
            chromeOptions.addArguments("--remote-allow-origins=*");
            chromeOptions.addArguments("--window-size=1920,1080");

            driver = new ChromeDriver(chromeOptions);
        } catch (Exception e) {
            System.out.println("⚠️ Chrome initialization fallback to Microsoft Edge: " + e.getMessage());
            EdgeOptions edgeOptions = new EdgeOptions();
            if (headless) {
                edgeOptions.addArguments("--headless=new");
            }
            edgeOptions.addArguments("--no-sandbox");
            edgeOptions.addArguments("--disable-dev-shm-usage");
            edgeOptions.addArguments("--remote-allow-origins=*");
            edgeOptions.addArguments("--window-size=1920,1080");

            driver = new EdgeDriver(edgeOptions);
        }

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(15));
    }

    @AfterEach
    public void teardownDriver() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception ignored) {
            }
        }
    }

    public WebDriver getDriver() {
        return driver;
    }

    public static String getBaseUrl() {
        String overrideUrl = System.getProperty("timesheet.test.url");
        if (overrideUrl != null && !overrideUrl.isBlank()) {
            return overrideUrl;
        }
        return "http://127.0.0.1:" + serverPort + "/";
    }

    public void openApp() {
        driver.get(getBaseUrl());
    }

    public Path takeScreenshot(String label) {
        return ScreenshotExtension.captureScreenshot(driver, label);
    }
}
