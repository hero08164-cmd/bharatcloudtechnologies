# Bharat Cloud Hub

BUILD A PRODUCTION-READY WEBSITE + ADMIN PANEL

BHARAT CLOUD TECHNOLOGIES

Create a professional, production-ready website and secure admin CMS for Bharat Cloud Technologies, an India-based technology company founded in 2020.

The website must present Bharat Cloud Technologies as a real software/product company that builds useful applications and technology products.

IMPORTANT: Do NOT add products that are not listed in this prompt.

For the initial launch, only these three products should be publicly displayed:

Prompt Verse

TubePilot

Nexa Browser

The architecture must allow an administrator to add more products later without modifying frontend code.

1. BRAND IDENTITY

Company:

Bharat Cloud Technologies

Founded:

2020

Tagline:

Innovate. Develop. Automate. Empower.

Positioning:

Building useful technology from India.

Core areas:

AI

Software

Mobile Applications

Web Applications

Automation

Developer Products

Cloud Technology

Use the provided official Bharat Cloud Technologies logo.

The website must use the new logo as the primary brand identity.

2. VISUAL DESIGN

Create a premium, modern and trustworthy technology-company website.

IMPORTANT:

The website must NOT use a dark theme.

Primary background:

White

Warm white

Very light wheat/beige

Brand accents:

Saffron/orange

Green

Charcoal/dark gray

Use subtle gradients only where useful.

Avoid:

Cyberpunk design

Excessive neon

Excessive glassmorphism

Overly dark sections

Generic AI startup templates

Excessive animations

Fake 3D effects

The visual style should feel:

Professional

Indian

Modern

Clean

Premium

Technology-focused

Trustworthy

Use the supplied Bharat Cloud Technologies logo.

3. TECHNOLOGY STACK

Use:

React

TypeScript

Vite

Tailwind CSS

React Router

Supabase for backend/database/auth/storage

PostgreSQL through Supabase

Supabase Storage for product logos/images

Secure admin authentication

Row Level Security

Lucide Icons

Use reusable components.

The code must be production-ready.

Do not use fake APIs.

Do not use fake backend functionality.

Do not hardcode product data inside UI components.

Product data must come from the database/CMS.

4. PUBLIC WEBSITE NAVIGATION

Navbar:

Logo

Navigation:

Home

Products

About

Technology

Contact

Right side:

Explore Products

CTA button.

Mobile navigation must be responsive.

5. HERO SECTION

Create a premium centered hero section.

Small badge:

🇮🇳 Building from India since 2020

Main heading:

Building Technology for a Better Tomorrow.

Description:

Bharat Cloud Technologies builds useful software, applications and technology products designed to make digital work simpler, smarter and more accessible.

Primary button:

Explore Our Products

Secondary button:

Our Story

Display the Bharat Cloud Technologies logo prominently.

Use subtle cloud, technology and growth-inspired decorative elements.

Keep the section clean and spacious.

6. COMPANY INTRODUCTION

Heading:

We Build Useful Technology.

Description:

Bharat Cloud Technologies started its journey in 2020 with a simple goal: learn, build and create useful technology. Today, we are developing applications and software products for creators, businesses and everyday users.

Create four small feature blocks:

INNOVATE

Turning ideas into useful solutions.

DEVELOP

Building practical digital products.

AUTOMATE

Making repetitive work simpler.

EMPOWER

Giving users better technology.

7. PRODUCTS SECTION

Heading:

Our Products

Subtitle:

Explore the products we are building and improving.

IMPORTANT:

Only show these initial three products.

PRODUCT 1 — PROMPT VERSE

Name:

Prompt Verse

Category:

AI Creative Tools

Description:

A creative platform for discovering and working with useful AI image-generation prompts and creative ideas.

CTA:

Explore Prompt Verse

Download button:

Download APK

The APK link must come from the admin CMS.

The product logo must come from the database/storage.

Do NOT hardcode the APK URL.

PRODUCT 2 — TUBEPILOT

Name:

TubePilot

Category:

Creator Automation

Description:

A content automation platform designed to help creators manage, upload and schedule large volumes of YouTube videos efficiently.

CTA:

Explore TubePilot

Download button:

Open TubePilot

The product URL must be managed through the admin panel.

PRODUCT 3 — NEXA BROWSER

Name:

Nexa Browser

Category:

Browser / Productivity

Description:

A lightweight and practical browser designed for a simple and convenient everyday browsing experience.

CTA:

Explore Nexa Browser

Download button:

Download APK

APK URL must be controlled from the admin panel.

8. PRODUCT CARD SYSTEM

Each product card must support:

Product logo

Product name

Short description

Category

Status

Version

APK/download button

Website button

Learn More button

Optional screenshots

Optional feature list

Do not show fields that are empty.

If an APK link does not exist, hide the APK button.

