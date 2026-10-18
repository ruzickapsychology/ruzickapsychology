# Sunlight across the paper

A soft botanical shadow beside the homepage location invitation moves with a
slow, uneven breeze. Three overlapping rhythms vary its direction, speed, and
amplitude without short mirrored loops or abrupt random jumps. Travel is limited
to 20px horizontally, 6px vertically, and 4.4 degrees of rotation. The window light
and shadow opacity stay steady. The SVG artboard includes room around every
leaf, and the light fades gently at the section edges to avoid visible cropping.

The decorative layer stops updating offscreen or in a hidden tab. Reduced-motion
visitors get a static composition. A small keyboard-accessible pause control
lets anyone freeze the shadow; resuming continues from the same position. There
are no new dependencies, CMS updates, or image requests.

## Earlier browser evidence

These captures predate the increased sway and edge fixes. No new media was
requested for that revision; review the current motion in the preview.

[28-second motion recording](./sunlight-motion.webm)

![Desktop](./sunlight-1440.jpg)
![Tablet](./sunlight-768.jpg)
![Mobile](./sunlight-375.jpg)

## Validation

Browser tests cover bounded movement, offscreen pause/resume, keyboard pause,
reduced motion, artwork clearance, edge fading, and the existing location link. See PR #23 for final full-suite
and performance results. All screenshot widths are checked for overflow.
