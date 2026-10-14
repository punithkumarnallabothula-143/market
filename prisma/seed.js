const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FrameMarket database...');

  // Clean existing demo data if any
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.downloadRecord.deleteMany();
  await prisma.license.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.refundRequest.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.productFile.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.payoutRequest.deleteMany();
  await prisma.creatorApplication.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.user.deleteMany();
  await prisma.commissionSetting.deleteMany();

  // Create Commission Setting
  await prisma.commissionSetting.create({
    data: {
      ratePercentage: 10.0,
      minFee: 0,
      active: true,
    },
  });

  // Default Passwords (hashed with bcrypt)
  const adminPass = await bcrypt.hash('AdminPassword123!', 10);
  const creatorPass = await bcrypt.hash('CreatorPassword123!', 10);
  const buyerPass = await bcrypt.hash('BuyerPassword123!', 10);

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@framemarket.dev',
      passwordHash: adminPass,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Head of Marketplace Operations at FrameMarket.',
    },
  });

  // 2. Creator Users
  const creatorElena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@framemarket.dev',
      passwordHash: creatorPass,
      role: 'CREATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Award-winning digital designer specializing in high-converting SaaS landing pages and clean Framer interactions.',
      creatorProfile: {
        create: {
          storeName: 'Apex Design Studio',
          bio: 'Crafting the next generation of SaaS & AI Framer templates for high-growth tech companies.',
          website: 'https://apexdesign.dev',
          twitter: 'https://twitter.com/elenarostova',
          framerProfile: 'https://framer.com/@elena-apex',
          verified: true,
          totalSales: 142,
          netEarnings: 298000,
          payoutMethod: 'UPI',
          payoutDetails: JSON.stringify({ upiId: 'elena@okhdfcbank', recipientName: 'Elena Rostova' }),
        },
      },
    },
    include: { creatorProfile: true },
  });

  const creatorMarco = await prisma.user.create({
    data: {
      name: 'Marco Silva',
      email: 'marco@framemarket.dev',
      passwordHash: creatorPass,
      role: 'CREATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Senior UX Architect and Framer Certified Partner building hyper-minimalist portfolios and agency themes.',
      creatorProfile: {
        create: {
          storeName: 'PixelCraft Lab',
          bio: 'Minimal, bold, and typography-driven websites built for modern creative agencies.',
          website: 'https://pixelcraftlab.design',
          twitter: 'https://twitter.com/marcosilva',
          framerProfile: 'https://framer.com/@pixelcraft',
          verified: true,
          totalSales: 89,
          netEarnings: 185000,
          payoutMethod: 'BANK',
          payoutDetails: JSON.stringify({ bankName: 'HDFC Bank', accountNumber: '5010049281729', ifsc: 'HDFC0001234' }),
        },
      },
    },
    include: { creatorProfile: true },
  });

  const creatorAisha = await prisma.user.create({
    data: {
      name: 'Aisha Patel',
      email: 'aisha@framemarket.dev',
      passwordHash: creatorPass,
      role: 'CREATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Product Designer & Framer enthusiast building AI tools & startup templates.',
      creatorProfile: {
        create: {
          storeName: 'Minimalist Framer',
          bio: 'Beautiful, component-driven Framer templates with dynamic CMS and micro-interactions.',
          website: 'https://aishadesign.co',
          twitter: 'https://twitter.com/aishapatel',
          framerProfile: 'https://framer.com/@aishadesign',
          verified: true,
          totalSales: 64,
          netEarnings: 124000,
          payoutMethod: 'UPI',
          payoutDetails: JSON.stringify({ upiId: 'aisha@icici', recipientName: 'Aisha Patel' }),
        },
      },
    },
    include: { creatorProfile: true },
  });

  const creatorDavid = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'david@framemarket.dev',
      passwordHash: creatorPass,
      role: 'CREATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Design engineer creating modern mobile app landing pages and luxury brand templates.',
      creatorProfile: {
        create: {
          storeName: 'HyperFlow UI',
          bio: 'Futuristic animations, high performance, and silky smooth layouts for iOS and web startups.',
          website: 'https://hyperflow.tech',
          twitter: 'https://twitter.com/davidkim_ui',
          framerProfile: 'https://framer.com/@hyperflow',
          verified: false,
          totalSales: 31,
          netEarnings: 59000,
          payoutMethod: 'BANK',
          payoutDetails: JSON.stringify({ bankName: 'Axis Bank', accountNumber: '9120100482910', ifsc: 'UTIB0000456' }),
        },
      },
    },
    include: { creatorProfile: true },
  });

  // 3. Buyer User
  const buyerUser = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'buyer@framemarket.dev',
      passwordHash: buyerPass,
      role: 'BUYER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Founder & Tech Lead looking for world-class web templates.',
    },
  });

  // 4. Categories
  const categoriesData = [
    { name: 'SaaS & Startups', slug: 'saas-startups', description: 'Templates tailored for modern software companies, venture-backed startups, and B2B platforms.', icon: 'Laptop', displayOrder: 1 },
    { name: 'Portfolios', slug: 'portfolios', description: 'Personal showcase and resume templates for designers, developers, photographers, and creatives.', icon: 'Briefcase', displayOrder: 2 },
    { name: 'Agency Websites', slug: 'agency-websites', description: 'Bold agency portfolios and studio landing pages with interactive case studies.', icon: 'Building2', displayOrder: 3 },
    { name: 'E-commerce', slug: 'ecommerce', description: 'Online store and product launch templates with cart flows and Framer CMS inventory.', icon: 'ShoppingBag', displayOrder: 4 },
    { name: 'Personal Brands', slug: 'personal-brands', description: 'Executive, creator, speaker, and consultant personal websites with newsletter capture.', icon: 'UserCheck', displayOrder: 5 },
    { name: 'Landing Pages', slug: 'landing-pages', description: 'High-conversion single page websites with dynamic hero sections and waitlist modules.', icon: 'Rocket', displayOrder: 6 },
    { name: 'Blogs & Publications', slug: 'blogs-publications', description: 'Clean editorial templates optimized for reading, typography, and Framer CMS articles.', icon: 'BookOpen', displayOrder: 7 },
    { name: 'AI & Technology', slug: 'ai-technology', description: 'Futuristic dark-mode themes designed for artificial intelligence, machine learning, and robotics.', icon: 'Cpu', displayOrder: 8 },
    { name: 'Real Estate', slug: 'real-estate', description: 'Luxury architecture, property showcase, and real estate brokerage templates.', icon: 'Home', displayOrder: 9 },
    { name: 'Mobile App Websites', slug: 'mobile-app-websites', description: 'App Store showcase landing pages with 3D device mockups and feature walkthroughs.', icon: 'Smartphone', displayOrder: 10 },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = createdCat.id;
  }

  // Tags
  const tagsList = ['Dark Mode', 'Light Mode', 'Framer CMS', 'Responsive', 'Micro-interactions', 'Free', '3D Elements', 'Clean Code', 'SEO Optimized', 'Tailored Animations'];
  const tagMap = {};
  for (const tagName of tagsList) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const createdTag = await prisma.tag.create({
      data: { name: tagName, slug },
    });
    tagMap[slug] = createdTag.id;
  }

  // 5. Seed 12 Detailed Templates
  const products = [
    {
      slug: 'nova-saas-landing-page',
      title: 'Nova SaaS Landing Page',
      shortDesc: 'A hyper-polished, conversion-optimized Framer template designed for next-gen B2B SaaS and AI products.',
      description: 'Nova is crafted with precision to turn visitors into paying customers. It includes interactive pricing tiers, customer testimonial carousels, customizable feature grids, dynamic CMS blog, and a high-converting waitlist form.\n\nEvery element uses auto-layout and responsive breakpoints, ready to customize in seconds directly inside Framer.',
      price: 2499,
      isFree: false,
      discountPrice: 1999,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://nova-saas-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=nova-saas-remix-sample',
      categoryId: categoryMap['saas-startups'],
      creatorId: creatorElena.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: true,
      salesCount: 84,
      viewsCount: 3420,
      rating: 4.9,
      reviewCount: 28,
      includedPages: JSON.stringify(['Home', 'Features', 'Pricing', 'About Us', 'Blog CMS', 'Blog Post Detail', 'Contact', '404 Page']),
      features: JSON.stringify(['Dynamic Interactive Pricing Calculator', 'Full Framer CMS Integration', 'Smooth Scroll & Velocity Animations', 'Pre-configured SEO metadata', 'Dark & Light Mode Variants']),
      compatibility: 'Framer 2024+, Zero Coding Required, 100% Responsive',
      setupInstructions: '1. Click Remix link provided upon purchase.\n2. Add the template to your Framer workspace.\n3. Replace logos, text, and pricing values.\n4. Connect custom domain and hit publish!',
      licenseType: 'Standard',
      tags: ['dark-mode', 'framer-cms', 'responsive', 'seo-optimized'],
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Nova-SaaS-Framer-Bundle-v2.1.zip',
      fileSizeBytes: 48200000,
    },
    {
      slug: 'minimal-portfolio',
      title: 'Minimal Portfolio',
      shortDesc: 'Monochrome, typography-first Framer template for senior designers, creative directors, and architects.',
      description: 'Let your work speak for itself. Minimal Portfolio offers full-screen project cases, smooth page transitions, sticky project metadata, and a client inquiry modal. Built with clean CSS variables and modular components.',
      price: 1499,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://minimal-portfolio-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=minimal-portfolio-remix-sample',
      categoryId: categoryMap['portfolios'],
      creatorId: creatorMarco.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: false,
      salesCount: 52,
      viewsCount: 2150,
      rating: 5.0,
      reviewCount: 19,
      includedPages: JSON.stringify(['Home Showcase', 'Case Study Detail', 'Archive Grid', 'About & Resume', 'Contact']),
      features: JSON.stringify(['Grid / List Layout Toggle', 'Smooth Image Magnification', 'Framer CMS for Case Studies', 'Custom Cursor Effects']),
      compatibility: 'Framer 2024+, Mobile & Tablet Breakpoints included',
      setupInstructions: 'Duplicate into Framer, upload your project screenshots in the CMS collection, and publish in 5 minutes.',
      licenseType: 'Standard',
      tags: ['clean-code', 'framer-cms', 'responsive', 'micro-interactions'],
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Minimal-Portfolio-Package-v1.4.zip',
      fileSizeBytes: 24500000,
    },
    {
      slug: 'orbit-ai-startup',
      title: 'Orbit AI Startup',
      shortDesc: 'Futuristic, dark-themed Framer template built specifically for AI agents, LLM apps, and developer tools.',
      description: 'Orbit features glowing radial gradients, 3D interactive floating badges, terminal mockups, and dynamic prompt playgrounds. Engineered to impress venture capitalists and enterprise buyers.',
      price: 3499,
      isFree: false,
      discountPrice: 2999,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://orbit-ai-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=orbit-ai-remix-sample',
      categoryId: categoryMap['ai-technology'],
      creatorId: creatorAisha.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: true,
      salesCount: 61,
      viewsCount: 4100,
      rating: 4.8,
      reviewCount: 22,
      includedPages: JSON.stringify(['Hero Landing', 'Docs Preview', 'Live Playground', 'Pricing Table', 'Security & Enterprise', 'Blog CMS']),
      features: JSON.stringify(['Interactive Code & Prompt Sandbox', 'Glowing Gradient Shaders', 'Framer Component Variants', 'Copy-to-Clipboard Integrations']),
      compatibility: 'Framer 2024+, Zero Coding Required',
      setupInstructions: 'Remix project into Framer workspace, insert your product screenshots, configure contact links and launch.',
      licenseType: 'Standard',
      tags: ['dark-mode', '3d-elements', 'tailored-animations', 'responsive'],
      images: [
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Orbit-AI-Framer-Release.zip',
      fileSizeBytes: 62100000,
    },
    {
      slug: 'studio-creative-agency',
      title: 'Studio Creative Agency',
      shortDesc: 'A high-energy, award-winning agency template with magnetic cursor effects and 60fps scroll animations.',
      description: 'Designed for brand studios, digital agencies, and production houses. Showcases client reels, interactive awards banner, team profiles, and dynamic service request forms.',
      price: 2999,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://studio-creative-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=studio-creative-remix-sample',
      categoryId: categoryMap['agency-websites'],
      creatorId: creatorMarco.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: true,
      salesCount: 37,
      viewsCount: 1890,
      rating: 4.9,
      reviewCount: 14,
      includedPages: JSON.stringify(['Home Agency', 'Works Grid', 'Single Case Study', 'Services & Pricing', 'About Collective', 'Contact']),
      features: JSON.stringify(['Magnetic Interactive Buttons', 'Sticky Horizontal Reel Section', 'Rich Case Study CMS', 'Video Backgrounds']),
      compatibility: 'Framer 2024+, All Modern Browsers',
      setupInstructions: 'Import into Framer, configure video URLs and CMS items, deploy directly to custom domain.',
      licenseType: 'Standard',
      tags: ['tailored-animations', 'framer-cms', 'micro-interactions'],
      images: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Studio-Agency-Framer.zip',
      fileSizeBytes: 39000000,
    },
    {
      slug: 'elevate-real-estate',
      title: 'Elevate Real Estate',
      shortDesc: 'Luxury architecture, property showcase, and boutique real estate brokerage template.',
      description: 'Elevate combines clean editorial layouts with virtual tour embeddings, neighborhood map highlights, property specification filters, and booking inquiry workflows.',
      price: 3999,
      isFree: false,
      discountPrice: 3299,
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://elevate-realty-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=elevate-realty-remix-sample',
      categoryId: categoryMap['real-estate'],
      creatorId: creatorElena.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: false,
      salesCount: 28,
      viewsCount: 1420,
      rating: 4.7,
      reviewCount: 11,
      includedPages: JSON.stringify(['Properties Overview', 'Single Listing Page', 'Developments', 'Agent Directory', 'Mortgage Calculator', 'Inquiry']),
      features: JSON.stringify(['Framer CMS Listing Database', 'Interactive Floorplan Viewer', 'Direct WhatsApp / Email Agent Routing', 'Google Maps Embed Ready']),
      compatibility: 'Framer 2024+, Desktop & Mobile First',
      setupInstructions: 'Connect your property listings to the built-in Framer CMS table and update contact info.',
      licenseType: 'Standard',
      tags: ['framer-cms', 'responsive', 'seo-optimized'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Elevate-RealEstate-Framer.zip',
      fileSizeBytes: 54000000,
    },
    {
      slug: 'commerce-product-launch',
      title: 'Commerce Product Launch',
      shortDesc: 'High-converting physical and digital product landing page with sticky checkout callout and FAQ tabs.',
      description: 'Ideal for Kickstarter campaigns, direct-to-consumer hardware, fashion drops, and single-product brands. Features 360-degree product image rotation, color variant pickers, and customer photo reviews.',
      price: 2199,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://commerce-launch-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=commerce-launch-remix-sample',
      categoryId: categoryMap['ecommerce'],
      creatorId: creatorDavid.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: true,
      salesCount: 45,
      viewsCount: 2800,
      rating: 4.8,
      reviewCount: 16,
      includedPages: JSON.stringify(['Product Showcase Home', 'Specs & Materials', 'Press Mentions', 'Reviews Gallery', 'Checkout Overlay', 'FAQ']),
      features: JSON.stringify(['Interactive Color Swatch Selector', 'Sticky Buy Bar on Scroll', 'Shopify & Stripe Buy Button Integration', 'Accordion FAQ']),
      compatibility: 'Framer 2024+, Zero Coding Required',
      setupInstructions: 'Add your product photography, set variant options, link your Stripe or Shopify buy buttons.',
      licenseType: 'Standard',
      tags: ['micro-interactions', 'responsive', 'clean-code'],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Commerce-Launch-Framer.zip',
      fileSizeBytes: 31000000,
    },
    {
      slug: 'mono-personal-portfolio',
      title: 'Mono Personal Portfolio',
      shortDesc: 'Clean, open-source inspired personal portfolio template available completely free.',
      description: 'Mono is a clean and lightweight portfolio template featuring a split layout, timeline resume, writing section powered by CMS, and social links. Completely free for community use.',
      price: 0,
      isFree: true,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://mono-portfolio-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=mono-portfolio-remix-sample',
      categoryId: categoryMap['personal-brands'],
      creatorId: creatorAisha.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: true,
      salesCount: 310,
      viewsCount: 8400,
      rating: 4.9,
      reviewCount: 52,
      includedPages: JSON.stringify(['Home Bio', 'Writing CMS', 'Post Detail', 'Projects Archive', 'Uses Page']),
      features: JSON.stringify(['100% Free Forever', 'Fast Loading Time (<0.5s)', 'Markdown CMS Compatible', 'Social Preview Generator']),
      compatibility: 'Framer 2024+, Desktop & Mobile First',
      setupInstructions: 'Click free download or remix link, fill in your bio and projects, hit publish.',
      licenseType: 'Standard',
      tags: ['free', 'light-mode', 'clean-code', 'framer-cms'],
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Mono-Free-Portfolio-v1.zip',
      fileSizeBytes: 12000000,
    },
    {
      slug: 'flow-analytics-dashboard',
      title: 'Flow Analytics Dashboard',
      shortDesc: 'Modern SaaS application marketing website with live dashboard previews and interactive UI widgets.',
      description: 'Flow gives data and fintech startups a world-class presence. Comes with interactive chart mocks, metric cards, role-based feature tours, and customer stories.',
      price: 2799,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://flow-analytics-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=flow-analytics-remix-sample',
      categoryId: categoryMap['saas-startups'],
      creatorId: creatorElena.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: false,
      salesCount: 42,
      viewsCount: 2200,
      rating: 4.8,
      reviewCount: 15,
      includedPages: JSON.stringify(['Home Dashboard', 'Interactive Tour', 'Integrations Hub', 'Changelog CMS', 'Pricing', 'Sign Up']),
      features: JSON.stringify(['Interactive Chart Mockups', 'Filterable Integration Directory', 'Searchable Changelog CMS', 'Subtle Gradient Accents']),
      compatibility: 'Framer 2024+, Zero Code',
      setupInstructions: 'Remix into Framer, configure integrations list in CMS, publish instantly.',
      licenseType: 'Standard',
      tags: ['responsive', 'framer-cms', 'dark-mode'],
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Flow-Analytics-Marketing.zip',
      fileSizeBytes: 42000000,
    },
    {
      slug: 'pixel-design-studio',
      title: 'Pixel Design Studio',
      shortDesc: 'Expressive and colorful portfolio template built for 3D animators, motion artists, and graphic designers.',
      description: 'Pixel features bold headlines, fluid cursor tracking, video hover states, and dynamic project filtering. Perfect for creatives who want their unique personality to stand out.',
      price: 1899,
      isFree: false,
      discountPrice: 1499,
      coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://pixel-studio-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=pixel-studio-remix-sample',
      categoryId: categoryMap['portfolios'],
      creatorId: creatorMarco.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: false,
      salesCount: 33,
      viewsCount: 1650,
      rating: 5.0,
      reviewCount: 13,
      includedPages: JSON.stringify(['Homepage Showreel', 'Gallery Grid', 'Project Detail', 'About the Artist', 'Booking']),
      features: JSON.stringify(['Video Canvas Support', 'Interactive Hover Previews', 'Tag Filtering for Mediums', 'Custom Favicons']),
      compatibility: 'Framer 2024+, Fully Responsive',
      setupInstructions: 'Duplicate project, link your Vimeo / MP4 videos or images in the CMS, customize branding.',
      licenseType: 'Standard',
      tags: ['micro-interactions', '3d-elements', 'tailored-animations'],
      images: [
        'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Pixel-Studio-Template.zip',
      fileSizeBytes: 36000000,
    },
    {
      slug: 'zenith-mobile-app-landing-page',
      title: 'Zenith Mobile App Landing Page',
      shortDesc: 'Sleek iOS and Android app presentation template with interactive phone screen carousel and QR code badge.',
      description: 'Zenith helps founders launch mobile apps with confidence. Contains App Store / Google Play download buttons, interactive device frames, testimonial slides, and security badges.',
      price: 1999,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://zenith-app-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=zenith-app-remix-sample',
      categoryId: categoryMap['mobile-app-websites'],
      creatorId: creatorDavid.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: false,
      salesCount: 49,
      viewsCount: 2900,
      rating: 4.8,
      reviewCount: 17,
      includedPages: JSON.stringify(['App Landing Page', 'Release Notes CMS', 'Privacy & Legal', 'Support Center', 'Media Kit']),
      features: JSON.stringify(['Interactive iPhone 16 Frame Mockup', 'Direct QR Code Download Popup', 'App Store Badges Included', 'Fast 60fps Scroll Animations']),
      compatibility: 'Framer 2024+, Optimized for Retina Displays',
      setupInstructions: 'Swap in your app screenshots, set your App Store links, and launch in minutes.',
      licenseType: 'Standard',
      tags: ['responsive', 'micro-interactions', 'seo-optimized'],
      images: [
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Zenith-App-Landing.zip',
      fileSizeBytes: 33000000,
    },
    {
      slug: 'atlas-consulting',
      title: 'Atlas Consulting',
      shortDesc: 'Authoritative, trust-inspiring corporate and management consulting website template.',
      description: 'Atlas is built for boutique consultancies, financial advisors, and executive coaches. Emphasizes client outcomes, thought leadership articles, case study metrics, and lead generation.',
      price: 2699,
      isFree: false,
      discountPrice: null,
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://atlas-consulting-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=atlas-consulting-remix-sample',
      categoryId: categoryMap['landing-pages'],
      creatorId: creatorElena.id,
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: false,
      salesCount: 22,
      viewsCount: 1200,
      rating: 4.7,
      reviewCount: 9,
      includedPages: JSON.stringify(['Corporate Home', 'Practice Areas', 'Case Studies CMS', 'Insights & Reports', 'Leadership Team', 'Schedule Consultation']),
      features: JSON.stringify(['Calendly / Cal.com Embed Ready', 'Downloadable Whitepaper Gating Form', 'Responsive Mega Menu', 'Searchable Insights CMS']),
      compatibility: 'Framer 2024+, Accessible WCAG Compliant',
      setupInstructions: 'Import into Framer, configure your booking link and publication articles, point to custom domain.',
      licenseType: 'Standard',
      tags: ['light-mode', 'framer-cms', 'clean-code'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Atlas-Consulting-Package.zip',
      fileSizeBytes: 44000000,
    },
    {
      slug: 'bloom-lifestyle-brand',
      title: 'Bloom Lifestyle Brand',
      shortDesc: 'Warm, organic, and elegant website template for wellness, hospitality, interior design, and lifestyle brands.',
      description: 'Bloom evokes warmth and luxury through generous negative space, earthy palettes, and delicate serif typography. Includes newsletter modal, Instagram reel grid, and booking scheduler.',
      price: 2299,
      isFree: false,
      discountPrice: 1799,
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
      previewUrl: 'https://bloom-lifestyle-demo.framer.website',
      framerRemixUrl: 'https://framer.com/projects/new?duplicate=bloom-lifestyle-remix-sample',
      categoryId: categoryMap['personal-brands'],
      creatorId: creatorAisha.id,
      status: 'PUBLISHED',
      isFeatured: true,
      isTrending: false,
      salesCount: 38,
      viewsCount: 2340,
      rating: 4.9,
      reviewCount: 18,
      includedPages: JSON.stringify(['Brand Home', 'Offerings & Retreats', 'Journal CMS', 'Press & Accolades', 'Newsletter Signup', 'Contact Concierge']),
      features: JSON.stringify(['Curated Editorial Typography', 'Framer CMS Journal', 'Integrated Mailchimp / ConvertKit Hook', 'Smooth Image Reveals']),
      compatibility: 'Framer 2024+, Zero Coding Required',
      setupInstructions: 'Remix into Framer workspace, insert your photography, configure booking email, and launch.',
      licenseType: 'Standard',
      tags: ['light-mode', 'framer-cms', 'responsive'],
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
      ],
      fileName: 'Bloom-Lifestyle-Framer.zip',
      fileSizeBytes: 37500000,
    },
  ];

  for (const p of products) {
    const { tags, images, fileName, fileSizeBytes, ...productData } = p;
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    // Create file
    await prisma.productFile.create({
      data: {
        productId: createdProduct.id,
        fileName,
        fileSizeBytes,
        downloadUrl: `/api/downloads/${createdProduct.id}`,
        version: '1.0.0',
      },
    });

    // Create images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          displayOrder: i + 1,
        },
      });
    }

    // Connect tags
    for (const tagSlug of tags) {
      if (tagMap[tagSlug]) {
        await prisma.productTag.create({
          data: {
            productId: createdProduct.id,
            tagId: tagMap[tagSlug],
          },
        });
      }
    }

    // Add 2 verified reviews for social proof
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: buyerUser.id,
        rating: 5,
        comment: 'Exceptionally well-structured Framer project! Saved our team over 40 hours of design and interaction setup.',
        isVerifiedPurchase: true,
      },
    });
  }

  // 6. Seed sample order & license for buyer
  const sampleProduct = await prisma.product.findFirst({ where: { slug: 'nova-saas-landing-page' } });
  if (sampleProduct) {
    const orderNumber = 'FM-ORD-2026-90412';
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: buyerUser.id,
        status: 'COMPLETED',
        subtotal: sampleProduct.price,
        discount: 0,
        fee: 0,
        tax: 0,
        total: sampleProduct.price,
        currency: 'INR',
        paymentMethod: 'DEMO',
        providerTransactionId: 'txn_demo_984102941',
        items: {
          create: {
            productId: sampleProduct.id,
            price: sampleProduct.price,
            licenseType: 'Standard',
          },
        },
        payments: {
          create: {
            provider: 'DEMO',
            status: 'SUCCEEDED',
            amount: sampleProduct.price,
            currency: 'INR',
            transactionId: 'txn_demo_984102941',
          },
        },
        licenses: {
          create: {
            licenseKey: 'FM-LIC-NOVA-882194-STD',
            productId: sampleProduct.id,
            userId: buyerUser.id,
            licenseType: 'Standard',
            status: 'ACTIVE',
          },
        },
      },
    });

    // Create download record
    await prisma.downloadRecord.create({
      data: {
        orderId: sampleOrder.id,
        productId: sampleProduct.id,
        userId: buyerUser.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    // Create a favorite
    await prisma.favorite.create({
      data: {
        userId: buyerUser.id,
        productId: sampleProduct.id,
      },
    });
  }

  // Seed sample payout request for Elena
  if (creatorElena.creatorProfile) {
    await prisma.payoutRequest.create({
      data: {
        creatorId: creatorElena.creatorProfile.id,
        amount: 25000,
        currency: 'INR',
        status: 'PROCESSING',
        paymentMethod: 'UPI',
        transactionRef: 'UPI-REF-20261014-9912',
        adminNote: 'Scheduled for automatic batch processing.',
      },
    });
  }

  // Seed sample creator application
  await prisma.creatorApplication.create({
    data: {
      userId: buyerUser.id,
      portfolioUrl: 'https://dribbble.com/alexmorgan',
      framerExperience: '3 years of advanced Framer prototyping and component design',
      motivation: 'I want to distribute my micro-interactions and startup landing page kits to the global creator economy.',
      status: 'PENDING',
    },
  });

  // Seed audit log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entity: 'Platform',
      metadata: JSON.stringify({ version: '1.0.0', seededProducts: 12 }),
    },
  });

  console.log('Seeding completed successfully!');
  console.log('--- DEMO CREDENTIALS ---');
  console.log('Admin:   admin@framemarket.dev    / AdminPassword123!');
  console.log('Creator: elena@framemarket.dev    / CreatorPassword123!');
  console.log('Creator: marco@framemarket.dev    / CreatorPassword123!');
  console.log('Buyer:   buyer@framemarket.dev    / BuyerPassword123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