If a website link does not exist, hide the website button.

If screenshots do not exist, do not show an empty gallery.

9. PRODUCT DETAIL PAGE

Create dynamic product pages.

Route example:

/products/:slug

Each product page should support:

Product logo

Product name

Category

Description

Long description

Status

Version

Release date

APK download

Website URL

Screenshots

Features

Changelog

Privacy Policy URL

Terms URL

Only display available information.

The admin must control all product content.

10. ADMIN PANEL

Create a separate secure admin dashboard.

Route:

/admin

The admin panel must NOT be visible as a normal public navigation item.

Require authentication.

Use Supabase Authentication.

Only authorized admin users should be able to access the dashboard.

Implement proper Row Level Security.

11. ADMIN DASHBOARD

Dashboard should show:

Total Products

Published Products

Draft Products

Recently Updated Products

Quick Actions:

Add Product

Edit Products

Manage Products

Manage Media

12. PRODUCT MANAGEMENT CMS

Create full CRUD functionality.

Admin can:

Create product

Edit product

Delete product

Publish product

Unpublish product

Save draft

Reorder products

Product fields:

Basic Information

Product Name

Slug

Category

Short Description

Full Description

Status

Version

Release Date

Product Branding

Product Logo

Product Icon

Favicon / App Icon if required

Admin should be able to upload product logo through Supabase Storage.

Do not require manually editing code.

Product Links

Website URL

APK Download URL

APKPure URL

Google Play URL

GitHub URL

Documentation URL

Privacy Policy URL

Terms URL

All links must be optional.

If a link is empty, the corresponding button must automatically disappear from the website.

Product Media

Allow admin to upload:

Product logo

App screenshots

Promotional images

Banner image

Use Supabase Storage.

Store file URLs in the database.

Product Features

Admin can add unlimited feature items.

Example:

Feature title

Feature description

Feature icon

Allow adding/removing/reordering features.

Product Changelog

Admin can create updates.

Fields:

Version

Release Date

Update Title

Changes

Allow multiple changelog entries.

13. PRODUCT PUBLISHING

Every product must have:

Draft

Published

Archived

states.

Only products marked:

Published

should appear on the public website.

Draft products must never appear publicly.

Archived products should not appear in the main product listing.

14. ADMIN MEDIA MANAGER

Create a media management area.

Admin can:

Upload images

View uploaded images

Delete unused images

Copy image URL

Associate images with products

Use Supabase Storage.

Add file validation.

Allowed image types:

PNG JPG JPEG WEBP SVG where safe

Add reasonable file-size validation.

15. ADMIN SETTINGS

Create settings for:

Company name

Company logo

Company description

Tagline

Founded year

Contact email

Instagram URL

YouTube URL

GitHub URL

LinkedIn URL

X/Twitter URL

Website URL

These settings should be stored in the database.

Do not hardcode them throughout the frontend.

16. SOCIAL LINKS

Public website should support:

Instagram

YouTube

GitHub

LinkedIn

X/Twitter

Social URLs must come from admin settings.

If a social URL is empty, hide that social icon.

Do not invent usernames or URLs.

17. ABOUT SECTION

Heading:

Our Journey

Content:

Bharat Cloud Technologies began its journey in 2020. What started as a learning and development journey has evolved into building real software products and applications.

We believe technology should solve practical problems, simplify workflows and give people better digital tools.

Mission:

Build useful technology that people can actually use.

Vision:

Build a growing technology ecosystem from India for users around the world.

18. TECHNOLOGY SECTION

Heading:

What We Build

Create cards for:

AI Applications

Mobile Apps

Web Applications

Automation

APIs & Integrations

Cloud & Backend Systems

Developer Tools

Do not claim specific technologies or infrastructure that are not actually used.

19. COMPANY TIMELINE

Create:

2020

The Beginning

Bharat Cloud Technologies starts its journey.

2021–2023

Learning & Experimentation

Development skills and technology experience grow.

2024–2025

Product Development

Multiple software and application projects take shape.

2026

Building the Product Ecosystem

Focus expands toward AI, automation, creator tools and practical software products.

Future

Building What's Next

Continue developing useful technology products.

20. CONTACT SECTION

Heading:

Let's Build Something Useful

Create contact form:

Name

Email

Company

Subject

Message

Submit button:

Send Enquiry

Do not display a fake email address.

Make the contact email configurable through Admin Settings.

21. FOOTER

Show:

Bharat Cloud Technologies logo

Short description:

Building useful technology from India.

Links:

Home

Products

About

Technology

Contact

Products:

Prompt Verse

TubePilot

Nexa Browser

Social links:

Instagram

YouTube

GitHub

LinkedIn

X

Footer:

© 2020–2026 Bharat Cloud Technologies. All rights reserved.

🇮🇳 Proudly building from India

