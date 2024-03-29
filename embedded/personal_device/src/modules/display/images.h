#ifndef DISPLAY_IMAGES_H_
#define DISPLAY_IMAGES_H_

namespace DISPLAY_IMAGES {

    const uint8_t DISPLAY_IMAGE_SIZE = 32;

    const unsigned char safety_hat[] PROGMEM = {
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x00, 0x00, 0xf0, 0x0f, 0x00,
            0x00, 0xf0, 0x0f, 0x00, 0x00, 0xf4, 0x2f, 0x00, 0x00, 0xf6, 0x6f, 0x00, 0x00, 0xe7, 0xe7, 0x00,
            0x80, 0xf7, 0xef, 0x01, 0xc0, 0xff, 0xff, 0x03, 0xe0, 0xff, 0xff, 0x07, 0xe0, 0xff, 0xff, 0x07,
            0xe0, 0xff, 0xff, 0x07, 0xf0, 0xff, 0xff, 0x0f, 0xfc, 0xff, 0xff, 0x3f, 0xfc, 0xff, 0xff, 0x3f,
            0xfc, 0xff, 0xff, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xe0, 0xff, 0xff, 0x07,
            0xf0, 0xff, 0xff, 0x0f, 0x3c, 0x00, 0x00, 0x3c, 0x3c, 0x00, 0x00, 0x3c, 0x3c, 0x00, 0x00, 0x3c,
            0x30, 0x80, 0x01, 0x0c, 0x30, 0xc0, 0x03, 0x0c, 0x70, 0xe0, 0x07, 0x0e, 0xe0, 0x7f, 0xfe, 0x07,
            0xc0, 0x3f, 0xfc, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    const unsigned char bluetooth[] PROGMEM = {
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0e, 0x00, 0x00,
            0x00, 0x1e, 0x00, 0x00, 0x00, 0x7e, 0x00, 0x00, 0x00, 0xfe, 0x00, 0x00, 0x0e, 0xee, 0x01, 0x04,
            0x3e, 0xce, 0x03, 0x1e, 0x7c, 0x8c, 0x0f, 0x1c, 0xf0, 0x0e, 0x4f, 0x1c, 0xe0, 0x0f, 0xef, 0x38,
            0xc0, 0xcf, 0xc3, 0x39, 0x80, 0xef, 0xc1, 0x31, 0x00, 0xff, 0xc0, 0x71, 0x00, 0x7e, 0x80, 0x31,
            0x00, 0x7e, 0xc0, 0x79, 0x00, 0xff, 0xc0, 0x31, 0x80, 0xef, 0xc3, 0x39, 0xe0, 0xcf, 0xe7, 0x39,
            0xf0, 0x0f, 0xcf, 0x38, 0x78, 0x0e, 0x4f, 0x1c, 0x3c, 0x8e, 0x07, 0x1c, 0x1e, 0xce, 0x03, 0x0e,
            0x0e, 0xee, 0x01, 0x04, 0x00, 0xfe, 0x00, 0x00, 0x00, 0x7e, 0x00, 0x00, 0x00, 0x1e, 0x00, 0x00,
            0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};

    const unsigned char error[] PROGMEM = {
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0xfc, 0x3f, 0x00, 0x00, 0x02, 0x40, 0x00, 0x00, 0xfd, 0xbf, 0x00, 0x00, 0x05, 0xa0, 0x00,
            0x80, 0x02, 0x40, 0x01, 0xc0, 0x03, 0xc0, 0x03, 0x40, 0x01, 0x80, 0x02, 0xa0, 0x30, 0x0c, 0x05,
            0xa0, 0x68, 0x16, 0x05, 0x50, 0xd8, 0x1b, 0x0a, 0x58, 0xb0, 0x0d, 0x1a, 0x28, 0x60, 0x06, 0x14,
            0x28, 0x60, 0x06, 0x14, 0x58, 0xb0, 0x0d, 0x1a, 0x50, 0xd8, 0x1b, 0x0a, 0xa0, 0x68, 0x16, 0x05,
            0xa0, 0x30, 0x0c, 0x05, 0x40, 0x01, 0x80, 0x02, 0xc0, 0x03, 0xc0, 0x03, 0x80, 0x02, 0x40, 0x01,
            0x00, 0x05, 0xa0, 0x00, 0x00, 0xfd, 0xbf, 0x00, 0x00, 0x02, 0x40, 0x00, 0x00, 0xfc, 0x3f, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    const unsigned char radar[] PROGMEM = {
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x04,
            0x30, 0x00, 0x00, 0x0c, 0x38, 0x00, 0x00, 0x1c, 0x18, 0x02, 0x40, 0x18, 0x1c, 0x03, 0xe0, 0x38,
            0x0c, 0x83, 0xc1, 0x30, 0x8c, 0xe1, 0x87, 0x31, 0x8c, 0x61, 0x86, 0x31, 0x8c, 0x31, 0x8c, 0x31,
            0x8c, 0x31, 0x8c, 0x31, 0x8c, 0x61, 0x86, 0x31, 0x8c, 0xe1, 0x87, 0x31, 0x0c, 0x83, 0xc1, 0x30,
            0x1c, 0x03, 0xe0, 0x38, 0x18, 0x02, 0x40, 0x18, 0x38, 0x00, 0x00, 0x1c, 0x30, 0x00, 0x00, 0x0c,
            0x20, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
}

#endif