import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { BlogPost } from "./src/types.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// Curated pool of high-quality Unsplash image IDs for vibrant topic illustration
const IMAGE_LIBRARY = {
  hiking: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  desert: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  fashion: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
  tech: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  flight: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  adventure: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  design: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
  nature: "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=1200&q=80"
};

const AUTHOR_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80"
];

function getRandomAvatar(): string {
  return AUTHOR_AVATARS[Math.floor(Math.random() * AUTHOR_AVATARS.length)];
}

function mapImageKeyword(keyword?: string): string {
  if (!keyword) return IMAGE_LIBRARY.adventure;
  const normalized = keyword.toLowerCase().trim();
  
  for (const [key, url] of Object.entries(IMAGE_LIBRARY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }
  
  // Hash-based selection for consistency
  const keys = Object.keys(IMAGE_LIBRARY) as Array<keyof typeof IMAGE_LIBRARY>;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % keys.length;
  return IMAGE_LIBRARY[keys[index]];
}

// Initial default posts preloaded to reflect the attached mockup layout exactly in full English
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "hiking-wonders",
    title: "Exploring the Wonders of Hiking",
    summary: "An iconic guide to the trails, uncovering the secrets that make hiking a transformative experience for every traveler.",
    content: `# Exploring the Wonders of Hiking

There is something profoundly spiritual about the act of walking through nature. When we leave behind the concrete of cities and step onto trails sculpted by wind and water, we enter a different realm—one governed by the steady rhythm of the sun and the breeze.

## The Art of Disconnecting to Connect

Hiking is not merely a physical activity; it is an exercise in mindfulness. Every step requires awareness: the way your foot finds traction on loose gravel, the subtle shift in weight when climbing a sandstone ridge, the crisp air filling your lungs. By focusing on the immediate present, the noise of mobile notifications and to-do lists fades away.

> "In every walk with nature, one receives far more than he seeks." — John Muir

### Essential Preparation Tips

To make your journey truly unforgettable, meticulous planning is vital:

*   **Smart Hydration**: Water is your most valuable resource. Drink proactively; do not wait until you are thirsty.
*   **Dress in Layers**: Mountain weather changes rapidly. A windproof and waterproof outer layer can make all the difference.
*   **Reliable Navigation**: Even if you rely on digital maps on your phone, carry a printed map and a compass. Mobile reception often disappears where real adventure begins.

## The Psychological Impact of Altitudes

Neuroscientific studies have shown that spending time in natural environments drastically reduces cortisol levels (the stress hormone) and stimulates creativity. Contemplating the vastness of a canyon or the distant silhouette of a mountain range helps us put our own challenges into perspective. We discover that the simplicity of a good trail is often the most effective cure for modern exhaustion.
`,
    category: "Destination",
    author: {
      name: "Theodore Reginald",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Landscape photographer and outdoor enthusiast. Has hiked the most challenging trails from the Andes to the Rockies."
    },
    date: "24 Jan 2024",
    readTime: "10 mins read",
    imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: true
  },
  {
    id: "sedona-valley",
    title: "Sedona Valley: A Journey Through Red Rocks",
    summary: "Discover the mysticism and breathtaking natural beauty of the red sandstone canyons in the American Southwest.",
    content: `# Sedona Valley: A Journey Through Red Rocks

Sedona, Arizona, is a place of undeniable enchantment. The colossal formations of orange and red sandstone glow with an almost supernatural brilliance during sunrise and sunset, creating a sculpted landscape that draws spiritual seekers, artists, and hikers from across the globe.

## The Geology Behind the Color

The vivid red hue of Sedona's canyons is due to iron oxide deposits in the layers of Schnebly Hill sandstone and limestone. Formed over 300 million years ago, these spectacular structures are a visual testament to ancient oceans and shifting sand dunes that once covered this territory.

### Must-Visit Landmarks

If you are planning an escape to Sedona, you cannot miss these iconic spots:

1.  **Cathedral Rock**: Perhaps the most photographed formation in the region. The climb is steep, but the panoramic view at the top is absolutely spectacular.
2.  **Bell Rock**: Renowned as one of the valley's strongest energetic vortexes, it offers accessible trails and stunning vistas.
3.  **Devil's Bridge**: The largest natural sandstone arch bridge in the area, perfect for capturing breathtaking photographs above the canyon.

## Respecting a Fragile Environment

The Arizona desert is an incredibly delicate ecosystem. Cryptobiotic soil, vital for moisture retention and plant life, can take decades to recover if stepped on. Always stay on marked trails and practice *Leave No Trace* principles. By doing so, this magical red paradise will continue to inspire future generations of explorers.
`,
    category: "Destination",
    author: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Geologist and independent travel writer, deeply passionate about desert wildlife conservation."
    },
    date: "18 Jan 2024",
    readTime: "7 mins read",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  },
  {
    id: "kyoto-slow-travel",
    title: "Kyoto Rediscovered: A Slow Traveler's Guide",
    summary: "Immerse yourself in the quiet beauty of ancient temples, tranquil stone gardens, and the delicate art of the traditional Japanese tea ceremony.",
    content: `# Kyoto Rediscovered: A Slow Traveler's Guide

In a world that rushes from one landmark to another, Kyoto demands a different approach. The ancient capital of Japan, home to thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses, is best experienced at a meditative pace.

## The Philosophy of Yugen and Ma

To truly appreciate Kyoto, one must understand two Japanese concepts: *Yugen* (a profound, mysterious grace) and *Ma* (the artistic interpretation of empty space). These ideas are woven into the very fabric of the city's architecture and gardens.

> "Kyoto is the historical heart of Japan, where every cobblestone tells a story and every garden is a canvas of contemplation."

### Curated Slow Itinerary

To capture the essence of Kyoto without the crowds, consider these intentional steps:

*   **Dawn at Arashiyama**: Wander the famous bamboo groves at sunrise. The gentle rustling of the towering stalks in the morning breeze is a natural symphony.
*   **The Dry Landscape Gardens**: Visit *Ryoan-ji* or *Tofuku-ji*. Sit quietly on the wooden verandas and study the raked gravel and moss-covered stones. They are designed to mirror islands in an infinite sea.
*   **The Tea Ceremony (Chado)**: Participate in a formal tea preparation. The exquisite focus on heating water, whisking matcha, and presenting the bowl is a masterclass in living in the present.

## Savoring the Flow of Seasons

Whether it is the delicate pink cherry blossoms of spring (*sakura*) or the fiery red maple leaves of autumn (*momiji*), Kyoto celebrates the impermanence of beauty. Slow travel here means stopping to watch a single leaf drift down a canal or enjoying a quiet bowl of wild vegetable soba in a traditional Machiya town house. It is in these unhurried moments that Kyoto reveals its true, timeless soul.
`,
    category: "Destination",
    author: {
      name: "Kenji Sato",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Kyoto-based travel guide and cultural historian dedicated to preserving ancient Japanese aesthetic philosophies."
    },
    date: "15 Jan 2024",
    readTime: "9 mins read",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: true
  },
  {
    id: "minimalist-wardrobe",
    title: "The Minimalist Wardrobe: Curating Timeless Style",
    summary: "Learn how choosing high-quality, timeless essentials can simplify your morning decisions and elevate your personal aesthetic.",
    content: `# The Minimalist Wardrobe: Curating Timeless Style

We live in a world obsessed with speed and accumulation. The fast fashion industry urges us to buy constantly, filling our closets with cheap, low-quality garments that rarely last more than a single season. In response, the minimalist capsule wardrobe movement emerges as a breath of fresh air and a return to conscious sophistication.

## Fewer Decisions, Elevated Style

The core concept of textile minimalism is simple: own fewer, higher-quality items that complement each other perfectly. By reducing the visual choices in our closet to pieces we love and that fit us beautifully, we eliminate morning decision fatigue and project a cohesive, intentional image.

### The Leather Jacket: A Timeless Anchor

If you had to pick a single piece of clothing to define versatility, it would be a well-crafted leather jacket. It is not just a garment; it is an investment that tells a personal story as it ages.

*   **Durability**: Unlike synthetic materials, genuine leather develops a unique patina and becomes softer and more comfortable over the years.
*   **Complete Versatility**: Pair it with simple denim for a relaxed weekend look, or drape it over an elegant dress to add a contemporary, edgy touch.
*   **Seasonal Transition**: It serves as the perfect transition piece between seasons, protecting you from cool breezes without adding unnecessary bulk.

## Curating Your Own Collection

Decluttering your closet can feel overwhelming. The secret is a ruthless audit: keep only the pieces you have worn in the last six months, that fit your current size, and that make you feel genuinely confident. A curated wardrobe is not a limitation; it is a statement of intent and respect for our planet's resources.
`,
    category: "Lifestyle",
    author: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Editorial stylist and sustainable fashion consultant promoting smart textile consumption."
    },
    date: "12 Jan 2024",
    readTime: "5 mins read",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  },
  {
    id: "slow-morning-routine",
    title: "The Psychology of a Slow Morning",
    summary: "Discover how establishing a mindful, tech-free morning ritual can reduce daily anxiety and enhance your focus.",
    content: `# The Psychology of a Slow Morning

How we begin our day sets the emotional tone for everything that follows. In our hyper-connected world, most people reach for their smartphones within seconds of waking up, instantly flooding their brains with work emails, global news, and social media feeds. This practice triggers an immediate spike in cortisol, putting us in a reactive, anxious state before our feet even touch the floor.

## Reclaiming the First Golden Hour

A slow morning routine is not about waking up at 4:00 AM or completing an exhaustive list of tasks. It is about creating a sacred window of time where you are fully in control of your inputs.

> "The way you start your morning determines the quality of your day."

### Pillars of an Intentional Morning

*   **The Tech-Free Boundary**: Keep your phone in another room overnight. Do not touch any digital screens for the first 30 to 60 minutes of your day.
*   **Hydration and Movement**: Drink a large glass of water to rehydrate your body. Follow it with light stretching, a brief walk, or simply sitting in silence to gently wake up your nervous system.
*   **Savoring the Ritual**: Whether it is grinding fresh coffee beans or steeping loose-leaf tea, focus entirely on the sensory details. Feel the warmth of the mug, smell the rich aroma, and listen to the quiet of the morning.

## The Ripple Effect of Calm

By choosing peace over reactivity in the morning, you build a reservoir of mental resilience. You will find yourself approaching your daily tasks with greater focus, handling unexpected stressors with composure, and reclaiming ownership of your attention span. A slow morning is not wasted time; it is an investment in your mental well-being.
`,
    category: "Lifestyle",
    author: {
      name: "Diana Sterling",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Mindfulness coach and cognitive well-being advocate with a focus on restoring human attention and focus."
    },
    date: "10 Jan 2024",
    readTime: "6 mins read",
    imageUrl: "https://images.unsplash.com/photo-1508253578933-20b529302151?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: true
  },
  {
    id: "smartwatch-hack",
    title: "The Smartwatch Hack: Streamline Your Productivity",
    summary: "Configure your wearable companion to filter digital noise and keep you hyper-focused on what truly matters.",
    content: `# The Smartwatch Hack: Streamline Your Productivity

Smartwatches are everywhere. However, for most people, these devices become an extension of the constant distraction already experienced on their smartphones. An endless stream of wrist vibrations interrupts concentration, creating an illusion of hyper-connectivity that ultimately drains our productivity.

## The Ruthless Notification Filter

The key to transforming your smartwatch from a distraction engine into a productivity ally lies in ruthless notification configuration. The golden rule is simple: **only things requiring immediate attention or action should be allowed to vibrate on your wrist.**

1.  **Mute Chats and Social Media**: Notifications from WhatsApp, Instagram, or X should stay on your phone. Review them when you voluntarily decide to look at your screen, not when the algorithm demands it.
2.  **Allow Calls and Calendar Events**: The only reasonable exceptions are important incoming calls and immediate meeting reminders.
3.  **Enable Focus/Do Not Disturb Modes**: Synchronize these states with your deep work calendar.

### The Wearable as a Biometric Monitor

Beyond time management, a smartwatch shines in tracking key physiological variables for peak performance:

*   **Hydration Reminders**: Simple alerts to drink water at regular intervals keep your mind sharp and energized.
*   **Breathing Sessions**: When sensors detect spikes in resting heart rate, a quick two-minute guided breathing break can reset your nervous system.
*   **Deep Sleep Tracking**: Rest is the foundation of quality work. Analyzing your sleep cycles allows you to adjust your evening habits to wake up fully restored.

## Make Technology Work for You

Technology should be a faithful servant, not a whimsical master. By reclaiming control of your smartwatch and limiting it to a selective focus tool, you will find your attention span doubling, freeing up valuable time for creative tasks and meaningful relationships.
`,
    category: "Tips & Hacks",
    author: {
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Software engineer and biohacking enthusiast focused on digital simplification for human productivity."
    },
    date: "05 Jan 2024",
    readTime: "6 mins read",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  },
  {
    id: "digital-declutter",
    title: "The Digital Declutter: Reclaim Your Attention Span",
    summary: "A practical, step-by-step blueprint to clean up your virtual spaces, eliminate notifications, and reclaim your peace of mind.",
    content: `# The Digital Declutter: Reclaim Your Attention Span

Our physical spaces are often organized, yet our digital lives remain in a state of chaotic clutter. Hundreds of unread emails, dozens of unused apps, messy desktops, and endless notifications compete for our limited cognitive bandwidth. This virtual noise creates a constant background hum of micro-stress and fractures our ability to concentrate.

## The Core Principles of Digital Minimalism

Digital decluttering is not about abandoning technology; it is about aligning your tools with your actual values and using them with deliberate intention.

### Step-by-Step Decluttering Blueprint

1.  **The Home Screen Reset**: Remove all apps from your phone's home screen except for utility tools (e.g., Maps, Calendar, Camera). Hide everything else in the app library or search bar to eliminate visual triggers.
2.  **Notification Audit**: Turn off ALL notifications except for direct messages from real human beings. News apps, shopping platforms, and games should never have permission to interrupt your day.
3.  **Inbox Zero Framework**: Unsubscribe ruthlessly from mailing lists you haven't opened in the last month. Create simple folders for "Action Required" and "Archive" to keep your main inbox clean.

## Cultivating Digital Hygiene

To maintain your newly reclaimed peace, establish simple weekly routines. Spend ten minutes every Friday deleting blurry photos, clearing your download folder, and archiving completed tasks. When you treat your digital devices as tools rather than entertainment hubs, you free up massive amounts of mental energy for the things that truly matter in your offline life.
`,
    category: "Tips & Hacks",
    author: {
      name: "Laura Bennett",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Productivity consultant and minimal living writer based in San Francisco, helping professionals reclaim mental clarity."
    },
    date: "03 Jan 2024",
    readTime: "5 mins read",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  },
  {
    id: "tuscan-pasta",
    title: "Tuscan Culinary Secrets: Hand-Rolled Pasta",
    summary: "Master the ancient traditions of kneading and stretching authentic Italian fresh pasta from scratch in your own kitchen.",
    content: `# Tuscan Culinary Secrets: Hand-Rolled Pasta

In the heart of Tuscany, food is not just fuel; it is a celebration of love, patience, and pure ingredients. Crafting fresh pasta at home is one of the most noble and comforting traditions of Italian gastronomy—a century-old recipe requiring only two elementary ingredients but an immense amount of respect for the process.

## The Golden Rule of Ingredients

To achieve a pasta of impeccable elasticity and texture, the quality of your ingredients is non-negotiable:

*   **Tipo 00 Flour**: Extremely finely ground refined wheat flour. Its high gluten content gives the dough its signature elasticity.
*   **Farm-Fresh Eggs**: Fresh eggs with deep orange yolks yield that beautiful, characteristic golden hue.
*   **The Sacred Ratio**: Traditionally, use **100 grams of flour for every medium egg**.

### Kneading: The Dance of Patience

The real secret lies not in the recipe, but in the hands of the cook. Once the flour well is formed with the beaten eggs in the center, the kneading ritual begins:

1.  **Gradual Incorporation**: Slowly incorporate the flour from the inner walls of the well using a fork, until a shaggy dough forms.
2.  **Rigorous Kneading**: Push the dough forward with the palm of your hand, fold it back, and repeat. Do this rhythmically for 10 to 12 minutes. The dough is ready when it becomes perfectly smooth, elastic, and springs back when lightly pressed with a finger.
3.  **The Crucial Rest**: Wrap the dough in plastic wrap and let it rest at room temperature for at least 30 minutes. This allows the gluten to relax, making it incredibly easy to roll out later.

## The Joy of the Table

Making pasta from scratch connects us to a slower, more deliberate pace of life. Sitting down to enjoy a plate of freshly made *Pici* or *Tagliatelle*, tossed in a simple sauce of ripe tomatoes, fresh basil, and extra virgin Tuscan olive oil, is to rediscover that the greatest pleasures in life are almost always the simplest.
`,
    category: "Culinary",
    author: {
      name: "Giovanni Rossi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Third-generation chef trained in Florence, dedicated to sharing traditional rustic Italian home cooking."
    },
    date: "28 Dec 2023",
    readTime: "8 mins read",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  },
  {
    id: "sourdough-alchemy",
    title: "Sourdough Alchemy: The Science of Wild Yeast",
    summary: "Unravel the magical chemistry and mindful patience required to nurture a wild starter and bake the perfect crusty loaf.",
    content: `# Sourdough Alchemy: The Science of Wild Yeast

Baking sourdough is a beautiful intersection of biology, physics, and patience. Unlike commercial bread made with isolated yeast strains, sourdough relies on a wild ecosystem of lactic acid bacteria and wild yeasts. This slow fermentation process not only develops incredible, complex flavors but also makes the grain significantly easier to digest.

## Nurturing the Starter (The Living Core)

Every great loaf of sourdough begins with a healthy starter—a simple mixture of flour and water that captures the wild yeasts present in the air and on the grain.

*   **The Daily Feeding**: To keep your starter active, discard a portion daily and feed it equal parts water and flour. It will bubble, rise, and develop a pleasant, fruity, sour aroma.
*   **Temperature Matters**: Yeast thrives around 24°C to 26°C (75°F to 78°F). A warmer environment speeds up fermentation, while cold retards it, giving you flexibility.

### The Breadmaking Workflow

1.  **Autolyse**: Mix flour and water and let them rest. This hydrates the flour and starts gluten development before adding salt or starter.
2.  **Stretch and Fold**: Instead of intense kneading, gently stretch the dough and fold it over itself every 30 minutes. This builds a strong, airy gluten structure while preserving precious gas pockets.
3.  **The Cold Fermentation**: After shaping, let the dough rest in the refrigerator overnight. This cold sleep slows down the yeast while allowing bacteria to keep producing complex lactic and acetic acids.

## The Hearth and the Steam

When the dough enters a blazing hot Dutch oven, the trapped steam allows the bread to expand fully—a phenomenon known as "oven spring." As the lid is removed, the dry heat caramelizes the starches, forming a blistered, deep golden crust. Slicing into a cooled loaf to reveal an airy crumb is a deeply rewarding sensory triumph.
`,
    category: "Culinary",
    author: {
      name: "Arthur Pendelton",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Artisan baker and structural biologist passionate about the chemical choreography of traditional baking."
    },
    date: "25 Dec 2023",
    readTime: "7 mins read",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    isAiGenerated: false,
    featured: false
  }
];

