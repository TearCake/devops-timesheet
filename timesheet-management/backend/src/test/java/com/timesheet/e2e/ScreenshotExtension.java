package com.timesheet.e2e;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * JUnit 5 Extension that automatically captures a screenshot whenever
 * an automated Selenium test fails.
 */
public class ScreenshotExtension implements TestWatcher {

    public static final String SCREENSHOT_DIR = "target/screenshots";

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        Object testInstance = context.getRequiredTestInstance();
        if (testInstance instanceof BaseSeleniumTest) {
            WebDriver driver = ((BaseSeleniumTest) testInstance).getDriver();
            if (driver != null) {
                captureScreenshot(driver, context.getRequiredTestMethod().getName() + "_FAILED");
            }
        }
    }

    /**
     * Helper to capture a named screenshot at any time (e.g. for evidence or failure).
     */
    public static Path captureScreenshot(WebDriver driver, String label) {
        if (driver instanceof TakesScreenshot) {
            try {
                Path dir = Paths.get(SCREENSHOT_DIR);
                if (!Files.exists(dir)) {
                    Files.createDirectories(dir);
                }
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String sanitized = label.replaceAll("[^a-zA-Z0-9_-]", "_");
                Path destination = dir.resolve(sanitized + "_" + timestamp + ".png");

                File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                Files.copy(src.toPath(), destination);
                System.out.println("📸 [SCREENSHOT CAPTURED]: " + destination.toAbsolutePath());
                return destination;
            } catch (IOException e) {
                System.err.println("❌ Failed to save screenshot: " + e.getMessage());
            }
        }
        return null;
    }
}
