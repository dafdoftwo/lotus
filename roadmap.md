PROMPT (FINAL & COMPREHENSIVE - V5 w/ Tiered Pricing & Shipping): GENERATE LUXURY MOBILE-FIRST COD LANDING PAGE & ADMIN SYSTEM FOR "LOTUS" DRESS (EGYPT - 2025)

Primary Task: Generate the complete Frontend code (HTML, CSS, JavaScript) for an exquisite, highly persuasive, and mobile-first landing page (index.html) focused solely on selling the "Lotus Dress" to women in Egypt via Cash on Delivery (COD). Simultaneously, define the requirements and structure for a simple backend order management system using Firebase (Firestore, Authentication, Hosting), including a basic Admin Panel (admin.html). The design must embody supreme elegance and luxury, leveraging the Core Product Description and Specific Tiered Pricing / Free Shipping Offer detailed below. Generated code must correctly reference all image assets from the public/images/ directory. The goal is making the purchase irresistible and seamless on mobile, while the backend enables efficient order processing. The primary language for the user-facing page is Arabic.

Core Objectives:

Mobile-First Excellence (RTL): Design prioritized for flawless vertical viewing/interaction on smartphones (RTL). Large touch targets, fast loading, intuitive flow.

Luxury & Modern Elegance Aesthetics: Premium, contemporary, high-end visual experience reflecting 2025 trends. Sophisticated design, elegant typography, luxurious palette, supporting the value proposition.

Conversion-Focused Landing Page: Every element guides towards the order form, highlighting the attractive tiered pricing and free shipping offer.

Seamless COD Ordering with Dynamic Pricing: index.html collects order info for COD. Crucially, implements the specified tiered pricing (770, 1399, 1900 EGP) and free shipping logic dynamically via JavaScript.

Integrated Order Management: Firebase backend captures orders (including calculated total price and shipping status) and provides a secure admin panel (admin.html).

Target Audience: Style-conscious women in Egypt seeking modern elegance, quality, a flattering fit, and good value through multi-buy offers.

Product Highlights (Lotus Dress - 2025):

Name: فستان لوتس (Lotus Dress)

Core Product Description (Arabic - Use as foundation for page copy):

"انغمسي في عالم من الأناقة الراقية مع فستان لوتس. مُصمم ليمنحكِ إطلالة آسرة تخطف الأنظار بقصّته الانسيابية التي تتحرك معكِ بكل رقة ونعومة. مصنوع من قماش فاخر ينسدل بسحرٍ على القوام، ليمنحكِ إحساسًا بالراحة المطلقة ولمسة من الفخامة الخالدة. تصميم يجمع بين البساطة الراقية والتفاصيل المدروسة، ليصبح توقيعكِ الخاص في كل مناسبة تبحثين فيها عن التميز والثقة المطلقة."

Key Selling Points: تصميم انسيابي فاخر, قماش فاخر وراحة مطلقة, أناقة خالدة بتفاصيل مدروسة, عروض أسعار مميزة عند شراء أكثر من قطعة, شحن مجاني عند طلب 3 قطع!

Benefits: إطلالة ساحرة, راحة استثنائية, جودة فائقة, ثقة وجاذبية, توفير أكبر مع العروض.

Available Colors: أحمر (Red), أسود (Black), بيج (Beige).

Available Sizes: M, L, XL - Clearly state: "مقاسات تناسب وزن من 60 كيلو حتى 90 كيلو".

Pricing Structure:

1 Dress: 770 جنيه مصري

2 Dresses: 1399 جنيه مصري (خصم خاص!)

3 Dresses: 1900 جنيه مصري + شحن مجاني!

Mandatory Design & UX Requirements (Landing Page - index.html):

Mobile-First Layout (RTL): Vertical flow paramount. <html lang="ar" dir="rtl">. Easy navigation. Readability. Desktop adaptation.

Visual Luxury & Modern Elegance (2025):

Color Palette: Sophisticated base (Beige, neutrals, Black). Metallic accent. Red option stands out. Clean, upscale feel. Highlight the special offers visually where appropriate.

Typography: Premium, readable Arabic fonts.

Imagery & Path: Use stunning images from public/images/ (hero, colors, details, lifestyle - e.g., <img src="public/images/lotus-red.jpg">). Must clearly show Red, Black, Beige variants. Visuals must reinforce luxury & quality.

Icons: Modern, elegant SVGs from public/images/icons/ or similar.

Persuasive Arabic Copywriting Tone: Elegant, aspirational, benefit-driven. Emphasize the beauty & quality described, AND clearly communicate the value proposition of the tiered pricing and free shipping offer.

Performance: Fast load speeds via optimized assets in public/images/ (compressed, WebP) and clean code.

Page Structure & Key Sections (Landing Page - index.html - RTL):

Hero Section (Above the Fold):

Headline: Convey luxury & impact. Maybe hint at offer: "فستان لوتس: أناقة لا مثيل لها وعروض لا تُفوَّت!".

Sub-headline: Elaborate on elegance & comfort.

Primary Visual: Stunning image/video from public/images/.

Initial CTA: "اكتشفي الآن واحصلي على عرضك". Mention COD. Possibly a small banner near CTA: "عرض خاص: وفري أكثر عند شراء قطعتين أو ثلاثة!".

