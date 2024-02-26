#include "display.h"

namespace DISPLAY_ESP {

    SSD1306 display_hw = SSD1306(0x3c, PIN_CONFIGURATION::DISPLAY_SDA, PIN_CONFIGURATION::DISPLAY_SCL);
    uint8_t currentProgressBarPercentage = 0;

    void
    drawCenteredImageTitleSubtitle(const unsigned char image[], const String &title,
                                   const String &subData) {
        // Clear Display
        display_hw.clear();
        // Draw Image
        display_hw.drawXbm(48, 0, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE, image);
        // Draw Titles
        display_hw.setFont(ArialMT_Plain_16);
        display_hw.setTextAlignment(TEXT_ALIGN_CENTER);
        display_hw.drawString(64, 35, title);
        if (subData != "") {
            display_hw.setFont(ArialMT_Plain_10);
            display_hw.drawString(64, 51, subData);
        }
        display_hw.display();
    }

    void drawCenteredTitleSubtitle(const String &title, const String &subData) {
        // Clear Display
        display_hw.clear();
        // Draw Titles
        display_hw.setFont(ArialMT_Plain_24);
        display_hw.setTextAlignment(TEXT_ALIGN_CENTER);
        display_hw.drawString(64, 10, title);
        if (subData != "") {
            display_hw.setFont(ArialMT_Plain_16);
            display_hw.drawString(64, 40, subData);
        }
        display_hw.display();
    }

    void showBootAnimation() {
        currentProgressBarPercentage = 0;
        drawCenteredImageTitleSubtitle(DISPLAY_IMAGES::safety_hat, "SAFETY");
        // Wait for seconds
        delay(BOOT_FIRST_PHASE_DURATION);
        // Display Second Phase with progress bar
        // Clear Display
        display_hw.clear();
        updateBootAnimationProgressBar(currentProgressBarPercentage);
    }

    uint8_t _progressBarValidation(uint8_t targetPercentage) {
        if (targetPercentage < currentProgressBarPercentage) {
            return currentProgressBarPercentage;
        } else if (targetPercentage > 100) {
            return 100;
        } else if (targetPercentage < 0) {
            return 0;
        }
        return targetPercentage;
    }

    void updateBootAnimationProgressBar(uint8_t targetPercentage) {
        targetPercentage = _progressBarValidation(targetPercentage);
        for (uint8_t i = currentProgressBarPercentage; i <= targetPercentage; i++) {
            // Display Progress Bar
            display_hw.drawXbm(48, 0, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE,
                               DISPLAY_IMAGES::safety_hat);
            display_hw.drawProgressBar(4, 48, 120, 10, i);
            display_hw.setFont(ArialMT_Plain_10);
            display_hw.setTextAlignment(TEXT_ALIGN_CENTER);
            display_hw.drawString(64, 32, "Loading...");
            display_hw.display();
            delay(50);
        }
        currentProgressBarPercentage = targetPercentage;
        if (currentProgressBarPercentage == 100) {
            delay(BOOT_SECOND_PHASE_CLEAR_TIME);
            // Clear Display
            display_hw.clear();
            display_hw.display();
        }
    }

    void blinkMessage(const String &message, uint16_t blinkTime) {
        display_hw.clear();
        display_hw.display();
        delay(blinkTime / 3);
        display_hw.setFont(ArialMT_Plain_10);
        display_hw.setTextAlignment(TEXT_ALIGN_CENTER);
        display_hw.drawString(64, 16, message);
        display_hw.display();
        delay(blinkTime / 3);
        display_hw.clear();
        display_hw.display();
        delay(blinkTime / 3);
    }

    void
    blinkImageMessage(const unsigned char image[], const String &message, const String &subtitle, uint16_t blinkTime) {
        display_hw.clear();
        display_hw.display();
        delay(blinkTime / 3);
        display_hw.drawXbm(48, 0, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE, DISPLAY_IMAGES::DISPLAY_IMAGE_SIZE, image);
        display_hw.setFont(ArialMT_Plain_10);
        display_hw.setTextAlignment(TEXT_ALIGN_CENTER);
        display_hw.drawString(64, 35, message);
        if (subtitle != "") {
            display_hw.setFont(ArialMT_Plain_10);
            display_hw.drawString(64, 50, subtitle);
        }
        display_hw.display();
        delay(blinkTime / 3);
        display_hw.clear();
        display_hw.display();
        delay(blinkTime / 3);
    }
}