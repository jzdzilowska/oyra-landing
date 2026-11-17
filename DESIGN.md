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

Section-name labels omit the slash after their numbers. The glass navbar has no border or separator shadow; the demo button retains its own outline.

Navigation now links to dedicated Platform, About, and Contact pages, with an active-page indicator. Platform combines material categories and the software workflow; About describes Oyra’s approach without invented history or credentials. Contact has a general enquiry form, and all demo CTAs read “Request a demo”. Contact enquiries share the existing D1 request table with a contact marker; no email notification or scheduling integration has been added. The opening animation remains on the homepage only.

Internal page changes fade content out over 180 ms and in over 420 ms using client navigation. The header stays visible. Returning home through internal links skips the opening loader; direct homepage visits retain it. Modified clicks, external links, downloads, and section anchors retain their native behavior. Reduced-motion preferences remove the transition delay and animation.

The loading symbol is further reduced to 48 px on desktop and 40 px on mobile; its animation timing and the background fade are unchanged.

The homepage hero headline is slightly smaller: clamp(44px, 5.4vw, 82px) on desktop and clamp(30px, 7.8vw, 54px) on mobile, retaining its two-line composition and spacing.

Local hero trial: the headline, demo button, and supporting sentence are centered horizontally and vertically as a single group. The smaller headline uses clamp(40px, 4.8vw, 74px) on desktop and clamp(28px, 7.2vw, 50px) on mobile. Publishing is batched at the owner’s request.

Local image framing trial: hero photo enlarged to 135% height and shifted down (top -5%) on desktop; 125% height with top 0 on mobile. Architectural detail sits lower, exposing more of the upper wall above the centered text. Original photograph colors are retained.

Local hero refinement: 28 px rounding on the bottom corners. Centered content reads headline, supporting sentence, then demo button, with the existing stack spacing.

The rounded hero sits in a black frame so the bottom corner cutouts blend into the black introduction section.

Local refinement: bottom hero corners are concave 28 px cutouts against the black frame, rather than outward rounded corners. A subtle black gradient fades from the top to transparent at 42% of the hero; image colors remain unfiltered.

Correction: rounding belongs to the black introduction section below the hero. Its 28 px top corners overlap the photo by 28 px; the hero itself has square corners and no corner mask. Top vignette is retained.

Logo links return to the homepage from other pages and smoothly scroll to its top when already home. Current-page navigation links also return to the top; reduced motion uses an immediate scroll.

Navbar adjustment: desktop links stay right-aligned beside the demo action. Horizontal inset is clamp(20px, 3vw, 48px), reduced from 5.2%; links use 28 px gaps and no extra trailing margin. Mobile retains the logo/action layout with compact side spacing.

Latest direction restores 28 px rounded bottom corners to the hero itself. The black introduction below is square, with no overlap; black remains behind the hero’s rounded corners.

Page error review: restored the closer 135% desktop / 125% mobile hero crop and centered text. Shared Vinext browser modules now receive their public compile-time environment values through Vite’s parser, eliminating browser process/env errors during navigation and hot updates. Root HTML tolerates extension-added attributes without masking hydration checks in page content.

Homepage content revision: the product overview follows the hero immediately on black. Removed the repeated introduction and standalone material photo. The comparison shows illustrative quotation terms, lead times, minimum orders, sample status, and technical review, with schedule and approvals views. Three capability descriptions and a clearly labelled worked example replace the repeated onboarding steps. FAQ and final demo CTA use direct buyer-oriented copy. The chosen hero design and opening animation are retained.

Product evidence refinement: supplier comparisons include manufacturer and product references, quotation IDs and dates, thickness differences, and explicitly missing information. Expandable source records explain the origin of the displayed fields; all records remain labelled as demonstration data. Capability cards show small concrete output records. The worked material example now has five interactive stages—requirement, sources, differences, review, and decision—with a recorded reason for retaining the specified product. This is an illustrative scenario, not a completed client project. Tab groups support arrow keys, Home, and End. The hero supporting sentence uses “interior materials and finishes”, centered across two balanced lines in a 440 px measure. Hero composition, navbar, loader, and original image colors are unchanged.

Professional interaction refinement: replaced the static capability cards with an interactive project workspace. A vertical capability selector exposes a finish register, supplier-term inspection, and a local sample/document-review demonstration with a reset control and explicit preview-only status. The quotation comparison supports quantity-based material totals and a differences-only filter; the finish schedule reflects the quantity edits. Reduced explanatory copy and shortened the worked-example title to “A documented material decision”. Pure black/white surfaces, existing hero, navbar, and brand are retained; no history, client relationships, or credentials are implied.

About page founder section: added Julia Zdzilowska’s supplied portrait in its original colour, with a restrained rectangular layout, founder title, New York location, and a brief biography limited to her full-stack engineering background and role developing Oyra. The photo is optimized as a JPEG; the homepage remains product-led.

About story update: replaced the founder biography with the approved first-person company narrative. Removed the Founder heading and role label, retained Julia’s name, and expanded the portrait by using the full section width for the two-column composition. The section remains pure black with white text; the navbar switches to white over it.

Opening animation now runs once per browser tab session. Session storage retains the visit flag across reloads and full-page returns; an in-memory fallback handles unavailable storage. Entering through another page also counts as a visit. Existing internal page fades remain unchanged.