// Memory Store acting as DB with Preloaded Data
let postsStore: BlogPost[] = [...DEFAULT_POSTS];

// API Endpoints
app.get("/api/posts", (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    let filtered = [...postsStore];

    // Filter by Category
    if (category && category !== "All") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    // Filter by Search Query
    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.summary.toLowerCase().includes(s) ||
          p.content.toLowerCase().includes(s)
      );
    }

    // Sort criteria
    if (sortBy === "Oldest") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "ReadTime") {
      // Parse integers like "10 mins read" -> 10
      const getMins = (str: string) => parseInt(str) || 0;
      filtered.sort((a, b) => getMins(b.readTime) - getMins(a.readTime));
    } else {
      // Default: Newest. Sorted strictly from recent to oldest.
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/posts/:id", (req, res) => {
  try {
    const post = postsStore.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found." });
    }
    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/posts", (req, res) => {
  try {
    const { title, summary, content, category, imageUrl, readTime, author } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ success: false, error: "Title, content, and category are required." });
    }

    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-GB', dateOptions);

    const newPost: BlogPost = {
      id: "user-" + Date.now().toString(),
      title,
      summary: summary || (content.length > 150 ? content.substring(0, 150) + "..." : content),
      content,
      category,
      author: {
        name: author?.name || "Anonymous Writer",
        avatar: author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        bio: author?.bio || "Passionate lifestyle and travel publisher."
      },
      date: today,
      readTime: readTime || "5 mins read",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      isAiGenerated: false,
      featured: false
    };

    postsStore.unshift(newPost);
    res.json({ success: true, data: newPost });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/posts/:id", (req, res) => {
  try {
    const { title, summary, content, category, imageUrl, readTime, author, estado, tags, slug, meta_titulo, meta_descripcion, palabra_clave_principal } = req.body;
    const index = postsStore.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "The article does not exist." });
    }

    const updatedPost = {
      ...postsStore[index],
      title: title ?? postsStore[index].title,
      summary: summary ?? postsStore[index].summary,
      content: content ?? postsStore[index].content,
      category: category ?? postsStore[index].category,
      imageUrl: imageUrl ?? postsStore[index].imageUrl,
      readTime: readTime ?? postsStore[index].readTime,
      author: author ? { ...postsStore[index].author, ...author } : postsStore[index].author,
      estado: estado ?? postsStore[index].estado,
      tags: tags ?? postsStore[index].tags,
      slug: slug ?? postsStore[index].slug,
      meta_titulo: meta_titulo ?? postsStore[index].meta_titulo,
      meta_descripcion: meta_descripcion ?? postsStore[index].meta_descripcion,
      palabra_clave_principal: palabra_clave_principal ?? postsStore[index].palabra_clave_principal,
    };

    postsStore[index] = updatedPost;
    res.json({ success: true, data: updatedPost });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/posts/:id", (req, res) => {
  try {
    const index = postsStore.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "The post does not exist or has already been deleted." });
    }
    
    // Remove from in-memory database
    postsStore.splice(index, 1);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/posts/reset", (req, res) => {
  try {
    postsStore = [...DEFAULT_POSTS];
    res.json({ success: true, data: postsStore });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Configure Vite and static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
