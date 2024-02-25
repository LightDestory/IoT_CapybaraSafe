#ifndef DISPLAY_H_
#define DISPLAY_H_

#include "SSD1306.h"
#include "../pin_configuration.h"
#include "images.h"
#include <vector>

namespace DISPLAY_ESP {
    extern SSD1306 display_hw;
    const uint16_t BOOT_FIRST_PHASE_DURATION = 1000;
    const uint16_t BOOT_SECOND_PHASE_CLEAR_TIME = 250;
    extern uint8_t currentProgressBarPercentage;

    /*
     * This function is used to validate the target percentage of the progress bar.
     * @param targetPercentage: The target percentage of the progress bar.
     * @return: A validated target percentage.
     */
    uint8_t _progressBarValidation(uint8_t targetPercentage);

    /*
     * This function is used to show and update the progress bar of the boot animation.
     * It will update the progress bar only if the target percentage is valid.
     * @param targetPercentage: The target percentage of the progress bar.
     */
    void updateBootAnimationProgressBar(uint8_t targetPercentage);

    /*
     * This function is used to display the boot animation followed by the progress bar.
     */
    void showBootAnimation();

    /*
     * This function is used to draw a centered image with a title and a subtitle on the SSD1306 display.
     * @param image: The image to be drawn.
     * @param title: The title to be drawn on the bottom of the image.
     * @param subData: The subtitle to be drawn on the bottom of the title.
     */
    void drawCenteredImageTitleSubtitle(const unsigned char image[], const String &title, const String &subData = "");

    /*
     * This function is used to draw a centered title and a subtitle on the SSD1306 display.
     * @param title: The title to be drawn.
     * @param subData: The subtitle to be drawn on the bottom of the title.
     */
    void drawCenteredTitleSubtitle(const String &title, const String &subData = "");

    void blinkMessage(const String &message, uint16_t blinkTime);

    void blinkImageMessage(const unsigned char image[], const String &message, uint16_t blinkTime);
}
#endif
