# How Canva does video: a business analysis for Akita

Researched 2026-09-25. Canva changes its product and prices often, so check anything load-bearing against the linked page before you rely on it.

**Method and source labels.** Claims link to their source inline. Unlabelled claims come from primary sources: canva.com help center, pricing, product and newsroom pages; TikTok for Business help; and the Meta Ads Guide. Claims from news sites or analyst blogs are marked **[secondary]**. canva.com returned HTTP 403 to direct fetches, so its pages were read through a text-reader proxy (r.jina.ai). The content is Canva's own. The Meta Ads Guide pages loaded in a localized version and were read with `?locale=en_US`. Newsroom posts on canva.com mostly show no publication date. Where a date matters, it comes from a dated secondary report, marked as such. Sections 6, "Implications for Akita" and the MVP table are **assessment, not fact**.

---

## TL;DR (ranked)

1. **Canva has moved from scenes to a multi-track timeline.** Video started as "pages as scenes", a single-layer timeline Canva chose on purpose because multi-layer timelines are "hard to understand" ([Video Suite launch](https://www.canva.com/newsroom/news/introducing-canva-video-suite/)). It now describes itself as having moved "from a page-based tool to a full video editor". The new editor has a main track, overlay tracks and audio tracks. This multi-track editor (beta) is still rolling out gradually, and users can switch back to the old one ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)). **For Akita:** you can ship scenes first, but design the data model so it can grow into tracks.
2. **Video creation itself is free. Canva charges for quality, content, AI and distribution.** Free users can export MP4s up to 1080p and 30 minutes. Pro and above can export up to 4K and 2 hours ([Download as video](https://www.canva.com/help/download-as-video/)). The paywall sits on premium stock and audio (watermarked until bought), background removal, Magic Switch resize, scheduling, and the larger AI allowances ([Pricing](https://www.canva.com/pricing/)).
3. **Licensed media is the expensive, fragile part.** Canva's "Popular Music" cannot be used in ads or any commercial content. It is available only in a short list of countries and only on approved social platforms ([Popular Music License](https://www.canva.com/policies/popular-music-license/)). TikTok requires businesses to use its pre-cleared Commercial Music Library ([TikTok CML](https://ads.tiktok.com/help/article/commercial-music-library?lang=en)). **For Akita:** for an *ads* product, ship royalty-free music only and treat user uploads as the user's legal responsibility.
4. **Distribution is now about paid ads, not only organic posting.** Canva Grow 2.0 publishes ads directly to Meta, TikTok and LinkedIn, then pulls performance data back and auto-generates "refresh" variants ([Grow 2.0](https://www.canva.com/newsroom/news/canva-grow/)). The share menu includes "Meta Ads" and "TikTok Ads" ([Share](https://www.canva.com/help/share-on-socials-and-messaging/)). The acquisitions of MagicBrief (2025) and MangoAI (2026) back this direction.
5. **AI features are metered.** There is a shared monthly allowance across Standard, Premium and Ultra tiers. Free gets up to 20 Premium uses, Pro up to 200 Premium or 20 Ultra, and Business up to 400 Premium or 40 Ultra. Text-to-video (Veo 3) is an Ultra tool ([AI access](https://www.canva.com/help/ai-access/), [Pricing](https://www.canva.com/pricing/)). Metering is how Canva makes GPU-heavy features pay for themselves.
6. **Ad specs converge on one export target.** A **9:16, H.264 + AAC, MP4, 1080×1920 or larger** export fits TikTok In-Feed, Instagram and Facebook Reels, and Stories. Add 1:1 and 4:5 presets for feeds. Draw safe-zone overlays in the editor: Meta says keep about 14% top, 35% bottom and 6% sides clear ([Meta IG Reels](https://www.facebook.com/business/ads-guide/update/video/instagram-reels)).
7. **Server-side rendering is Akita's biggest cost and UX factor (assessment).** Every export uses render compute, and users have to wait in a queue. Gating 4K, long durations and priority queue access behind the paid plan follows Canva's own pattern.

---

## 1. Product scope

### Facts (cited)

**Editing model: from scenes to a timeline**
- The 2021 Video Suite used "scene-based editing". The single-layer timeline "resembles a collection of slide thumbnails". Canva chose this because "the multi-layer timeline that most video tools use can be hard to understand for those without experience". It also said it built technology to make "video rendering consistent" across browsers, including mobile ([Introducing Canva Video Suite](https://www.canva.com/newsroom/news/introducing-canva-video-suite/)).
- The current help center says "Canva Video has transformed from a page-based tool to a full video editor". It has a multi-track timeline, direct clip trim and split, audio waveforms and zoomable trimming. There is a **main track**, where clips "play one after another with no gaps"; **upper tracks** for overlays, which "can overlap"; and **audio tracks**. The feature is "rolling out gradually", and users can turn off "Use new multi-track video editor (beta)" ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)).
- The old model still exists. "Page Mode" has no element-timing controls and no transitions. In video templates, "scenes will follow the longest clip on a page". Presentations and social posts use "slide duration" and "Edit as video" ([Trim videos and change scene duration](https://www.canva.com/help/trim-videos/)).
- Element timing (when an element appears) is separate from animation intro/outro duration, which is set in the Animate panel with Slow, Medium or Fast presets or exact durations ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)).
- A dated review says the timeline rebuild shipped around Canva Create 2026 **[secondary]** ([Android Police](https://www.androidpolice.com/canva-vs-capcut-video/), [fluxnote](https://fluxnote.io/guides/canva-video-editor-review)).

**Animations and transitions**
- Transitions go between media on the main track and have adjustable duration and direction. They are not available in page mode ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)).
- Magic Animate adds animations and transitions across a whole video in one click ([What's new in Canva Video](https://www.canva.com/newsroom/news/canva-video/)). "Photo and Video Animations" count as a Standard AI tool ([AI access](https://www.canva.com/help/ai-access/)).

**Audio**
- Audio sources: Canva's music library, sound effects, uploaded audio, and "Generate AI voice". Multiple audio tracks are supported ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)). Controls include volume, "Balance all", fade in/out (including on video clips) and trimming ([Trim videos](https://www.canva.com/help/trim-videos/), related article on audio editing).
- Canva Pro's library has "over 1.5 million tracks". Artlist's music and footage library is available inside Canva. "Enhance Voice" removes background noise ([What's new in Canva Video](https://www.canva.com/newsroom/news/canva-video/)).
- **Beat Sync:** AI detects beats and turns them into snap points. "Sync now" aligns pages, elements, transitions and animations to the nearest beat. Limits: audio of 10 minutes or less, and only in presentation, social and video design types ([Syncing audio with video](https://www.canva.com/help/syncing-audio-with-video/)).

**Stock video**
- Free plan: "4.7M+ photos, videos, graphics, and audio". Pro and above: "141M+ premium" assets ([Pricing](https://www.canva.com/pricing/)).
- Canva's 2019 acquisition of Pexels and Pixabay added more than 1 million free images and vectors ([Pexels/Pixabay press release, 17 May 2019](https://www.canva.com/newsroom/news/canva-acquires-pexels-pixabay/)).

**Background removal for video**
- One-click "BG Remover" works on videos whose original length is under 10 minutes. It is on paid plans only ([Remove photo and video backgrounds](https://www.canva.com/help/background-remover/), [Pricing](https://www.canva.com/pricing/): "Remove backgrounds from images and videos: Free Unavailable"). It launched at Canva Create 2022 ([Canva Video updates 2022](https://www.canva.com/newsroom/news/canva-video-updates-2022/)).
- Canva does not treat background removal as an AI generator, so it does not add AI-content metadata ([Background remover](https://www.canva.com/help/background-remover/)).

**Captions and auto-subtitles**
- ASR-generated "Editable Captions" appear as a timeline layer. There are more than 20 animated style packs, optional translation, and spoken-language auto-detection. Captions are burned into the downloaded video ([Generate and animate captions](https://www.canva.com/help/generate-edit-captions-on-videos/), [Edit and manage video captions](https://www.canva.com/help/edit-manage-video-captions/)). The feature pages list about 57 supported spoken languages ([Auto caption](https://www.canva.com/features/auto-caption/), via search snippet).

**AI video features**
- **Magic Video:** takes 1 to 10 clips or photos plus a prompt and produces a roughly 60-second vertical, multi-scene video with templates, transitions and music. It is "included with all Canva plans, including free", with an hourly limit. Uploaded clips must be under 10 minutes. Templates with pop music are available only in some countries "because of licensing rules" ([Magic Video](https://www.canva.com/help/magic-video/)).
- **Create a Video Clip (Canva AI):** 8-second clips with audio, or 6-second clips without, built on Google Veo 3. It is an Ultra AI tool. At launch it was limited to 5 generations a month on paid plans ([Veo 3 announcement](https://www.canva.com/newsroom/news/veo3-canva-ai-video/), [AI access](https://www.canva.com/help/ai-access/)).
- **Magic Media text-to-video:** 4-second silent clips, a Premium AI tool. **Image to Video:** 5-second clips. **AI Effects:** vertical, one image, "up to seven … every 30 minutes". **Highlights / Auto-trim:** AI picks the best moments. **Magic Design for Video:** supports 1920×1080, 1080×1920 and 1080×1080 ([Magic Video article and related articles](https://www.canva.com/help/magic-video/), [Trim videos](https://www.canva.com/help/trim-videos/)).

**Templates for TikTok, Reels and ads**
- Templates include "trend-inspired, ready-made video templates with audio already overlaid" ([What's new in Canva Video](https://www.canva.com/newsroom/news/canva-video/)). The template library is 1.6M+ on Free and 3.6M+ including premium ([Pricing](https://www.canva.com/pricing/)). Templates keep their timing and transitions when you swap in your own media ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)).

**Resize to other formats**
- Video designs can be resized ([Create and edit videos](https://www.canva.com/help/creating-and-editing-videos/)). The one-click Magic Switch video resize, with presets for Instagram, TikTok and other platforms, is "only available for Canva Pro users". It crops to fit, and "auto-framing" is not supported in Magic Video ([Video resize](https://www.canva.com/features/video-resize/), [Magic Video](https://www.canva.com/help/magic-video/)).

**Uploads**
- Video: MOV, GIF, MP4, MPEG, MKV or WEBM, up to 1 GB. Audio: up to 250 MB. "Canva supports 4K exports, but it downscales uploaded 4K videos to 1080p" ([Upload formats](https://www.canva.com/help/upload-formats-requirements/)).

### Implications for Akita (assessment)
- **Model:** Start with **scenes (pages) that have a duration**, plus **per-element in/out times** and **one or more audio tracks** that run across the whole video. That covers most TikTok and Reels ad templates. Keep element timing as absolute times (ms from video start), not "page index", so a later multi-track timeline does not need a data migration. Canva built scenes first and is now paying for the rebuild.
- Akita's editor renders HTML/SVG in the DOM (see `docs/TECH-STACK.md`). Entrance/exit animations and scene transitions should be defined **declaratively** (keyframes and easing as data) so the browser preview and the server renderer produce identical frames.
- Beat Sync is a cheap way to stand out once audio exists. Beat detection runs offline on the music library, and snap points are just timestamps.

---

## 2. Monetisation

### Facts (cited)

**Tiers and prices** ([Pricing](https://www.canva.com/pricing/), as fetched. Prices vary by region and the proxy's region is unknown.)

| Plan | Price shown | Video-relevant inclusions |
|---|---|---|
| Free | US$0 | 4.7M+ assets, 1.6M+ templates, 5 GB storage, up to 20 Standard or Premium AI uses, "Edit and create videos for any platform", "Publish to ad platforms (Canva Grow)" |
| Pro | US$144/year, one person | 141M+ premium assets, AI tools "(resize, translate, remove background…)", social scheduling, 100 GB, about 10x Free's AI allowance, AI Pass add-on |
| Business | US$250/year per person | Pro plus collaboration, 100 Brand Kits and approvals, Flourish, 500 GB, about 20x Free's AI allowance, ad insights |
| Enterprise | Contact sales | SSO/SCIM, 1 TB, Canva Shield AI indemnity, priority support |

**Export limits** ([Download as video](https://www.canva.com/help/download-as-video/))
- **Free:** MP4 up to **30 minutes** at up to **1920×1080**. GIF up to 1 minute at 1280×720. Changing quality away from the default, including to 480p or 720p, prompts an upgrade.
- **Pro, Teams, Nonprofits, Education:** MP4 up to **2 hours** at up to **3840×2160 (4K)**. GIF up to 2 minutes at 1080p. 4K export is desktop only.
- **Watermarks:** Free users get a criss-cross watermark on premium (crown) elements until each one is bought. A bought license covers one design only ([Premium elements](https://www.canva.com/help/premium-elements/), [Watermarks](https://www.canva.com/help/watermarks-design/)). Canva's help center has described the one-off license for a Pro stock video as US$1 (search snippet; price not confirmed on the current page).

**AI metering** ([AI access](https://www.canva.com/help/ai-access/))
- The allowance is shared across Standard, Premium and Ultra tiers. On paid plans, Standard tools such as Photo and Video Animations don't use the allowance. Free: up to 20 Standard or Premium uses and no Ultra. Pro: up to 200 Premium or 20 Ultra. Business and Enterprise: up to 400 Premium or 40 Ultra. When Free users hit the cap they get "short pauses". Ultra tools stop until the monthly reset. The AI Pass add-on gives "40x more AI than Canva Pro" ([Pricing](https://www.canva.com/pricing/)).

**Premium stock and music licensing**
- Premium audio creates a per-design license when you download. It allows "business projects, including videos uploaded to YouTube, Facebook, and Instagram". Canva tells users to connect their social account before downloading to avoid Content ID claims, and a separate license is needed per video ([Pro audio licenses](https://www.canva.com/help/verify-music/)).
- **Popular Music** is subscription-only and for "personal, non-commercial use only". It cannot be used in advertising, sponsored posts or monetised content. It is limited to certain territories (AU, CA, UK, US and listed EU/EEA countries) and to approved platforms (Facebook, Instagram, YouTube and TikTok) ([Popular Music License Agreement](https://www.canva.com/policies/popular-music-license/)).

### Implications for Akita (assessment)
- Canva's split is clear: **creating and exporting in HD is free, and differentiation is paid**. The paid side covers resolution and length, premium media, AI and background removal, resize, scheduling, and brand and team features.
- A paywall on *basic* export would put Akita at a disadvantage, since Canva Free exports 1080p. **Duration and quality caps** are a fairer paywall and match what costs Akita money.
- An **explicit usage allowance** (credits) fits server rendering and AI well. Canva's tiered allowance is a working precedent.
- Consider a "watermark until paid" model only if Akita licenses premium stock. Without premium content, a watermark on free exports would look worse than Canva.

---

## 3. Distribution

### Facts (cited)
- **Share destinations** in Canva's help center include Instagram and Facebook (image and video, schedulable), X, LinkedIn, Pinterest, **YouTube (videos and Shorts)**, Tumblr, **Meta Ads**, **TikTok Ads** ("Video designs for TikTok"), Sprout Social and Hootsuite ([Share on social media](https://www.canva.com/help/share-on-socials-and-messaging/)). The sharing-limitations page also lists TikTok among possible destinations ([Sharing limitations](https://www.canva.com/help/sharing-social-media-limitations/)). Whether *organic* TikTok posting is currently supported is unclear from the help center; see the open questions.
- **Content Planner (scheduling):** Pro, Business, Education and Nonprofits only. It schedules to Facebook Pages, Instagram Business, Twitter, LinkedIn, Pinterest, Slack and Tumblr. Each design goes to one platform at a time. Paid users can connect up to 80 accounts per team ([Content Planner](https://www.canva.com/help/content-planner/)). Free has "Schedule social content across platforms: Unavailable" ([Pricing](https://www.canva.com/pricing/)).
- **Platform-imposed limits on Canva's own share flow:** Instagram MP4 ≤ 100 MB and 3 to 60 s. Facebook video ≤ 250 MB. YouTube Shorts are 9:16 and ≤ 60 s, with #Shorts added automatically ([Sharing limitations](https://www.canva.com/help/sharing-social-media-limitations/)).
- **Ad publishing:** the "Meta Ads" and "TikTok Ads" share flows let you pick an image or video ad type, ad account, page, primary text, headline, CTA, campaign and ad set/group, and "Launch Ad as active". Selecting multiple pages "will combine them into one video" ([Publish to Meta](https://www.canva.com/help/publish-to-meta/), [Publish to TikTok](https://www.canva.com/help/publish-to-tiktok/)).
- **Canva Grow 2.0**, unveiled at Cannes Lions, publishes directly across Meta, TikTok and LinkedIn with Bulk Publish and a Launch Dashboard. It adds multi-platform insights, AI Ad Tagging, and "Automatic Refresh Generation" based on what performs in your Meta account. Canva says "Ads burn out in two to four weeks" and that platforms want "50 or more variants at a time" ([Grow 2.0](https://www.canva.com/newsroom/news/canva-grow/)). Google Ads and Amazon Ads are reached through app integrations (search snippet of [Canva Grow help](https://www.canva.com/help/canva-grow/)). "Publish to ad platforms (Canva Grow)" is listed as included on Free ([Pricing](https://www.canva.com/pricing/)).

### Implications for Akita (assessment)
- For an **ads-focused** video product, **direct publishing to Meta and TikTok Ads** is higher value than organic scheduling. It is also harder: both need a Marketing API app review, OAuth, and ongoing maintenance. Use "download MP4 at the right spec" for v1. Direct publish can come in v2.
- **Variant generation** (the same design in many hooks, copy variants and aspect ratios) is where Canva is heading, and it multiplies render volume. Price and queue design must assume N renders per design, not one.

---

## 4. Acquisitions and strategy

### Facts (cited)

| Year | Company | Relevance to video/media | Source |
|---|---|---|---|
| 2019 (17 May) | Pexels, Pixabay | Free stock library (photos, and later video) | [Canva press release](https://www.canva.com/newsroom/news/canva-acquires-pexels-pixabay/) |
| 2021 (Feb) | Kaleido (remove.bg, Unscreen) and Smartmockups | Background removal for photos and video; "150 million backgrounds from photos and videos every month" | [Canva newsroom](https://www.canva.com/newsroom/news/kaleido-smartmockups/); date from [TechCrunch](https://techcrunch.com/2021/02/24/canva-acquires-background-removal-specialists-kaleido/) **[secondary]** |
| 2022 (Feb) | Flourish | Data visualisation (animated charts) | [Affinity post lists Flourish](https://www.canva.com/newsroom/news/affinity/); date from [TechCrunch](https://techcrunch.com/2022/02/02/canva-acquires-flourish-in-mission-to-tell-better-stories-with-data/) **[secondary]** |
| 2024 | Affinity | Pro design suite. Canva's page says "90-person team" and "more than three million creative professionals" | [Canva newsroom](https://www.canva.com/newsroom/news/affinity/) |
| 2024 | Leonardo.Ai | Generative image and **video** models (Phoenix). The plan is to fold them into Magic Media | [Canva newsroom](https://www.canva.com/newsroom/news/leonardo-ai/) |
| 2025 (Jun) | MagicBrief | Ad creative intelligence; "analyse more than $6 billion in advertising spend" | [Canva newsroom](https://www.canva.com/newsroom/news/magicbrief-acquisition/); date and US$22.5M price from [CNBC](https://www.cnbc.com/2025/06/17/canva-moves-into-analytics-with-acquisition-of-magicbrief.html), [Capital Brief](https://www.capitalbrief.com/article/canva-paid-225m-for-ai-startup-magicbrief-gets-house-in-order-before-ipo-292d5bfa-aae8-4e48-b5d1-17ac0091d30c/) **[secondary]** |
| 2026 (Feb) | Cavalry, MangoAI | Cavalry is pro 2D motion design, which Canva frames as "photo, vector, layout, and now motion". MangoAI's "first product was designed to help generate and launch **video ads**, then learn from real-world results" | [Canva newsroom](https://www.canva.com/newsroom/news/mangoai-cavalry-acquisition/); date from [CNBC](https://www.cnbc.com/2026/02/23/canva-acquires-cavalry-for-motion-graphics-and-mangoai-for-video-ads.html) **[secondary]** |
| 2026 (Apr) | Simtheory, Ortto | Agents, and marketing automation across the "entire marketing and content lifecycle" | [Canva newsroom](https://www.canva.com/newsroom/news/simtheory-ortto-join-canva/); date from [TechCrunch](https://techcrunch.com/2026/04/08/canva-doubles-down-on-ai-and-marketing-automation-with-simtheory-ortto-acquisitions/) **[secondary]** |

- **Consolidation:** Unscreen.com, the standalone video background remover, closed on 29 June 2026, with the focus moving to Canva's own Video Background Remover ([Unscreen shutdown](https://www.canva.com/help/unscreen-shutdown/)). Cavalry-authored animations with locked scenes and editable text and colour are "coming soon" inside Canva ([ProSuite launch](https://www.canva.com/newsroom/news/canva-prosuite-launch/)).
- **Partnerships:** Artlist's music and footage library is available in Canva ([What's new in Canva Video](https://www.canva.com/newsroom/news/canva-video/)). Google Veo 3 powers Create a Video Clip ([Veo 3 announcement](https://www.canva.com/newsroom/news/veo3-canva-ai-video/)).

**Canva's statements on video usage and scale**
- "Over 1 billion videos have been downloaded on Canva" within about a year of the 2021 editor launch ([Canva Video updates 2022](https://www.canva.com/newsroom/news/canva-video-updates-2022/)).
- The largest uptake of video was in Brazil, with "massive adoption" in Indonesia and India, and the video editor supports more than 100 languages ([Video Suite](https://www.canva.com/newsroom/news/introducing-canva-video-suite/)).
- In 2025 Canva had 260 million monthly users and US$3.5 billion in revenue ([2025 in review](https://www.canva.com/newsroom/news/canva-2025-wrap/)). AI tools were "used more than 24 billion times" in the past year ([MangoAI/Cavalry post](https://www.canva.com/newsroom/news/mangoai-cavalry-acquisition/)). Reports of 265M MAU and about US$4B ARR in early 2026 are **[secondary]** ([TechBriefly](https://techbriefly.com/2026/02/19/canva-hits-265-million-active-users-and-4-billion-in-annual-revenue/)).
- Canva has not published a recent video-specific usage figure (such as video designs per month) in the sources reviewed.

### Implications for Akita (assessment)
- Canva's strategy has moved from "easy video editor" to a **closed loop for performance ads**: create, publish, measure, regenerate. Competing on that loop is out of scope for a small team. Akita can compete on **editor quality, collaboration and correct-to-spec ad exports**, and leave analytics to Meta and TikTok's own tools.
- Canva *bought* its background removal (Kaleido) and generative video (Leonardo, Veo partnership). Akita should **rent** these capabilities through third-party APIs behind a metered allowance, not build them.

---

## 5. Ad platform video specs (official)

Checked on 2026-09-25. Both platforms change specs without notice. Re-check before you hard-code limits.

### TikTok: Auction In-Feed ads ([TikTok Ads spec](https://ads.tiktok.com/help/article/video-ads-specifications?lang=en))
- **Aspect ratio and minimum resolution:** vertical 9:16 ≥ 540×960 (recommended); horizontal 16:9 ≥ 960×540; square 1:1 ≥ 640×640.
- **Containers:** .mp4, .mov, .mpeg, .3gp or .avi.
- **Duration:** "up to 10 minutes" (the page also says "No restrictions" in one section).
- **File size:** ≤ 500 MB. **Bitrate:** ≥ 516 kbps.
- **Codec:** not specified on this page.
- **Safe zones:** they depend on dimension, caption length and add-ons. Downloadable templates are available (LTR and RTL).
- **Creative best practice:** "using sound/music, orienting vertically at 9:16, shooting at least 720P resolution, and keeping your content visible within the UI safe zone" ([TikTok creative best practices](https://ads.tiktok.com/help/article/creative-best-practices), via search snippet).
- **Music:** businesses must use the pre-cleared **Commercial Music Library** for commercial content. General-library sounds are not cleared for brands ([About the CML](https://ads.tiktok.com/help/article/commercial-music-library?lang=en), [TikTok Support: commercial use of music](https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/commercial-use-of-music-on-tiktok)).

### Meta: Facebook and Instagram video ads ([Meta Ads Guide](https://www.facebook.com/business/ads-guide/update))

| Placement | Ratio / recommended resolution | Duration | Max size | Codec / notes |
|---|---|---|---|---|
| [Facebook Feed](https://www.facebook.com/business/ads-guide/update/video) | 4:5, 1440×1800; minimum 120×120 | 1 s to 241 min | 4 GB | MP4/MOV/GIF; H.264, square pixels, fixed frame rate, progressive scan; stereo AAC ≥ 128 kbps |
| [Facebook Reels](https://www.facebook.com/business/ads-guide/update/video/facebook-facebook-reels) | 9:16, 1440×2560 | No maximum stated | 4 GB | Same codec requirements; safe zone: keep about 14% top, 35% bottom and 6% sides clear |
| [Instagram Feed](https://www.facebook.com/business/ads-guide/update/video/instagram-feed) | 9:16, 1080×1920 as rendered on the page (verify; 4:5 is common for feed); minimum width 250 px; 1% ratio tolerance | 1 s to 60 min | 4 GB | MP4/MOV/GIF |
| [Instagram Reels](https://www.facebook.com/business/ads-guide/update/video/instagram-reels) | 9:16, 1440×2560; minimum width 250 px (<30 s) or 500 px (≥30 s) | 0 s to 15 min | 4 GB | H.264, stereo AAC ≥ 128 kbps; safe zone 14/35/6%; the page notes no licensed music |
| [Instagram Stories](https://www.facebook.com/business/ads-guide/update/video/instagram-story) | 9:16, 1440×2560; minimum width 250 px | 1 s to 60 min | 4 GB | H.264, stereo AAC ≥ 128 kbps; safe zone 14/35/6% |

All Meta placements say captions and sound are "optional, but recommended" (Reels: "strongly recommended"). They also say files must not contain "edit lists or special boxes" in the container. The Meta pages were read through a summariser, so exact wording may differ slightly.

### Implications for Akita (assessment)
- **One default export profile covers nearly everything:** MP4 (no edit lists, moov atom at the front), **H.264 High profile, yuv420p, constant frame rate 30 fps, progressive**, **AAC-LC stereo 48 kHz at ≥128 kbps**. Use 1080×1920 for 9:16. Optionally offer 1440×2560 for Meta's "recommended" size.
- **Canvas presets:** 9:16 (1080×1920), 4:5 (1080×1350), 1:1 (1080×1080) and 16:9 (1920×1080).
- **Safe-zone overlays** in the editor: a Meta 14/35/6% overlay and TikTok's templated overlays. These are cheap to build and useful for ad makers.
- Validation to add: file ≤ 500 MB (TikTok), and a clear limit on the Meta Reels duration you support (the page states no maximum). In practice, cap v1 exports at about 3 minutes.

---

## 6. Implications for Akita (assessment, not fact)

### MVP video feature set

| Feature | Canva tier | Akita v1? | Cost / complexity |
|---|---|---|---|
| Scenes (pages) with duration, reorder, trim | Free | **Yes** | Medium: timing model plus preview playback |
| Per-element in/out timing | Free | **Yes** | Medium |
| Entrance/exit animations (presets) | Free (Standard) | **Yes** (about 10 presets) | Medium: must be deterministic across the browser preview and the server renderer |
| Scene transitions (fade, slide, zoom) | Free | **Yes** (3–5) | Medium |
| Upload video clips, with trim | Free | **Yes** | High: transcoding on upload (proxy plus poster), storage in MinIO |
| Background music track, volume, fade | Free | **Yes** | Low–medium |
| Royalty-free music library | Free and Pro tiers | **Yes, small curated set** (commercially cleared) | Licensing cost; see below |
| Popular (label) music | Pro, non-commercial only | **No** | High legal risk for ads; not allowed in ads anyway |
| Stock video library | Free (Pexels/Pixabay) and Pro premium | **Maybe**: Pexels API integration | Low engineering; check API terms |
| Aspect-ratio presets and safe-zone overlays | Free | **Yes** | Low |
| MP4 export 1080p, ≤ 60–180 s | Free (1080p, 30 min) | **Yes (free)** | Render compute on every export |
| 4K export / longer duration / priority queue | Pro | **Paid plan** | High compute; directly tied to cost |
| Auto captions (ASR) with styles | Free (no plan gate found) | **v1.5, paid or metered** | Per-minute ASR API cost; timeline layer UI |
| Voiceover (TTS) | AI tool | **v2, metered** | Per-character API cost |
| Beat Sync | Free (AI-assisted) | **v2** | Low if beats are precomputed for library tracks |
| Resize video design to other ratio | Pro (Magic Switch) | **v1 manual duplicate-to-ratio; smart resize paid later** | Medium (layout reflow) |
| Video background removal | Paid plans | **v2, paid, metered** | High: GPU or third-party API per second of video |
| Text/image-to-video generation | Premium or Ultra AI | **No (v3+)** | Very high per-clip cost |
| Templates for TikTok/Reels ads | Free and premium | **Yes, 20–50 seed templates** | Content production effort |
| Direct publish to Meta/TikTok Ads | Free (Canva Grow) | **No (v2)** | High: API approvals, OAuth, maintenance |
| Social scheduling (organic) | Pro | **No** | Medium–high |
| Real-time collaborative video editing | Free | **Yes if it falls out of the existing editor sync** | Timing fields must merge like other properties |

### What to gate behind a paid plan (assessment)
Keep the free tier competitive with Canva Free: 1080p MP4, no watermark on your own content, core editor. Gate what costs Akita money or what professionals value:
1. **4K, and exports longer than about 60 s**, plus priority render queue access. These scale with compute.
2. **Metered AI:** captions (ASR), TTS voiceover, background removal. Use a monthly allowance, as Canva does.
3. **Premium content**, if Akita ever licenses any.
4. **Brand kits, multiple ratio variants and bulk variants**: the multiplier features agencies pay for.
5. Later: **direct ad publishing**, **team approvals**.

### Licensed content that is costly or risky
- **Music is the main risk.** Canva's label ("popular") music excludes advertising outright, and TikTok requires CML music for business content. For an ads product, use only **commercially cleared, sync-licensed royalty-free music** (for example a curated library or a provider licensed for SaaS redistribution). Also keep a **per-export license record**, as Canva does per design.
- **Stock video:** Pexels and Pixabay are free (Canva owns them), and their API terms have to be checked. Premium stock (Getty, Shutterstock, Artlist) means revenue share or per-asset fees, which is only worth it once there is a paid tier to carry it.
- **User uploads:** put music copyright responsibility for uploaded audio on the user in the terms, and show a warning when the export target is "ad".

### How server-side rendering affects the product
Akita renders designs as DOM (HTML/SVG), and video export runs on the server ([TECH-STACK.md](../TECH-STACK.md)).
- **Likely pipeline:** headless Chromium loads a "render mode" of the design, steps a **virtual clock** frame by frame, and captures each frame (screenshot or screencast). FFmpeg then encodes the frames and mixes the audio. Remotion is a known implementation of this approach for React. Check its license terms before adopting it.
- **Performance:** this approach is CPU-heavy and roughly linear in frames × pixels. A 30 s, 30 fps, 1080×1920 export is 900 frames. At an assumed 30–80 ms per capture and composite, that is roughly 30–75 s of wall time on one worker before encoding, and 4K is about 4x the pixels. These are **rough estimates to validate with a spike**, not measurements. Rendering can run in parallel by splitting frame ranges across workers and concatenating the parts.
- **Product consequences:**
  - Exports must be **asynchronous jobs**: a queue, progress, notification, and a download link from MinIO. They cannot be a synchronous download.
  - Queue wait times will be visible to users, so **priority queues become a paid perk**, and free-tier duration caps limit cost.
  - **Cache** renders by design version and cache transcoded upload proxies to avoid repeated work, which matters once variants multiply renders per design.
  - **Preview/export parity** is a real risk. The same animation engine and fonts must run in both the browser and the renderer. Treat any mismatch as a bug class and add visual regression tests.
  - **Mobile benefit** (why the owner chose server rendering): exports work the same on phones. Canva also stresses web, desktop and mobile parity ([Video Suite](https://www.canva.com/newsroom/news/introducing-canva-video-suite/)).
- **Cost model:** compute per render-minute plus egress and storage for source clips (Canva caps uploads at 1 GB and downscales 4K to 1080p on upload; Akita should probably do both). Put a per-plan monthly render-minute budget in the pricing from day one.

---

## Open questions for the owner

1. **Audience:** is Akita's video feature mainly for **paid ads** (TikTok, Meta) or for **organic social**? The answer decides music licensing, publishing integrations and templates.
2. **Model choice:** is **scenes plus per-element timing** acceptable for v1, or do you want a multi-track timeline from the start? Canva needed years to get to multi-track.
3. **Free-tier export ceiling:** what free duration and resolution cap is acceptable (for example 1080p, 60 s) given render cost? Canva Free allows 1080p and 30 min.
4. **Music:** what is the budget for a commercially cleared music library? Or should v1 ship with uploads only plus a small set of commissioned or CC0 tracks?
5. **Rendering stack:** headless Chromium frame capture (Remotion or custom) versus a separate renderer that re-implements the DOM layout. The first gives parity with less engineering but costs more compute per frame.
6. **Render SLA:** what export wait is acceptable on free and on paid plans? This sets worker count and cost.
7. **AI features:** which, if any, do you want in the first paid plan (captions, TTS, background removal)? Each needs a vendor and a metering design.
8. **Organic TikTok publishing:** Canva's current help center lists only "TikTok Ads" among share targets, while older Canva pages mention TikTok posting. Is direct organic TikTok posting a requirement for Akita?

---

## Sources

**Canva: help center**
- Download as video/GIF: https://www.canva.com/help/download-as-video/
- Create and edit videos (timeline): https://www.canva.com/help/creating-and-editing-videos/
- Trim videos and scene duration: https://www.canva.com/help/trim-videos/
- Syncing audio with video (Beat Sync): https://www.canva.com/help/syncing-audio-with-video/
- Generate and animate captions: https://www.canva.com/help/generate-edit-captions-on-videos/
- Edit and manage captions: https://www.canva.com/help/edit-manage-video-captions/
- Magic Video (and related AI video articles): https://www.canva.com/help/magic-video/
- Background remover: https://www.canva.com/help/background-remover/
- Upload formats and requirements: https://www.canva.com/help/upload-formats-requirements/
- Understanding your AI usage: https://www.canva.com/help/ai-access/
- Premium elements: https://www.canva.com/help/premium-elements/
- Watermarks: https://www.canva.com/help/watermarks-design/
- Pro audio licenses: https://www.canva.com/help/verify-music/
- Content Planner: https://www.canva.com/help/content-planner/
- Share on social media: https://www.canva.com/help/share-on-socials-and-messaging/
- Sharing limitations: https://www.canva.com/help/sharing-social-media-limitations/
- Publish Meta ads: https://www.canva.com/help/publish-to-meta/
- Publish TikTok ads: https://www.canva.com/help/publish-to-tiktok/
- Canva Grow help (snippet only; page blocked): https://www.canva.com/help/canva-grow/
- Unscreen shutdown: https://www.canva.com/help/unscreen-shutdown/

**Canva: pricing, product, policy**
- Pricing: https://www.canva.com/pricing/
- Video resize (Magic Switch): https://www.canva.com/features/video-resize/
- Auto caption feature page: https://www.canva.com/features/auto-caption/
- Popular Music License Agreement: https://www.canva.com/policies/popular-music-license/

**Canva: newsroom**
- Introducing Canva Video Suite: https://www.canva.com/newsroom/news/introducing-canva-video-suite/
- Canva Video updates 2022: https://www.canva.com/newsroom/news/canva-video-updates-2022/
- What's new in Canva Video: https://www.canva.com/newsroom/news/canva-video/
- Veo 3 / Create a Video Clip: https://www.canva.com/newsroom/news/veo3-canva-ai-video/
- Canva Grow 2.0: https://www.canva.com/newsroom/news/canva-grow/
- Pexels and Pixabay: https://www.canva.com/newsroom/news/canva-acquires-pexels-pixabay/
- Kaleido and Smartmockups: https://www.canva.com/newsroom/news/kaleido-smartmockups/
- Affinity: https://www.canva.com/newsroom/news/affinity/
- Leonardo.Ai: https://www.canva.com/newsroom/news/leonardo-ai/
- MagicBrief: https://www.canva.com/newsroom/news/magicbrief-acquisition/
- MangoAI and Cavalry: https://www.canva.com/newsroom/news/mangoai-cavalry-acquisition/
- Simtheory and Ortto: https://www.canva.com/newsroom/news/simtheory-ortto-join-canva/
- ProSuite launch: https://www.canva.com/newsroom/news/canva-prosuite-launch/
- 2025 in review: https://www.canva.com/newsroom/news/canva-2025-wrap/

**TikTok (official)**
- Auction In-Feed ad specs: https://ads.tiktok.com/help/article/video-ads-specifications?lang=en
- Creative best practices: https://ads.tiktok.com/help/article/creative-best-practices
- Commercial Music Library: https://ads.tiktok.com/help/article/commercial-music-library?lang=en
- Commercial use of music: https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/commercial-use-of-music-on-tiktok

**Meta (official)**
- Ads Guide index: https://www.facebook.com/business/ads-guide/update
- Facebook Feed video: https://www.facebook.com/business/ads-guide/update/video
- Facebook Reels video: https://www.facebook.com/business/ads-guide/update/video/facebook-facebook-reels
- Instagram Feed video: https://www.facebook.com/business/ads-guide/update/video/instagram-feed
- Instagram Reels video: https://www.facebook.com/business/ads-guide/update/video/instagram-reels
- Instagram Stories video: https://www.facebook.com/business/ads-guide/update/video/instagram-story

**Secondary**
- TechCrunch, Kaleido (2021): https://techcrunch.com/2021/02/24/canva-acquires-background-removal-specialists-kaleido/
- TechCrunch, Flourish (2022): https://techcrunch.com/2022/02/02/canva-acquires-flourish-in-mission-to-tell-better-stories-with-data/
- CNBC, MagicBrief (2025): https://www.cnbc.com/2025/06/17/canva-moves-into-analytics-with-acquisition-of-magicbrief.html
- Capital Brief, MagicBrief price: https://www.capitalbrief.com/article/canva-paid-225m-for-ai-startup-magicbrief-gets-house-in-order-before-ipo-292d5bfa-aae8-4e48-b5d1-17ac0091d30c/
- CNBC, Cavalry and MangoAI (2026): https://www.cnbc.com/2026/02/23/canva-acquires-cavalry-for-motion-graphics-and-mangoai-for-video-ads.html
- TechCrunch, Simtheory and Ortto (2026): https://techcrunch.com/2026/04/08/canva-doubles-down-on-ai-and-marketing-automation-with-simtheory-ortto-acquisitions/
- TechBriefly, 265M MAU / $4B ARR: https://techbriefly.com/2026/02/19/canva-hits-265-million-active-users-and-4-billion-in-annual-revenue/
- Android Police, timeline rebuild: https://www.androidpolice.com/canva-vs-capcut-video/
- fluxnote, Canva video editor review 2026: https://fluxnote.io/guides/canva-video-editor-review
