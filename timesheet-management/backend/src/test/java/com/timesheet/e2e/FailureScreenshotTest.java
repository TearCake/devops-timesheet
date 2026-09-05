package com.timesheet.e2e;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Failure Screenshot Mechanism Validation")
class FailureScreenshotTest extends BaseSeleniumTest {

    @Test
    @DisplayName("Verify Failure Screenshot Utility Creates Valid PNG File")
    void testScreenshotCaptureUtility() {
        openApp();

        // Capture evidence screenshot using the screenshot mechanism
        Path screenshotPath = takeScreenshot("failure_mechanism_verification");

        assertTrue(screenshotPath != null, "Screenshot path should not be null");
        assertTrue(Files.exists(screenshotPath), "Screenshot file must physically exist in target/screenshots/");
        assertTrue(screenshotPath.toString().endsWith(".png"), "Screenshot file must have .png extension");
        assertTrue(screenshotPath.toFile().length() > 0, "Screenshot file size must be greater than 0 bytes");
    }
}