22. SEO

Website title:

Bharat Cloud Technologies | AI, Apps & Automation

Meta description:

Bharat Cloud Technologies builds useful software, applications, AI tools and automation products from India.

Dynamic product SEO:

Product title:

{Product Name} | Bharat Cloud Technologies

Product description should automatically use the product's SEO description if available, otherwise use its short description.

Generate proper:

Open Graph title

Open Graph description

Open Graph image

Canonical URL

23. DATABASE STRUCTURE

Create a clean Supabase/PostgreSQL schema.

Table:

products

Fields should include:

id

name

slug

category

short_description

description

logo_url

icon_url

banner_url

status

version

release_date

website_url

apk_url

apkpure_url

play_store_url

github_url

documentation_url

privacy_url

terms_url

is_featured

display_order

created_at

updated_at

seo_title

seo_description

Create:

product_features

Fields:

id

product_id

title

description

icon

display_order

created_at

updated_at

Create:

product_screenshots

Fields:

id

product_id

image_url

title

display_order

created_at

Create:

product_changelog

Fields:

id

product_id

version

title

changes

release_date

created_at

Create:

site_settings

Fields:

id

company_name

tagline

description

logo_url

founded_year

contact_email

instagram_url

youtube_url

github_url

linkedin_url

x_url

website_url

updated_at

Create proper foreign keys.

Use cascading behavior carefully.

24. SECURITY

Admin security is extremely important.

Use:

Supabase Auth

Row Level Security

Admin authorization

Protected admin routes

Only authorized users can:

Create products

Edit products

Delete products

Upload media

Change links

Publish products

Change company settings

Never expose Supabase service-role credentials in frontend code.

Use environment variables for public configuration.

Never store private credentials in the database.

25. ADMIN UX

Admin dashboard should be extremely simple because the purpose is to update the website without touching code.

Example workflow:

Admin logs in

↓

Dashboard

↓

Products

↓

Add Product

↓

Upload Logo

↓

Enter Product Name

↓

Enter Description

↓

Add APK Link

↓

Add Website Link

↓

Upload Screenshots

↓

Add Features

↓

Publish

↓

Product automatically appears on website.

If admin changes the APK link:

Website automatically uses the new APK link.

If admin changes the logo:

Website automatically displays the new logo.

If admin changes the description:

Website automatically displays the updated description.

No code deployment should be required for normal product content updates.

26. FUTURE PRODUCT SUPPORT

IMPORTANT:

The initial public website must contain ONLY:

Prompt Verse

TubePilot

Nexa Browser

However, the CMS must support unlimited future products.

When the admin creates a new product through:

Admin → Products → Add Product

the new product should automatically appear on:

Products page

Product listing

Navigation/product sections where appropriate

Search

Dynamic product detail page

No developer intervention should be required.

27. SEARCH

Add a simple product search.

Search by:

Product name

Category

Description

Only published products should appear in public search.

28. ANALYTICS-READY ARCHITECTURE

Create clean architecture so analytics can be added later.

Do NOT add fake analytics.

Do NOT show fake visitors/download numbers.

Leave the architecture ready for:

Product page views

APK link clicks

Website clicks

External link clicks

29. ERROR STATES

Create proper UI for:

404 page

Product not found

Loading

Database error

Network error

Empty product list

Unauthorized admin access

Admin session expired

Upload failure

Invalid URL

30. MOBILE RESPONSIVENESS

The website must work perfectly on:

Mobile

Tablet

Laptop

Desktop

Admin panel must also be mobile responsive.

No horizontal scrolling.

No clipped text.

No oversized logos.

Product cards must adapt automatically.

31. FINAL PRODUCT EXPERIENCE

A visitor should understand within 5 seconds:

Who are we?

Bharat Cloud Technologies

What do we build?

AI, software, apps and automation.

When did we start?

2020

What products are currently available?

Prompt Verse, TubePilot and Nexa Browser

Where are we building from?

India 🇮🇳

What can the visitor do?

Explore our products.

32. IMPORTANT DEVELOPMENT RULES

Do not generate fake APIs.

Do not generate fake product data.

Do not hardcode APK URLs.

Do not hardcode product logos.

Do not hardcode product descriptions.

Do not hardcode social URLs.

Do not create fake testimonials.

Do not create fake statistics.

Do not claim unsupported partnerships.

Do not claim unsupported awards.

Do not claim unsupported certifications.

Do not add GrowPilot AI.

Do not add GrowAlert AI.

Do not add any other products to the initial public website.

Everything that changes frequently must be manageable through the Admin CMS.

Build the website and admin panel as a clean, maintainable, scalable production-ready application.

The final result should look like a serious technology/product company website, not a freelancer portfolio.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bharatcloudtechnologies.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/342839a8-e188-4d0b-8b39-2439448ada26).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
