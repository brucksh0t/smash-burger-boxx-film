# The Smashburger Boxx: film edition (concept) · credits and sources
Unofficial concept preview made as a sales demo. Not affiliated with or endorsed by The Smashburger Boxx, 93 Ten Broeck Ave, Hudson, NY 12534.

## Photos: all real, none stock, nothing generated
Google Maps uploaders were read from each photo's contributor link on the listing, Oct 23, 2026.
| File | Shows | Source | Uploader |
|---|---|---|---|
| img/hero-* (gm g4, 1600x2133) | Container stand, striped awning, mascots | Google Maps listing photo | leslie Flynn (maps/contrib/111722903418358369174) |
| img/box-* (gm g6, 1600x2133) | Boxed burgers, fries, shake | Google Maps listing photo | leslie Flynn |
| img/tables-* (gm g7, 1600x2133) | Red picnic tables and umbrellas | Google Maps listing photo | leslie Flynn |
| img/tray-* (gm g2, 1600x2133) | Slider tray with fries | Google Maps listing photo | The Smashburger Boxx (owner, maps/contrib/107892740863840730583) |
| media/stand.* (gm g1, 1600x2133) | Stand, wider view | Google Maps listing photo | The Smashburger Boxx (owner) |
| media/fries.* (gm g5, 1600x1200) | Fries bucket and soda | Google Maps listing photo | The Smashburger Boxx (owner) |
| img/menu-board.* (gm g8, 1024x1536) | Menu board | Google Maps listing photo | The Smashburger Boxx (owner) |
| img/ig-* (1080x1080) | Handheld burgers at the stand | Instagram @smashburgerboxx public posts: ig-window Da9L8MaRBmt, ig-sign DbbTY-qx9Zy, ig-mural DcTwtCWRuvM, ig-stack Dcjhw5ZRMCr (ig-awning DdZYYWyxy2n was unused and removed) | The Smashburger Boxx |
| img/favicon.png (64x64) | Red awning-and-box glyph | Flat icon drawn for this demo; no photo source | Web Builder |
Visitor photos (leslie Flynn) are shown with credit for the concept demo only. Ask before any commercial reuse.

## How the motion is made (no generation, no upscaling)
- The scroll films are drawn on a canvas straight from the 1600x2133 photos. Each camera move runs from the full frame to a 1080x1440 window, and the stage is capped at 1080x1440 device px, so nothing is shown above 1.0x. Posters are 1080x1440.
- The loops (H.264 + WebM) are rendered with crop windows that are always at least as large as the output.
- GenerateVideo wasn't used: its 720p maximum would need upscaling, which the no-upscale rule forbids.

## Facts (Sept 26, 2026, from the original concept's CREDITS)
Menu and prices are from the Google Maps menu board. Hours are from the @smashburgerboxx Instagram bio and Google (Oct 23, 2026): Thu–Sun 2–8 PM, Mon–Wed closed (seasonal). Rating 4.7 (32 reviews) on Google Maps, checked Oct 23, 2026. History is from Trixie's List (Jan 24, 2025) and The Soft Spot, Issue 36 (Jul 3, 2025). The quote is from an @smashburgerboxx caption.

## Code and fonts
GSAP 3.12.5 + ScrollTrigger (self-hosted, GreenSock standard license). Archivo + Instrument Serif (self-hosted latin subsets from Google Fonts, SIL OFL 1.1).
