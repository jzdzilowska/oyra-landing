# Oyra website

Architectural and editorial, guided by the six supplied references. Full-bleed imagery, an asymmetrical grid, large light sans serif headings, small sans serif labels using the navigation typeface, fine rules, and generous spacing. Final user direction: pure white (#FFFFFF) and pure black (#000000), with neutral gray secondary text and fine rules. Interface surfaces are white or black; no off-white backgrounds. No beige, blue, or colored accents. The material study is displayed in monochrome; the user-supplied hero retains its original colors. Copy is factual and concise; decorative manifesto copy has been removed.

The interactive product study is clearly illustrative. No real supplier quotations, customer logos, testimonials, traction, or guaranteed savings are invented.

All demo buttons open an accessible dialog. Requests are saved in the `demo_requests` D1 table. There is no calendar integration or automatic email notification yet. Success confirms receipt and explicitly says no time has been booked. No public endpoint lists requests. Future inbox notifications or scheduling should be configured before public launch.

Original hero and material-study imagery uses the built-in image generation tool. Assets live in `public/images`. Complete prompts and provenance are recorded in `public/images/asset-notes.txt`.

The hero uses the user-supplied Declan Sun Unsplash photograph, in `public/images/declan-sun-staircase.jpg`, showing curved timber walls and an illuminated stair. It is resized for web delivery with original colors retained. The previous Daniel Sessler photograph is retained in `public/images/architecture-hero.jpg`. The generated hero is retained as an unused alternative. Decorative periods are removed from the wordmarks and display headings.

The latest direction uses a compact transparent navigation overlay with white text. Desktop header is 72 pixels, mobile header 64 pixels, and the scrolled header 64 pixels. The hero has no image color filter.

Hero headline: “A new standard / for material sourcing”. The photograph is anchored at the bottom, cropping the upper wall to show more of the staircase and lower foreground, with separate desktop and mobile crops.

The hero audience eyebrow is removed. Small labels use the same Manrope typeface as navigation.

The hero bottom strip (product label and scroll link) is removed. The headline and demo button sit closer to the bottom of the photograph.

The first section below the hero uses pure black with white text. Desktop wheel scrolling has gentle easing (Lenis, lerp 0.12); touch scrolling stays native. Easing is disabled for reduced-motion preferences and paused while the demo dialog is open. Navigation anchors retain a header offset.

The agreed slab symbol and outlined Manrope OYRA wordmark are static in the navigation; the footer uses the same wordmark. A black opening screen displays only the white slab symbol building top/right-to-left, left/top-to-bottom, bottom/left-to-right, right/bottom-to-top, then holding until three seconds have elapsed. The page is inert and scrolling is paused during this screen. Reduced-motion preferences show the completed mark without animation. The scrolled navbar uses an 18 px backdrop blur and 4% white haze; text and logo adapt to light or dark sections.

Navbar identity is compact (22 px symbol and 76 px wordmark on desktop; 20 px and 69 px on mobile). The header remains fixed throughout; the glass layer and hero contrast gradient crossfade over 450 ms in either scroll direction, removing the previous abrupt position switch at the top.

The loading symbol is 72 px on desktop and 64 px on mobile. The black overlay begins fading after 2.3 seconds and fully reveals the page at 3 seconds, rather than cutting away.

The symbol build runs on a 2.6-second animation timeline (slightly faster), completing its four segments before the loading overlay fades; total opening-screen duration remains three seconds.

The hero content sits 64 px above the bottom of the image on desktop and mobile, reducing the previous 110 px gap.
