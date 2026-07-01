import { BlogPost } from "./types";

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "hiking-wonders",
    title: "Exploring the Wonders of Hiking",
    summary: "An iconic guide to the trails, uncovering the secrets that make hiking a transformative experience for every traveler.",
    content: `# Exploring the Wonders of Hiking\n\nThere is something profoundly spiritual about the act of walking through nature. When we leave behind the concrete of cities and step onto trails sculpted by wind and water, we enter a different realm—one governed by the steady rhythm of the sun and the breeze.\n\n## The Art of Disconnecting to Connect\n\nHiking is not merely a physical activity; it is an exercise in mindfulness. Every step requires awareness: the way your foot finds traction on loose gravel, the subtle shift in weight when climbing a sandstone ridge, the crisp air filling your lungs. By focusing on the immediate present, the noise of mobile notifications and to-do lists fades away.\n\n> "In every walk with nature, one receives far more than he seeks." — John Muir\n\n### Essential Preparation Tips\n\nTo make your journey truly unforgettable, meticulous planning is vital:\n\n*   **Smart Hydration**: Water is your most valuable resource. Drink proactively; do not wait until you are thirsty.\n*   **Dress in Layers**: Mountain weather changes rapidly. A windproof and waterproof outer layer can make all the difference.\n*   **Reliable Navigation**: Even if you rely on digital maps on your phone, carry a printed map and a compass. Mobile reception often disappears where real adventure begins.\n\n## The Psychological Impact of Altitudes\n\nNeuroscientific studies have shown that spending time in natural environments drastically reduces cortisol levels (the stress hormone) and stimulates creativity. Contemplating the vastness of a canyon or the distant silhouette of a mountain range helps us put our own challenges into perspective. We discover that the simplicity of a good trail is often the most effective cure for modern exhaustion.\n`,
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
    content: `# Sedona Valley: A Journey Through Red Rocks\n\nSedona, Arizona, is a place of undeniable enchantment. The colossal formations of orange and red sandstone glow with an almost supernatural brilliance during sunrise and sunset, creating a sculpted landscape that draws spiritual seekers, artists, and hikers from across the globe.\n\n## The Geology Behind the Color\n\nThe vivid red hue of Sedona's canyons is due to iron oxide deposits in the layers of Schnebly Hill sandstone and limestone. Formed over 300 million years ago, these spectacular structures are a visual testament to ancient oceans and shifting sand dunes that once covered this territory.\n\n### Must-Visit Landmarks\n\nIf you are planning an escape to Sedona, you cannot miss these iconic spots:\n\n1.  **Cathedral Rock**: Perhaps the most photographed formation in the region. The climb is steep, but the panoramic view at the top is absolutely spectacular.\n2.  **Bell Rock**: Renowned as one of the valley's strongest energetic vortexes, it offers accessible trails and stunning vistas.\n3.  **Devil's Bridge**: The largest natural sandstone arch bridge in the area, perfect for capturing breathtaking photographs above the canyon.\n\n## Respecting a Fragile Environment\n\nThe Arizona desert is an incredibly delicate ecosystem. Cryptobiotic soil, vital for moisture retention and plant life, can take decades to recover if stepped on. Always stay on marked trails and practice *Leave No Trace* principles. By doing so, this magical red paradise will continue to inspire future generations of explorers.\n`,
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
    content: `# Kyoto Rediscovered: A Slow Traveler's Guide\n\nIn a world that rushes from one landmark to another, Kyoto demands a different approach. The ancient capital of Japan, home to thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses, is best experienced at a meditative pace.\n\n## The Philosophy of Yugen and Ma\n\nTo truly appreciate Kyoto, one must understand two Japanese concepts: *Yugen* (a profound, mysterious grace) and *Ma* (the artistic interpretation of empty space). These ideas are woven into the very fabric of the city's architecture and gardens.\n\n> "Kyoto is the historical heart of Japan, where every cobblestone tells a story and every garden is a canvas of contemplation."\n\n### Curated Slow Itinerary\n\nTo capture the essence of Kyoto without the crowds, consider these intentional steps:\n\n*   **Dawn at Arashiyama**: Wander the famous bamboo groves at sunrise. The gentle rustling of the towering stalks in the morning breeze is a natural symphony.\n*   **The Dry Landscape Gardens**: Visit *Ryoan-ji* or *Tofuku-ji*. Sit quietly on the wooden verandas and study the raked gravel and moss-covered stones. They are designed to mirror islands in an infinite sea.\n*   **The Tea Ceremony (Chado)**: Participate in a formal tea preparation. The exquisite focus on heating water, whisking matcha, and presenting the bowl is a masterclass in living in the present.\n\n## Savoring the Flow of Seasons\n\nWhether it is the delicate pink cherry blossoms of spring (*sakura*) or the fiery red maple leaves of autumn (*momiji*), Kyoto celebrates the impermanence of beauty. Slow travel here means stopping to watch a single leaf drift down a canal or enjoying a quiet bowl of wild vegetable soba in a traditional Machiya town house. It is in these unhurried moments that Kyoto reveals its true, timeless soul.\n`,
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
    content: `# The Minimalist Wardrobe: Curating Timeless Style\n\nWe live in a world obsessed with speed and accumulation. The fast fashion industry urges us to buy constantly, filling our closets with cheap, low-quality garments that rarely last more than a single season. In response, the minimalist capsule wardrobe movement emerges as a breath of fresh air and a return to conscious sophistication.\n\n## Fewer Decisions, Elevated Style\n\nThe core concept of textile minimalism is simple: own fewer, higher-quality items that complement each other perfectly. By reducing the visual choices in our closet to pieces we love and that fit us beautifully, we eliminate morning decision fatigue and project a cohesive, intentional image.\n\n### The Leather Jacket: A Timeless Anchor\n\nIf you had to pick a single piece of clothing to define versatility, it would be a well-crafted leather jacket. It is not just a garment; it is an investment that tells a personal story as it ages.\n\n*   **Durability**: Unlike synthetic materials, genuine leather develops a unique patina and becomes softer and more comfortable over the years.\n*   **Complete Versatility**: Pair it with simple denim for a relaxed weekend look, or drape it over an elegant dress to add a contemporary, edgy touch.\n*   **Seasonal Transition**: It serves as the perfect transition piece between seasons, protecting you from cool breezes without adding unnecessary bulk.\n\n## Curating Your Own Collection\n\nDecluttering your closet can feel overwhelming. The secret is a ruthless audit: keep only the pieces you have worn in the last six months, that fit your current size, and that make you feel genuinely confident. A curated wardrobe is not a limitation; it is a statement of intent and respect for our planet's resources.\n`,
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
    content: `# The Psychology of a Slow Morning\n\nHow we begin our day sets the emotional tone for everything that follows. In our hyper-connected world, most people reach for their smartphones within seconds of waking up, instantly flooding their brains with work emails, global news, and social media feeds. This practice triggers an immediate spike in cortisol, putting us in a reactive, anxious state before our feet even touch the floor.\n\n## Reclaiming the First Golden Hour\n\nA slow morning routine is not about waking up at 4:00 AM or completing an exhaustive list of tasks. It is about creating a sacred window of time where you are fully in control of your inputs.\n\n> "The way you start your morning determines the quality of your day."\n\n### Pillars of an Intentional Morning\n\n*   **The Tech-Free Boundary**: Keep your phone in another room overnight. Do not touch any digital screens for the first 30 to 60 minutes of your day.\n*   **Hydration and Movement**: Drink a large glass of water to rehydrate your body. Follow it with light stretching, a brief walk, or simply sitting in silence to gently wake up your nervous system.\n*   **Savoring the Ritual**: Whether it is grinding fresh coffee beans or steeping loose-leaf tea, focus entirely on the sensory details. Feel the warmth of the mug, smell the rich aroma, and listen to the quiet of the morning.\n\n## The Ripple Effect of Calm\n\nBy choosing peace over reactivity in the morning, you build a reservoir of mental resilience. You will find yourself approaching your daily tasks with greater focus, handling unexpected stressors with composure, and reclaiming ownership of your attention span. A slow morning is not wasted time; it is an investment in your mental well-being.\n`,
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
    content: `# The Smartwatch Hack: Streamline Your Productivity\n\nSmartwatches are everywhere. However, for most people, these devices become an extension of the constant distraction already experienced on their smartphones. An endless stream of wrist vibrations interrupts concentration, creating an illusion of hyper-connectivity that ultimately drains our productivity.\n\n## The Ruthless Notification Filter\n\nThe key to transforming your smartwatch from a distraction engine into a productivity ally lies in ruthless notification configuration. The golden rule is simple: **only things requiring immediate attention or action should be allowed to vibrate on your wrist.**\n\n1.  **Mute Chats and Social Media**: Notifications from WhatsApp, Instagram, or X should stay on your phone. Review them when you voluntarily decide to look at your screen, not when the algorithm demands it.\n2.  **Allow Calls and Calendar Events**: The only reasonable exceptions are important incoming calls and immediate meeting reminders.\n3.  **Enable Focus/Do Not Disturb Modes**: Synchronize these states with your deep work calendar.\n\n### The Wearable as a Biometric Monitor\n\nBeyond time management, a smartwatch shines in tracking key physiological variables for peak performance:\n\n*   **Hydration Reminders**: Simple alerts to drink water at regular intervals keep your mind sharp and energized.\n*   **Breathing Sessions**: When sensors detect spikes in resting heart rate, a quick two-minute guided breathing break can reset your nervous system.\n*   **Deep Sleep Tracking**: Rest is the foundation of quality work. Analyzing your sleep cycles allows you to adjust your evening habits to wake up fully restored.\n\n## Make Technology Work for You\n\nTechnology should be a faithful servant, not a whimsical master. By reclaiming control of your smartwatch and limiting it to a selective focus tool, you will find your attention span doubling, freeing up valuable time for creative tasks and meaningful relationships.\n`,
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
    content: `# The Digital Declutter: Reclaim Your Attention Span\n\nOur physical spaces are often organized, yet our digital lives remain in a state of chaotic clutter. Hundreds of unread emails, dozens of unused apps, messy desktops, and endless notifications compete for our limited cognitive bandwidth. This virtual noise creates a constant background hum of micro-stress and fractures our ability to concentrate.\n\n## The Core Principles of Digital Minimalism\n\nDigital decluttering is not about abandoning technology; it is about aligning your tools with your actual values and using them with deliberate intention.\n\n### Step-by-Step Decluttering Blueprint\n\n1.  **The Home Screen Reset**: Remove all apps from your phone's home screen except for utility tools (e.g., Maps, Calendar, Camera). Hide everything else in the app library or search bar to eliminate visual triggers.\n2.  **Notification Audit**: Turn off ALL notifications except for direct messages from real human beings. News apps, shopping platforms, and games should never have permission to interrupt your day.\n3.  **Inbox Zero Framework**: Unsubscribe ruthlessly from mailing lists you haven't opened in the last month. Create simple folders for "Action Required" and "Archive" to keep your main inbox clean.\n\n## Cultivating Digital Hygiene\n\nTo maintain your newly reclaimed peace, establish simple weekly routines. Spend ten minutes every Friday deleting blurry photos, clearing your download folder, and archiving completed tasks. When you treat your digital devices as tools rather than entertainment hubs, you free up massive amounts of mental energy for the things that truly matter in your offline life.\n`,
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
    content: `# Tuscan Culinary Secrets: Hand-Rolled Pasta\n\nIn the heart of Tuscany, food is not just fuel; it is a celebration of love, patience, and pure ingredients. Crafting fresh pasta at home is one of the most noble and comforting traditions of Italian gastronomy—a century-old recipe requiring only two elementary ingredients but an immense amount of respect for the process.\n\n## The Golden Rule of Ingredients\n\nTo achieve a pasta of impeccable elasticity and texture, the quality of your ingredients is non-negotiable:\n\n*   **Tipo 00 Flour**: Extremely finely ground refined wheat flour. Its high gluten content gives the dough its signature elasticity.\n*   **Farm-Fresh Eggs**: Fresh eggs with deep orange yolks yield that beautiful, characteristic golden hue.\n*   **The Sacred Ratio**: Traditionally, use **100 grams of flour for every medium egg**.\n\n### Kneading: The Dance of Patience\n\nThe real secret lies not in the recipe, but in the hands of the cook. Once the flour well is formed with the beaten eggs in the center, the kneading ritual begins:\n\n1.  **Gradual Incorporation**: Slowly incorporate the flour from the inner walls of the well using a fork, until a shaggy dough forms.\n2.  **Rigorous Kneading**: Push the dough forward with the palm of your hand, fold it back, and repeat. Do this rhythmically for 10 to 12 minutes. The dough is ready when it becomes perfectly smooth, elastic, and springs back when lightly pressed with a finger.\n3.  **The Crucial Rest**: Wrap the dough in plastic wrap and let it rest at room temperature for at least 30 minutes. This allows the gluten to relax, making it incredibly easy to roll out later.\n\n## The Joy of the Table\n\nMaking pasta from scratch connects us to a slower, more deliberate pace of life. Sitting down to enjoy a plate of freshly made *Pici* or *Tagliatelle*, tossed in a simple sauce of ripe tomatoes, fresh basil, and extra virgin Tuscan olive oil, is to rediscover that the greatest pleasures in life are almost always the simplest.\n`,
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
    content: `# Sourdough Alchemy: The Science of Wild Yeast\n\nBaking sourdough is a beautiful intersection of biology, physics, and patience. Unlike commercial bread made with isolated yeast strains, sourdough relies on a wild ecosystem of lactic acid bacteria and wild yeasts. This slow fermentation process not only develops incredible, complex flavors but also makes the grain significantly easier to digest.\n\n## Nurturing the Starter (The Living Core)\n\nEvery great loaf of sourdough begins with a healthy starter—a simple mixture of flour and water that captures the wild yeasts present in the air and on the grain.\n\n*   **The Daily Feeding**: To keep your starter active, discard a portion daily and feed it equal parts water and flour. It will bubble, rise, and develop a pleasant, fruity, sour aroma.\n*   **Temperature Matters**: Yeast thrives around 24°C to 26°C (75°F to 78°F). A warmer environment speeds up fermentation, while cold retards it, giving you flexibility.\n\n### The Breadmaking Workflow\n\n1.  **Autolyse**: Mix flour and water and let them rest. This hydrates the flour and starts gluten development before adding salt or starter.\n2.  **Stretch and Fold**: Instead of intense kneading, gently stretch the dough and fold it over itself every 30 minutes. This builds a strong, airy gluten structure while preserving precious gas pockets.\n3.  **The Cold Fermentation**: After shaping, let the dough rest in the refrigerator overnight. This cold sleep slows down the yeast while allowing bacteria to keep producing complex lactic and acetic acids.\n\n## The Hearth and the Steam\n\nWhen the dough enters a blazing hot Dutch oven, the trapped steam allows the bread to expand fully—a phenomenon known as "oven spring." As the lid is removed, the dry heat caramelizes the starches, forming a blistered, deep golden crust. Slicing into a cooled loaf to reveal an airy crumb is a deeply rewarding sensory triumph.\n`,
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
