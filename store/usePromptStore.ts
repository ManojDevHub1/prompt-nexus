import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { extractVariables } from "@/lib/parser";

export type PromptCategory = "Coding" | "Design" | "Copywriting" | "Marketing" | "System Prompts";

export interface PromptItem {
  id: string;
  title: string;
  category: PromptCategory;
  tags: string[];
  content: string;
  description: string;
  variables: string[];
  copiedCount: number;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_PROMPTS: PromptItem[] = [
  // ==========================================
  // CODING (8 Prompts)
  // ==========================================
  {
    id: "prompt-coding-01",
    title: "Next.js 16 High-Performance Server Action & Cache Architecture",
    category: "Coding",
    tags: ["Next.js", "React 19", "Turbopack", "TypeScript"],
    description: "Production-grade server mutation pipeline with optimistic rollback, Zod validation, and fine-grained tag revalidation.",
    content: `You are an elite staff frontend systems engineer. Write a Next.js 16 (App Router, React 19) Server Action pipeline for: {{actionName}}.
Requirements:
1. Strict TypeScript validation using Zod schemas for input {{inputSchema}} and response payloads.
2. Integrate 'useActionState' with optimistic client rollback.
3. Apply fine-grained cache revalidation via revalidateTag('{{cacheTag}}') with zero waterfall latency.
4. Comprehensive error boundary envelope pattern { success: boolean, data?: T, error?: { code: string, message: string } }.
5. Production telemetry hook measuring execution duration down to sub-millisecond precision. Output pure code followed by minimal architecture notes.`,
    variables: ["actionName", "inputSchema", "cacheTag"],
    copiedCount: 428,
    isPinned: true,
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "prompt-coding-02",
    title: "Rust Tokio Async WebSocket Telemetry Pipeline",
    category: "Coding",
    tags: ["Rust", "Tokio", "WebSockets", "Concurrency"],
    description: "High-throughput asynchronous event ingest pipeline with backpressure handling, channel multiplexing, and zero-allocation parsing.",
    content: `Act as a senior systems programmer specializing in Rust and Tokio. Implement a concurrent bidirectional WebSocket worker for: {{serviceName}}.
Constraints:
1. Use tokio::sync::mpsc bounded channels with a capacity limit of {{concurrencyLimit}} to guarantee backpressure.
2. Implement framing with bytes::BytesMut to avoid unnecessary heap reallocations.
3. Handle graceful connection termination on SIGINT/SIGTERM with broadcast channel triggers.
4. Provide structured tracing via tracing::instrument with microsecond timestamp granularity.`,
    variables: ["serviceName", "concurrencyLimit"],
    copiedCount: 312,
    isPinned: false,
    createdAt: "2026-09-16T09:30:00.000Z",
    updatedAt: "2026-10-01T14:15:00.000Z",
  },
  {
    id: "prompt-coding-03",
    title: "PostgreSQL Zero-Downtime Migration & Concurrent Indexing",
    category: "Coding",
    tags: ["PostgreSQL", "Database", "SQL", "High-Availability"],
    description: "Mission-critical SQL schema evolution pattern that prevents table locking on multi-million row production databases.",
    content: `You are a Principal Database Reliability Engineer. Generate a zero-downtime PostgreSQL migration script for table: {{tableName}}.
Operation: Add column {{columnAddition}} with an active check constraint and concurrent index.
Steps to enforce:
1. Set statement_timeout to 5s and lock_timeout to 2s to prevent query pileup.
2. Add column as NULLABLE first without default to avoid table rewrite.
3. Create index using CREATE INDEX CONCURRENTLY with safety rollback guards.
4. Backfill existing records in batches of 5,000 rows with pg_sleep throttles.
5. Apply NOT NULL constraint via NOT VALID, followed by VALIDATE CONSTRAINT.`,
    variables: ["tableName", "columnAddition"],
    copiedCount: 289,
    isPinned: true,
    createdAt: "2026-09-17T11:00:00.000Z",
    updatedAt: "2026-10-02T10:00:00.000Z",
  },
  {
    id: "prompt-coding-04",
    title: "React 19 Strict Optimistic State Mutation Pattern",
    category: "Coding",
    tags: ["React 19", "Optimistic UI", "Hooks", "Frontend"],
    description: "Failsafe client optimistic update pattern utilizing useOptimistic with instant UI response and automatic server reconciliation.",
    content: `You are an elite React core developer. Scaffold a robust optimistic UI component named {{componentName}} handling field: {{optimisticField}}.
Requirements:
1. Implement React 19 'useOptimistic' paired with standard transition boundaries.
2. Handle network dropouts by maintaining a persistent client retry ledger.
3. Display non-intrusive sync indicators ('syncing', 'persisted', 'reverted').
4. Zero layout shift when replacing the optimistic temporary entity with the permanent server UUID.`,
    variables: ["componentName", "optimisticField"],
    copiedCount: 198,
    isPinned: false,
    createdAt: "2026-09-18T14:00:00.000Z",
    updatedAt: "2026-10-02T16:00:00.000Z",
  },
  {
    id: "prompt-coding-05",
    title: "Kubernetes Production Helm Chart & Strict NetworkPolicy Harness",
    category: "Coding",
    tags: ["Kubernetes", "DevOps", "Helm", "Security"],
    description: "Hardened cloud-native service deployment specification with non-root security context and egress lockdowns.",
    content: `Act as a Staff Platform Engineer. Generate production-ready Kubernetes Helm templates for microservice: {{appName}} running on tier: {{clusterTier}}.
Must include:
1. Deployment with readOnlyRootFilesystem: true, drop all capabilities, and runAsNonRoot.
2. Tailored HorizontalPodAutoscaler scaling on 75% memory and CPU targets.
3. Strict NetworkPolicy restricting ingress strictly to API ingress controller and egress strictly to vetted RDS/Redis CIDRs.
4. PodDisruptionBudget ensuring minimum available replicas of 80% during node rotation.`,
    variables: ["appName", "clusterTier"],
    copiedCount: 174,
    isPinned: false,
    createdAt: "2026-09-19T10:00:00.000Z",
    updatedAt: "2026-10-03T11:20:00.000Z",
  },
  {
    id: "prompt-coding-06",
    title: "Python FastAPI High-Concurrency Async Worker with Redis & Celery",
    category: "Coding",
    tags: ["Python", "FastAPI", "Redis", "Celery"],
    description: "Non-blocking API endpoint distributing resource-heavy compute jobs to distributed Celery worker clusters.",
    content: `You are an expert Python backend architect. Write a complete FastAPI router and background worker definition for: {{workerTask}} pushed to queue: {{queueName}}.
Features:
1. Non-blocking async endpoints returning HTTP 202 Accepted with persistent job status polling tokens.
2. Celery task configuration utilizing redis sentinel backend with exponential backoff retries.
3. Detailed Pydantic v2 validation models for request payload and partial error results.
4. Structured JSON logging matching OpenTelemetry trace standards.`,
    variables: ["workerTask", "queueName"],
    copiedCount: 221,
    isPinned: false,
    createdAt: "2026-09-20T13:45:00.000Z",
    updatedAt: "2026-10-03T17:00:00.000Z",
  },
  {
    id: "prompt-coding-07",
    title: "TypeScript Type-Level Finite State Machine & Discriminated Unions",
    category: "Coding",
    tags: ["TypeScript", "TypeSystem", "FSM", "Architecture"],
    description: "Compile-time verified finite state machine that guarantees impossible application states are unrepresentable in code.",
    content: `You are a TypeScript type system specialist. Construct a compile-time type-level state machine for domain: {{domainDomain}} handling states: {{stateSet}}.
Specs:
1. Model every transition as a discriminated union where transitions not explicitly allowed throw compile-time type errors.
2. Define a strict generic executeTransition<TState, TEvent> function with full autocompletion of valid event payloads.
3. Provide automated exhaustiveness checks via 'never' assertions in the reducer dispatch switch.
4. Include clean zero-runtime-overhead type test assertions.`,
    variables: ["domainDomain", "stateSet"],
    copiedCount: 264,
    isPinned: true,
    createdAt: "2026-09-21T16:10:00.000Z",
    updatedAt: "2026-10-04T09:30:00.000Z",
  },
  {
    id: "prompt-coding-08",
    title: "Go Microservice Graceful Shutdown & Context Cancellation Scaffold",
    category: "Coding",
    tags: ["Golang", "Microservices", "Concurrency", "Reliability"],
    description: "Production-hardened Go HTTP server handling OS interrupt signals, in-flight transaction draining, and resource cleanup.",
    content: `Act as a senior Go backend engineer. Write a complete main.go boilerplate for service {{microserviceName}}.
Requirements:
1. Set up an http.Server with custom ReadHeaderTimeout, ReadTimeout, and WriteTimeout.
2. Intercept os.Interrupt and syscall.SIGTERM using signal.NotifyContext.
3. Execute server.Shutdown(ctx) allowing 15 seconds to drain active in-flight requests.
4. Close database pool connections and flush logger buffers before final process exit.`,
    variables: ["microserviceName"],
    copiedCount: 205,
    isPinned: false,
    createdAt: "2026-09-22T08:30:00.000Z",
    updatedAt: "2026-10-04T12:00:00.000Z",
  },

  // ==========================================
  // DESIGN (8 Prompts)
  // ==========================================
  {
    id: "prompt-design-01",
    title: "Cinematic Midjourney Photorealistic Unreal-Engine 5 Prompt Rig",
    category: "Design",
    tags: ["Midjourney v6", "CGI", "Lighting", "Octane"],
    description: "Hyper-realistic optical parameter engine with anamorphic lens simulation, volumetric atmospheric haze, and 8K color science.",
    content: `A cinematic IMAX 70mm still photograph of {{subject}}. Shot on Arri Alexa 65 with Hasselblad prime lenses, f/1.4 aperture, subtle chromatic aberration, shallow depth of field. Volumetric atmospheric haze pierced by stark lighting in {{lightingMood}} and deep obsidian shadows. Photorealistic textural fidelity, subsurface scattering, octane render, raw hyper-detailed dynamic range --ar 16:9 --style raw --v 6.1 --s 750`,
    variables: ["subject", "lightingMood"],
    copiedCount: 382,
    isPinned: true,
    createdAt: "2026-09-18T10:15:00.000Z",
    updatedAt: "2026-10-02T15:30:00.000Z",
  },
  {
    id: "prompt-design-02",
    title: "Figma Design Token Matrix & Fluid Typography Scale System",
    category: "Design",
    tags: ["DesignTokens", "Figma", "Typography", "DesignSystem"],
    description: "Algorithmic token generator creating fluid clamping rem scales, semantic color aliasing, and modular 8pt spacing grids.",
    content: `You are a Principal Design Systems Architect. Generate a cohesive design token specification for brand: {{brandIdentity}} built upon grid base: {{baseGridUnit}}.
Structure:
1. Fluid type scale using CSS clamp() ranging from mobile (375px) to desktop (1440px) across 7 hierarchy tiers.
2. 3-tier semantic color system: Primitive -> Semantic (Surface, Interactive, Text) -> Component Specific.
3. Elevation tokens utilizing multi-layered diffuse drop shadows without mudding dark mode surfaces.
4. Export format in standard W3C Design Tokens Community Group JSON format.`,
    variables: ["brandIdentity", "baseGridUnit"],
    copiedCount: 247,
    isPinned: false,
    createdAt: "2026-09-23T11:20:00.000Z",
    updatedAt: "2026-10-04T14:40:00.000Z",
  },
  {
    id: "prompt-design-03",
    title: "3D Blender Sci-Fi Hard-Surface Shader & Obsidian Texture Rig",
    category: "Design",
    tags: ["Blender", "3D", "Shading", "Textures"],
    description: "Procedural Principled BSDF node recipe in Blender generating realistic micro-scratches, edge wear, and dark metallic sheen.",
    content: `Act as a 3D technical artist. Write a step-by-step procedural material recipe in Blender Cycles for asset: {{assetType}}.
Finish details:
1. Base: Deep obsidian carbon finish with subtle anisotropy and roughness mapped via Voronoi noise.
2. Edge Wear: Geometry Pointiness node combined with Musgrave noise driving the metallic roughness map.
3. Micro-imperfections: Subtle {{surfaceImperfection}} bump map at 0.008 strength for believable tactile realism.
4. Output exact node names, connections, and slider values for instant shader graph setup.`,
    variables: ["assetType", "surfaceImperfection"],
    copiedCount: 191,
    isPinned: false,
    createdAt: "2026-09-24T15:00:00.000Z",
    updatedAt: "2026-10-04T18:10:00.000Z",
  },
  {
    id: "prompt-design-04",
    title: "UI Micro-Interaction Motion Choreography Specification",
    category: "Design",
    tags: ["MotionDesign", "UX", "MicroInteractions", "Animation"],
    description: "Mathematical motion specification defining spring physics, damping ratios, and easing curves for interactive elements.",
    content: `You are an elite motion designer and UX engineer. Craft a high-precision motion choreography document for {{componentType}} triggered by {{interactionTrigger}}.
Specs:
1. Define spring physics: Stiffness, Damping, Mass, and duration bounds for entry, hover, active, and exit states.
2. Easing curves specified as cubic-bezier coordinates (e.g. [0.16, 1, 0.3, 1] expoOut).
3. Stagger hierarchy: Delay offsets per item in milliseconds to avoid visual clutter.
4. Accessibility mode: Define the exact zero-motion/opacity-only fallback for prefers-reduced-motion.`,
    variables: ["componentType", "interactionTrigger"],
    copiedCount: 310,
    isPinned: true,
    createdAt: "2026-09-25T09:10:00.000Z",
    updatedAt: "2026-10-05T10:15:00.000Z",
  },
  {
    id: "prompt-design-05",
    title: "Isometric Dark-Mode Cyberpunk Architectural Concept Rig",
    category: "Design",
    tags: ["Midjourney", "Isometric", "Cyberpunk", "Architecture"],
    description: "Isometric 30-degree orthographic rendering prompt for futuristic high-density data centres and containment towers.",
    content: `Orthographic 30-degree isometric cross-section blueprint of a futuristic {{buildingFunction}}. Detailed modular architectural levels, exposed server racks, conduits, and ventilation grids. High-tech containment aesthetic illuminated by {{neonPalette}} edge illumination against matte black titanium walls. Ultra-clean lines, Octane render, 8k resolution, Unreal Engine 5 technical showcase --ar 1:1 --style raw --v 6.1`,
    variables: ["buildingFunction", "neonPalette"],
    copiedCount: 228,
    isPinned: false,
    createdAt: "2026-09-26T12:00:00.000Z",
    updatedAt: "2026-10-05T13:30:00.000Z",
  },
  {
    id: "prompt-design-06",
    title: "Minimalist Swiss Typographic Editorial Poster Layout",
    category: "Design",
    tags: ["Typography", "SwissStyle", "GraphicDesign", "Layout"],
    description: "Strict International Typographic Style layout prompt using asymmetric grid structures, extreme scale contrasts, and stark negative space.",
    content: `You are a legendary Swiss graphic designer. Design the visual structure and CSS grid layout for an avant-garde editorial poster celebrating {{headlineTopic}} using {{gridStructure}}.
Rules:
1. Asymmetrical 12-column grid with strict adherence to Josef Müller-Brockmann principles.
2. Massive display scale hierarchy: 120pt grotesque headline contrasted against 11pt technical body text.
3. Monochromatic stark black and white palette with exactly one strategic high-energy accent hue.
4. Output precise typographic tracking, leading, column gutters, and margin calculations.`,
    variables: ["headlineTopic", "gridStructure"],
    copiedCount: 185,
    isPinned: false,
    createdAt: "2026-09-27T14:30:00.000Z",
    updatedAt: "2026-10-05T17:00:00.000Z",
  },
  {
    id: "prompt-design-07",
    title: "Sci-Fi HUD UI Vector & Dark Telemetry Wireframe Rig",
    category: "Design",
    tags: ["HUD", "SciFi", "Vector", "UI"],
    description: "Razor-sharp heads-up-display interface prompt featuring vector reticles, radar dials, and real-time biometric telemetry feeds.",
    content: `High-resolution dark-mode military spacecraft HUD interface for a {{pilotRole}} engaged in {{combatSystem}}.
Elements: Chamfered vector panels, digital coordinate readouts, circular reticle targeting brackets, vector oscilloscope telemetry graphs, ultra-fine 0.5px line weights. Monochrome dark graphite background with high-contrast electric cyan highlights. Pure functional utility, zero rounded corners, crisp vector aesthetics --ar 16:9 --v 6.1`,
    variables: ["pilotRole", "combatSystem"],
    copiedCount: 276,
    isPinned: true,
    createdAt: "2026-09-28T16:20:00.000Z",
    updatedAt: "2026-10-06T08:45:00.000Z",
  },
  {
    id: "prompt-design-08",
    title: "Industrial Control Dashboard Interface & Physical Switch Metaphor",
    category: "Design",
    tags: ["UI/UX", "Dashboard", "Hardware", "Industrial"],
    description: "Mission-critical tactile operator console design balancing digital telemetry metrics with tactile hardware control paradigms.",
    content: `Act as a Principal Industrial Interface Designer. Specify a mission-critical monitoring dashboard for {{machineType}} tracking {{telemetrySensors}}.
Guidelines:
1. High-contrast dark industrial theme with zero decorative clutter (WCAG AAA compliance).
2. Segmented LED-style numerical readouts for instantaneous anomaly recognition.
3. State alerts: Normal (subtle cyan/white), Warning (amber 500), Critical Fault (crimson 600 with 2Hz strobe).
4. Physical toggle metaphor with chamfered bevel borders and distinct tactile pressed states.`,
    variables: ["machineType", "telemetrySensors"],
    copiedCount: 163,
    isPinned: false,
    createdAt: "2026-09-29T10:10:00.000Z",
    updatedAt: "2026-10-06T11:15:00.000Z",
  },

  // ==========================================
  // COPYWRITING (8 Prompts)
  // ==========================================
  {
    id: "prompt-copy-01",
    title: "High-Conversion SaaS Value Proposition & Objection Dismantler",
    category: "Copywriting",
    tags: ["Conversion", "B2B SaaS", "Psychology", "Positioning"],
    description: "Direct-response framework designed to cut through corporate jargon, targeting high-LTV technical decision makers.",
    content: `Act as a legendary direct-response conversion copywriter specializing in developer tools.
Analyze this product: [ProductName] serving [Audience].
Execute the following 4-step framework:
1. 'The Bleeding Wound': State the exact expensive friction they endure right now in visceral, technical terms.
2. 'The Irreversible Shift': Contrast legacy architecture vs the new paradigm with zero marketing fluff.
3. 'The 3-Bullet Moat': Articulate 3 non-negotiable reasons why alternatives fall short.
4. 'The Objection Guillotine': Anticipate the top 2 enterprise objections (Security/Latency) and neutralize them in under 20 words each. Tone: Razor-sharp, understated authority, zero exclamation points.`,
    variables: ["ProductName", "Audience"],
    copiedCount: 295,
    isPinned: true,
    createdAt: "2026-09-21T14:20:00.000Z",
    updatedAt: "2026-10-03T09:12:00.000Z",
  },
  {
    id: "prompt-copy-02",
    title: "Cold Outbound Email Framework for Enterprise Engineering Leaders",
    category: "Copywriting",
    tags: ["ColdEmail", "B2B", "Outbound", "SalesCopy"],
    description: "Three-sentence, zero-jargon outbound email engineered to trigger responses from VP of Engineering and CTO personas.",
    content: `You are an elite B2B SDR leader. Draft a cold outbound email targeting the VP of Engineering at {{companyName}} addressing their challenge with {{corePainPoint}}.
Rules:
1. Maximum 75 words total across 3 short paragraphs.
2. Paragraph 1: An observational hook proving you studied their public engineering blog or repo.
3. Paragraph 2: One specific metric showing how peers reduced incident recovery or build times by 40%+.
4. Paragraph 3: Frictionless soft CTA (e.g., 'Worth a 4-minute loom, or should I ping someone else on the infra team?').
5. No fake flattery, no 'I hope this email finds you well'.`,
    variables: ["companyName", "corePainPoint"],
    copiedCount: 341,
    isPinned: true,
    createdAt: "2026-09-22T11:00:00.000Z",
    updatedAt: "2026-10-03T15:20:00.000Z",
  },
  {
    id: "prompt-copy-03",
    title: "Landing Page Above-the-Fold Hero Hook & Sub-headline Synthesizer",
    category: "Copywriting",
    tags: ["LandingPage", "HeroSection", "Conversion", "SaaS"],
    description: "High-impact hero section copy generator formulating 5 headline variations tested for visceral clarity and immediate conversion.",
    content: `Act as a world-class SaaS copy chief. Write 5 high-converting hero headline options for an offering providing: {{solutionBenefit}} in the {{nicheMarket}} vertical.
For each option include:
1. Primary Headline: Under 8 words. Active voice. No buzzwords like 'empower', 'streamline', or 'revolutionary'.
2. Sub-headline: Exactly 2 sentences clarifying the mechanism and the immediate time-to-value.
3. Primary CTA button text: 2-3 words indicating action (e.g., 'Initialize Vault', 'Deploy In 60s').`,
    variables: ["solutionBenefit", "nicheMarket"],
    copiedCount: 412,
    isPinned: true,
    createdAt: "2026-09-23T15:15:00.000Z",
    updatedAt: "2026-10-04T10:45:00.000Z",
  },
  {
    id: "prompt-copy-04",
    title: "Product Hunt Launch Day Post & Founder Origin Story",
    category: "Copywriting",
    tags: ["ProductHunt", "Launch", "Storytelling", "Founders"],
    description: "Compelling launch comment and maker comment that hooks early adopters, explains technical architecture, and drives upvotes.",
    content: `You are an acclaimed serial maker with 5 #1 Products of the Day on Product Hunt. Draft the primary Maker Comment for {{productName}} with origin story: {{originStory}}.
Structure:
1. The 'Why We Built This' frustration moment that sparked the project.
2. The architectural breakthrough that makes this 10x faster/cleaner than legacy options.
3. Exclusive perk for the Product Hunt community today only.
4. Direct, transparent ask for honest critique and feedback in the comments.`,
    variables: ["productName", "originStory"],
    copiedCount: 230,
    isPinned: false,
    createdAt: "2026-09-24T18:00:00.000Z",
    updatedAt: "2026-10-04T19:30:00.000Z",
  },
  {
    id: "prompt-copy-05",
    title: "Enterprise Case Study Transformation (Situation, Friction, ROI)",
    category: "Copywriting",
    tags: ["CaseStudy", "Enterprise", "ROI", "SocialProof"],
    description: "Hard-hitting customer success story template that demonstrates measurable business outcomes and technical lift.",
    content: `Act as an enterprise marketing director. Structure an authoritative customer story for {{clientEnterprise}} achieving {{liftMetric}}.
Sections:
1. The Bottleneck: The dollar cost and team attrition caused by their previous legacy pipeline.
2. The Deployment: How implementation was achieved in under 14 days without downtime.
3. The Hard Numbers: 3 executive stats (Latency reduction %, Infrastructure bill savings $, Engineering hours reclaimed).
4. Direct pull quote from the Lead Architect that sounds authentic, grounded, and technical.`,
    variables: ["clientEnterprise", "liftMetric"],
    copiedCount: 188,
    isPinned: false,
    createdAt: "2026-09-25T11:45:00.000Z",
    updatedAt: "2026-10-05T12:10:00.000Z",
  },
  {
    id: "prompt-copy-06",
    title: "Technical Changelog & Release Announcement for Power Users",
    category: "Copywriting",
    tags: ["Changelog", "DeveloperRelations", "ReleaseNotes"],
    description: "Engaging, developer-centric release notes celebrating new features while clearly documenting breaking changes.",
    content: `You are a Principal Developer Advocate. Write a release changelog post for version update: {{featureRelease}} with breaking change: {{breakingChange}}.
Format:
1. 'The Big Drop': 2-paragraph overview highlighting why developers will feel an instant velocity improvement.
2. 'Under the Hood': Bulleted deep-dive into compiler improvements and payload size optimizations.
3. 'Migration Guide': Crisp 3-step code snippet showing how to upgrade without regressions.
4. Tone: Concise, engineer-to-engineer, respectful of user time.`,
    variables: ["featureRelease", "breakingChange"],
    copiedCount: 177,
    isPinned: false,
    createdAt: "2026-09-26T14:10:00.000Z",
    updatedAt: "2026-10-05T15:00:00.000Z",
  },
  {
    id: "prompt-copy-07",
    title: "Direct-Response Ad Script for Developer Tooling",
    category: "Copywriting",
    tags: ["PaidAds", "DirectResponse", "VideoScripts", "DevTools"],
    description: "30-second punchy video ad script for YouTube and podcasts dissecting a real developer frustration in seconds.",
    content: `Draft a 30-second punchy direct-response video script promoting {{sponsorTool}} to engineers suffering from {{frustratedWorkflow}}.
Timing breakdown:
- [00:00 - 00:05] The Visual Hook: Call out the exact terminal error or endless build spinner they hate.
- [00:06 - 00:15] The Mechanism: Show how {{sponsorTool}} bypasses the bottleneck via local compilation.
- [00:16 - 00:25] The Proof: Side-by-side terminal speed test.
- [00:26 - 00:30] The Frictionless CTA: Free tier, zero credit card, 1 terminal curl command to install.`,
    variables: ["sponsorTool", "frustratedWorkflow"],
    copiedCount: 215,
    isPinned: false,
    createdAt: "2026-09-27T09:50:00.000Z",
    updatedAt: "2026-10-06T07:30:00.000Z",
  },
  {
    id: "prompt-copy-08",
    title: "Customer Win-Back Sequence for Churned Subscriptions",
    category: "Copywriting",
    tags: ["Retention", "EmailSequence", "Churn", "Lifecycle"],
    description: "High-empathy, non-pushy email sequence targeted at churned SaaS users after major product improvements.",
    content: `You are a Retention & Lifecycle Copywriter. Draft a 2-part email win-back campaign for users who cancelled due to: {{churnReason}}, offering {{incentiveOffer}}.
Email 1 (Day 14 Post-Cancel): 'We fixed the thing you hated.' Announce the exact bugfix or performance release without sounding defensive.
Email 2 (Day 28 Post-Cancel): 'A clean slate.' Offer a frictionless 30-day extended VIP trial with direct access to our engineering team.`,
    variables: ["churnReason", "incentiveOffer"],
    copiedCount: 194,
    isPinned: false,
    createdAt: "2026-09-28T13:25:00.000Z",
    updatedAt: "2026-10-06T14:00:00.000Z",
  },

  // ==========================================
  // MARKETING (7 Prompts)
  // ==========================================
  {
    id: "prompt-marketing-01",
    title: "Viral LinkedIn Technical Thought Leadership Framework",
    category: "Marketing",
    tags: ["LinkedIn", "ThoughtLeadership", "SocialMedia", "Growth"],
    description: "Contrarian engineering breakdown framework designed for organic distribution and technical credibility.",
    content: `Act as a viral B2B LinkedIn creator with 100k+ technical followers. Write a high-engagement post detailing: [Topic] tailored for [TargetAudience].
Structure:
1. 1-line contrarian hook that challenges standard best-practice dogma.
2. The costly mistake 90% of tech teams make because of this belief.
3. The real data from production benchmarks that flipped our perspective.
4. 3 actionable takeaways any senior dev can implement by tomorrow.
5. Closing discussion prompt that sparks debate in the comments.`,
    variables: ["Topic", "TargetAudience"],
    copiedCount: 356,
    isPinned: true,
    createdAt: "2026-09-24T12:00:00.000Z",
    updatedAt: "2026-10-04T16:00:00.000Z",
  },
  {
    id: "prompt-marketing-02",
    title: "X (Twitter) High-Engagement Architecture Breakdown Thread",
    category: "Marketing",
    tags: ["Twitter", "Threads", "Architecture", "ViralMarketing"],
    description: "8-tweet technical breakdown thread breaking down complex open-source architectures with high bookmark velocity.",
    content: `You are a renowned tech educator on X/Twitter. Outline an 8-tweet viral thread breaking down {{architectureBreakdown}} found in repo {{githubRepo}}.
Tweet 1: Compelling visual hook with problem summary and bookmark trigger.
Tweet 2-3: The fundamental architectural bottleneck in legacy designs.
Tweet 4-5: The novel concurrency or caching breakthrough implemented here.
Tweet 6: Key benchmarks or stress-test numbers.
Tweet 7: The one trade-off or drawback you must keep in mind.
Tweet 8: Summary takeaway + link to star the repo.`,
    variables: ["architectureBreakdown", "githubRepo"],
    copiedCount: 420,
    isPinned: true,
    createdAt: "2026-09-25T14:30:00.000Z",
    updatedAt: "2026-10-05T09:15:00.000Z",
  },
  {
    id: "prompt-marketing-03",
    title: "SEO Programmatic Landing Page Blueprint for Tech Tools",
    category: "Marketing",
    tags: ["SEO", "Programmatic", "OrganicGrowth", "Content"],
    description: "Scalable keyword matrix and content template for 1,000+ programmatic comparison and alternative pages.",
    content: `Act as an SEO director for developer startups. Design a programmatic SEO page template targeting keyword pattern: {{targetKeyword}} for search intent: {{intentCategory}}.
Must provide:
1. Dynamic URL schema and schema.org SoftwareApplication JSON-LD snippet.
2. High-converting above-the-fold comparison table layout.
3. Algorithmic FAQ section resolving the top 4 long-tail query questions.
4. Internal linking architecture ensuring rapid indexation by search engine spiders.`,
    variables: ["targetKeyword", "intentCategory"],
    copiedCount: 284,
    isPinned: false,
    createdAt: "2026-09-26T10:15:00.000Z",
    updatedAt: "2026-10-05T13:40:00.000Z",
  },
  {
    id: "prompt-marketing-04",
    title: "Developer Relations (DevRel) Hands-on Tutorial Blueprint",
    category: "Marketing",
    tags: ["DevRel", "Tutorials", "Documentation", "Developers"],
    description: "Step-by-step interactive tutorial scaffold that guides developers to an 'aha!' milestone in under 10 minutes.",
    content: `You are a Senior DevRel Architect. Scaffold a 10-minute quickstart guide for {{openSourceTool}} by building a mini-project: {{sampleProject}}.
Requirements:
1. 'Time to Hello World' strictly under 3 minutes with copy-paste terminal commands.
2. Every code block must be fully typed and self-contained (no unmentioned imports).
3. Callout boxes for common pitfalls and edge cases.
4. A celebratory 'What You Just Accomplished' recap with next-step repo links.`,
    variables: ["openSourceTool", "sampleProject"],
    copiedCount: 312,
    isPinned: false,
    createdAt: "2026-09-27T11:45:00.000Z",
    updatedAt: "2026-10-06T10:00:00.000Z",
  },
  {
    id: "prompt-marketing-05",
    title: "Competitive Battlecard & Feature Matrix Dismantler",
    category: "Marketing",
    tags: ["Competitive", "SalesEnablement", "Battlecard", "PMM"],
    description: "Product Marketing battlecard empowering sales and founders to win head-to-head deals against incumbents.",
    content: `Act as a Product Marketing Director. Build an internal sales battlecard positioning our product against {{rivalCompetitor}} emphasizing our differentiator: {{ourDifferentiator}}.
Includes:
1. Competitor Landmines: 3 awkward questions to suggest the prospect asks {{rivalCompetitor}}.
2. Neutralizing Defense: How to deflect the competitor's favourite objection in 20 seconds.
3. Feature Comparison Trap: Reframe their bloated checklist into our streamlined high-performance moat.`,
    variables: ["rivalCompetitor", "ourDifferentiator"],
    copiedCount: 195,
    isPinned: false,
    createdAt: "2026-09-28T15:00:00.000Z",
    updatedAt: "2026-10-06T16:20:00.000Z",
  },
  {
    id: "prompt-marketing-06",
    title: "Product-Led Growth (PLG) Onboarding Email Drip Matrix",
    category: "Marketing",
    tags: ["PLG", "EmailDrip", "Onboarding", "Activation"],
    description: "Event-triggered 4-email sequence designed to drive users from initial signup to their first core activation action.",
    content: `You are a Product-Led Growth strategist. Design an automated email drip for user persona {{userPersona}} to drive activation event: {{activationMilestone}}.
Trigger cadence:
- Email 1 (Minutes after signup): The single fastest route to the first value metric.
- Email 2 (Day 2 if unactivated): A 30-second video demo removing setup friction.
- Email 3 (Day 4 if activated): An advanced power-user feature shortcut.
- Email 4 (Day 7): Invitation to founder office hours or VIP community.`,
    variables: ["userPersona", "activationMilestone"],
    copiedCount: 228,
    isPinned: false,
    createdAt: "2026-09-29T08:30:00.000Z",
    updatedAt: "2026-10-07T09:10:00.000Z",
  },
  {
    id: "prompt-marketing-07",
    title: "High-Attendance Technical Webinar Landing Page & Pitch Rig",
    category: "Marketing",
    tags: ["Webinar", "LeadGen", "LiveEvents", "Conversion"],
    description: "Complete promotional blueprint and registration landing page for high-attendance live technical workshops.",
    content: `Craft a high-converting registration page structure for a live technical workshop on {{webinarTopic}} presented by {{expertHost}}.
Components:
1. Urgent Title: Focus on real-world engineering problem solving, not a product pitch.
2. 3 Bulleted Key Learnings: Exact terminal skills attendees will walk away with.
3. Live Interactive Q&A Anchor: Pitching an unscripted architectural audit segment.
4. Low-friction registration form copy assuring zero spam or aggressive sales followups.`,
    variables: ["webinarTopic", "expertHost"],
    copiedCount: 167,
    isPinned: false,
    createdAt: "2026-09-30T13:10:00.000Z",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },

  // ==========================================
  // SYSTEM PROMPTS (7 Prompts)
  // ==========================================
  {
    id: "prompt-system-01",
    title: "Autonomous Recursive Chain-of-Thought Evaluator",
    category: "System Prompts",
    tags: ["SystemPrompt", "CoT", "FormalLogic", "DeepReasoning"],
    description: "Multi-pass dialectic reasoning scaffold that pit hypotheses against counter-examples before synthesizing conclusions.",
    content: `Execute a multi-stage dialectic evaluation of: {{complexHypothesis}}.
Stage 1 [Deconstruction]: Break the core argument into first-principles axioms and hidden assumptions.
Stage 2 [Stress Test]: Construct the strongest possible steelman counter-argument or adversarial edge case that breaks the premise.
Stage 3 [Empirical Arbitrage]: Identify what observable metric or test definitively proves or disproves the theorem.
Stage 4 [Synthesis & Certainty Metric]: Present the final hardened conclusion with a Bayesian confidence probability score (0-100%) and unresolved boundary conditions.`,
    variables: ["complexHypothesis"],
    copiedCount: 394,
    isPinned: true,
    createdAt: "2026-09-24T18:45:00.000Z",
    updatedAt: "2026-10-04T11:00:00.000Z",
  },
  {
    id: "prompt-system-02",
    title: "Staff Security Engineer Red Team Penetration Auditor",
    category: "System Prompts",
    tags: ["Security", "RedTeam", "PenetrationTesting", "Audit"],
    description: "Adversarial system prompt that rigorously stress-tests cloud architectures against OWASP Top 10 and zero-day threat models.",
    content: `You are an elite offensive cybersecurity red-team operator. Audit this architecture: {{targetArchitecture}} against threat model: {{threatModel}}.
Protocol:
1. Enumerate attack surfaces across API endpoints, IAM permission boundaries, and supply chain dependencies.
2. Outline exact exploitation vectors step-by-step with payload proofs of concept.
3. Grade severity using CVSS v3.1 scoring (Base, Temporal, Environmental).
4. Provide immediate tactical remediation diffs followed by strategic architectural hardening measures.`,
    variables: ["targetArchitecture", "threatModel"],
    copiedCount: 308,
    isPinned: true,
    createdAt: "2026-09-25T16:00:00.000Z",
    updatedAt: "2026-10-05T14:20:00.000Z",
  },
  {
    id: "prompt-system-03",
    title: "Principal Database Administrator Query Plan Optimizer",
    category: "System Prompts",
    tags: ["Database", "SQL", "QueryPlan", "Performance"],
    description: "Exhaustive EXPLAIN ANALYZE dissection agent identifying sequential scans, buffer bloat, and lock contention.",
    content: `You are a Principal Database Administrator specializing in high-concurrency database engines.
Analyze this slow SQL query: {{slowSqlStatement}} on engine: {{engineType}}.
Deliverables:
1. Simulate the EXPLAIN ANALYZE execution plan breakdown identifying exact sequential scan and hash join bottlenecks.
2. Pinpoint CPU and I/O buffer thrashing roots.
3. Propose 2 rewritten SQL queries (e.g., CTE optimization, LATERAL join rewrite).
4. Recommend exact composite index definitions with optimal column ordering for B-tree index efficiency.`,
    variables: ["slowSqlStatement", "engineType"],
    copiedCount: 265,
    isPinned: false,
    createdAt: "2026-09-26T17:30:00.000Z",
    updatedAt: "2026-10-06T09:00:00.000Z",
  },
  {
    id: "prompt-system-04",
    title: "Socratic Distributed Systems Architecture Interviewer",
    category: "System Prompts",
    tags: ["SystemDesign", "Interviews", "Architecture", "Socratic"],
    description: "Conducts rigorous Socratic technical interviews, probing candidate trade-offs around CAP theorem, consensus, and scale.",
    content: `You are a Distinguished Systems Engineer interviewing a candidate for {{candidateSeniority}} on topic: {{distributedTopic}}.
Rules of engagement:
1. Never give the answer away. Ask one probing, clarifying question at a time.
2. Challenge their assumptions regarding network partitions, leader elections, and data consistency models.
3. Push them on real-world edge cases (e.g. split-brain scenarios, clock drift, thundering herd problems).
4. Maintain a professional, rigorous, intellectually demanding interview persona.`,
    variables: ["candidateSeniority", "distributedTopic"],
    copiedCount: 242,
    isPinned: false,
    createdAt: "2026-09-27T13:15:00.000Z",
    updatedAt: "2026-10-06T15:30:00.000Z",
  },
  {
    id: "prompt-system-05",
    title: "Code Reviewer: Zero-Fluff Precision Lint & Security Scrutiny",
    category: "System Prompts",
    tags: ["CodeReview", "Quality", "CleanCode", "StaticAnalysis"],
    description: "Brutally honest, ultra-concise code review assistant that catches race conditions, memory leaks, and antipatterns.",
    content: `You are a battle-tested Senior Staff Software Architect. Review this code snippet: {{codeSnippet}} conforming to standard: {{languageStandard}}.
Guidelines:
1. Zero praise, zero filler comments. Jump immediately into findings.
2. Categorize issues by: [CRITICAL BUG], [SECURITY/PERF LEAK], [MAINTAINABILITY].
3. For every identified issue, provide the exact line reference and a copy-paste ready corrected code block.
4. If the code meets high production standards, respond with exactly: 'LGTM. Zero regressions detected.'`,
    variables: ["codeSnippet", "languageStandard"],
    copiedCount: 388,
    isPinned: true,
    createdAt: "2026-09-28T10:45:00.000Z",
    updatedAt: "2026-10-07T08:20:00.000Z",
  },
  {
    id: "prompt-system-06",
    title: "Executive Technical Briefing Synthesizer for Non-Technical C-Suite",
    category: "System Prompts",
    tags: ["Executive", "Communication", "Leadership", "Briefing"],
    description: "Translates complex outages, technical debt, and architectural migrations into business risk, ROI, and executive decisions.",
    content: `You are a Chief Technology Officer reporting directly to the Board and CEO. Summarize this situation: {{technicalCrisis}} with business risk: {{costImplication}}.
Structure:
1. Executive Summary (2 sentences max): What happened and current status.
2. Business Impact: Revenue risk, customer SLA exposure, and brand reputation impact.
3. Root Cause in Plain English: Explain the failure using a non-technical physical infrastructure analogy.
4. Decision Request: 2 clear strategic options with budget requirements and time-to-resolution estimates.`,
    variables: ["technicalCrisis", "costImplication"],
    copiedCount: 219,
    isPinned: false,
    createdAt: "2026-09-29T14:00:00.000Z",
    updatedAt: "2026-10-07T11:40:00.000Z",
  },
  {
    id: "prompt-system-07",
    title: "Autonomous Self-Correcting JSON Schema Enforcement Agent",
    category: "System Prompts",
    tags: ["JSON", "Schema", "StructuredOutputs", "APIs"],
    description: "System role strictly guaranteeing 100% compliant JSON responses with automated syntax verification and schema validation.",
    content: `You are a deterministic data transformation compiler. Your sole responsibility is converting raw inputs into valid JSON adhering strictly to: {{strictSchema}}.
Rules:
1. Output MUST be raw unadorned JSON. No markdown code blocks, no backticks, no explanatory text.
2. Validate all types, enums, required keys, and boundary conditions before emitting characters.
3. If an input is ambiguous, populate with sensible null or empty-array defaults according to the schema.
4. Any non-JSON character in your output is treated as a catastrophic failure. Target payload: {{targetOutputJson}}.`,
    variables: ["strictSchema", "targetOutputJson"],
    copiedCount: 450,
    isPinned: true,
    createdAt: "2026-09-30T16:20:00.000Z",
    updatedAt: "2026-10-07T15:10:00.000Z",
  },
];

interface PromptStoreState {
  prompts: PromptItem[];
  selectedCategory: string; // "ALL" or specific PromptCategory
  searchQuery: string;
  activeTag: string | null;
  addPrompt: (newPrompt: Omit<PromptItem, "id" | "createdAt" | "updatedAt" | "copiedCount">) => PromptItem;
  updatePrompt: (id: string, updates: Partial<Omit<PromptItem, "id" | "createdAt">>) => void;
  deletePrompt: (id: string) => void;
  togglePin: (id: string) => void;
  recordCopy: (id: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string | null) => void;
  exportVault: () => string;
  importVault: (jsonContent: string) => { success: boolean; count?: number; error?: string };
  resetToDefaults: () => void;
}

export const usePromptStore = create<PromptStoreState>()(
  persist(
    (set, get) => ({
      prompts: INITIAL_PROMPTS,
      selectedCategory: "ALL",
      searchQuery: "",
      activeTag: null,

      addPrompt: (newPrompt) => {
        const timestamp = new Date().toISOString();
        const created: PromptItem = {
          ...newPrompt,
          id: `prompt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          copiedCount: 0,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          prompts: [created, ...state.prompts],
        }));
        return created;
      },

      updatePrompt: (id, updates) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, isPinned: !p.isPinned } : p
          ),
        }));
      },

      recordCopy: (id) => {
        set((state) => ({
          prompts: state.prompts.map((p) =>
            p.id === id ? { ...p, copiedCount: p.copiedCount + 1 } : p
          ),
        }));
      },

      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveTag: (tag) => set({ activeTag: tag }),

      exportVault: () => {
        const state = get();
        return JSON.stringify(
          {
            version: "2.0.0",
            exportDate: new Date().toISOString(),
            source: "PromptNexus for Manoj (Beta)",
            totalPrompts: state.prompts.length,
            prompts: state.prompts,
          },
          null,
          2
        );
      },

      importVault: (jsonContent: string) => {
        try {
          const parsed = JSON.parse(jsonContent);
          const importedPrompts: PromptItem[] = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.prompts)
            ? parsed.prompts
            : null;

          if (!importedPrompts || !importedPrompts.length) {
            return { success: false, error: "No valid prompt array found in JSON." };
          }

          const validCategories: PromptCategory[] = [
            "Coding",
            "Design",
            "Copywriting",
            "Marketing",
            "System Prompts",
          ];

          const validated: PromptItem[] = importedPrompts.map((p, idx) => ({
            id: p.id || `prompt-import-${Date.now()}-${idx}`,
            title: String(p.title || "Untitled Prompt"),
            category: (validCategories.includes(p.category)
              ? p.category
              : "Coding") as PromptCategory,
            tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
            content: String(p.content || ""),
            description: String(p.description || ""),
            variables: Array.isArray(p.variables) ? p.variables.map(String) : [],
            copiedCount: typeof p.copiedCount === "number" ? p.copiedCount : 0,
            isPinned: Boolean(p.isPinned),
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
          }));

          set({ prompts: validated });
          return { success: true, count: validated.length };
        } catch (err) {
          return {
            success: false,
            error: err instanceof Error ? err.message : "Malformed JSON syntax.",
          };
        }
      },

      resetToDefaults: () => {
        set({ prompts: INITIAL_PROMPTS });
      },
    }),
    {
      name: "promptnexus_vault_storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Automatically migrate or seed to ensure 38 full prompts are loaded
      migrate: (persistedState: any, version: number) => {
        if (version < 2 || !persistedState?.prompts || persistedState.prompts.length < 38) {
          return {
            ...persistedState,
            prompts: INITIAL_PROMPTS,
          };
        }
        return persistedState;
      },
    }
  )
);

/**
 * Serializes the Zustand store state and triggers a download of prompt-vault.json
 */
export function downloadVaultJson() {
  const jsonString = usePromptStore.getState().exportVault();
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "prompt-vault.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Accepts a JSON file, validates it, and overwrites the Zustand store
 */
export function importVaultFromFile(
  file: File,
  onDone?: (res: { success: boolean; count?: number; error?: string }) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    const res = usePromptStore.getState().importVault(content);
    onDone?.(res);
  };
  reader.readAsText(file);
}