لماذا لوتس هو اختيارك؟ (Why Lotus? - Benefit-Driven):

Expand on Core Description points (Flow, Fabric, etc.) using text and visuals from public/images/.

Add a dedicated subsection/highlight for the Offers: Clearly explain the tiered pricing visually (e.g., small graphic showing 1=770, 2=1399, 3=1900 + Free Shipping icon). Use text like "كلما اشتريتِ أكثر، وفرتِ أكثر!".

معرض الألوان والتصميم (Color & Design Showcase):

Display Red, Black, Beige options using images from public/images/. Labels: أحمر، أسود، بيج.

نموذج الطلب الفوري (THE INSTANT ORDER FORM - Dynamic Pricing Crucial):

Aesthetics: Stunning, seamless, premium feel. Perfect RTL.

Functionality (Mobile-Friendly Inputs - RTL & Dynamic JS Logic):

اختيار اللون: Large elegant swatches/buttons for Red, Black, Beige. Clear feedback.

اختيار المقاس: Large clickable buttons (M, L, XL). Clear feedback. Display "(يناسب وزن من 60 إلى 90 كيلو)".

الكمية والسعر الديناميكي (Quantity & Dynamic Pricing):

Clear + / - buttons (touch-friendly). Default quantity = 1. Max quantity might be limited (e.g., to 5 or as needed, though pricing only defined up to 3).

DYNAMIC PRICE CALCULATION (JavaScript MUST implement this logic):

If Quantity = 1, Total Price = 770 EGP.

If Quantity = 2, Total Price = 1399 EGP.

If Quantity = 3, Total Price = 1900 EGP.

(Define behavior if quantity > 3 - e.g., reverts to 770 per piece or uses 1900/3 * Qty).

Display Base Price per unit (e.g., "السعر الأساسي: 770 جنيه") for reference perhaps.

Display the DYNAMIC TOTAL (الإجمالي) prominently. MUST update instantly and accurately based on the quantity and the tiered structure (770, 1399, 1900).

DYNAMIC SHIPPING MESSAGE: Display a message near the total:

If Quantity < 3: Show " + مصاريف الشحن".

If Quantity = 3: Show "الشحن مجاناً!" (boldly/highlighted). JS must control this text dynamically based on quantity.

بيانات التوصيل (Required): الاسم بالكامل, رقم الموبايل (+Note), المحافظة (Dropdown), العنوان بالتفصيل (+Placeholder).

Form Submission Logic & CTA:

JS Action: On submit: collect data (name, phone, address, color, size, quantity), calculate the final totalPrice based on the quantity tier (770/1399/1900), determine freeShipping status (true if quantity=3, else false) -> structure order object -> write to Firebase Firestore orders collection. Visual feedback.

CTA Button: Large accent color button. Text: "تأكيد الطلب الآن (الدفع عند الاستلام)". On success, clear inline message.

ضمانات وعروض إضافية (Guarantees & Added Value):

Reiterate COD & safety. Highlight quality guarantees.

Re-emphasize the free shipping offer: "لا تفوتي فرصة الشحن المجاني عند طلب 3 قطع!".

Policy links if needed. Optional testimonials.

Footer: Minimalist. Copyright "© 2025 لوتس.", WhatsApp, minimal policy links.

Backend & Admin Panel Requirements (admin.html & Firebase):

Firebase Setup:

Firestore: orders collection. Order Doc Structure: customerName, customerPhone, customerGovernorate, customerAddress, selectedColor, selectedSize, quantity, totalPrice (The final calculated price: 770, 1399, or 1900), orderStatus, createdAt, freeShipping (boolean: true/false).

Authentication: Email/Password for admin.

Hosting: Serve index.html, admin.html, public/ folder.

Security Rules (Firestore): Unauthenticated create on /orders. Authenticated admin read, update (status) on /orders.

Admin Panel (admin.html):

Secure Login. Order Dashboard (show Price, Qty, Color, Shipping Status - e.g., icon/text if freeShipping is true). Order Details View. Status Update Controls. Functional UI.

Technical Specifications:

Frontend: HTML5 (lang="ar" dir="rtl"), CSS3, Modern JS (ES6+). JS is critical for implementing the exact tiered pricing (770/1399/1900) and dynamic free shipping message/status based on quantity. All image paths point to public/images/.

Backend: Firebase (Firestore, Auth, Hosting).

Build/Tooling: Node.js/npm, sharp (recommended).

Image Optimization: Mandatory optimization of all images in public/images/.

Responsiveness: Flawless RTL mobile UX priority.

Code Quality: Clean, semantic, commented. Robust error handling. JS pricing logic must be accurate and robust.

Final Goal (2025): Generate a stunning, modern, and highly persuasive Arabic landing page (index.html) using images from public/images/, effectively communicating luxury and value via the Core Description and the specific tiered pricing (770/1399/1900 EGP) and free shipping offer, dynamically calculated via JavaScript. The page drives COD conversions through a seamless mobile-first (RTL) experience and integrates perfectly with a functional Firebase backend and admin panel (admin.html) reflecting the calculated price and shipping status.