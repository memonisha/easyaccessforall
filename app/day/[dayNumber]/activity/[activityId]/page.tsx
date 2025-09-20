import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Target, TestTube } from "lucide-react"
import Link from "next/link"
import { CodeEditor } from "@/components/code-editor"

const learningDays = {
  "1": {
    title: "Visual Accessibility Heroes",
    theme: "Making content visible to everyone",
    persona: "Luna",
    personaDescription: "a screen reader user exploring your content",
    activities: [
      {
        id: "alt-text-adventure",
        title: "Alt Text Adventure",
        duration: "2-3 min",
        scenario:
          "Meet Luna, a talented web developer who's excited to share her new photography portfolio website with her friend Marcus. Marcus has low vision and relies on screen reader technology to browse the web. Luna wants to ensure that Marcus can experience and appreciate all the beautiful landscape photos she's carefully curated for her site. She knows that without proper alt text, her stunning images will be invisible to Marcus and other screen reader users. Help Luna make her photo gallery accessible so everyone can enjoy her artistic vision!",
        task: "Add descriptive alt text to 4 landscape images",
        incompleteCode: `<img src="/golden-sunset-over-calm-lake.png" alt="" />
<img src="/snow-capped-mountain-peak.png" alt="" />
<img src="/turquoise-ocean-waves-on-beach.png" alt="" />
<img src="/dense-green-forest-with-sunlight.png" alt="" />`,
        solution: `<img src="/golden-sunset-over-calm-lake.png" alt="Golden sunset over calm lake with silhouetted mountains" />
<img src="/snow-capped-mountain-peak.png" alt="Snow-capped mountain peak against clear blue sky" />
<img src="/turquoise-ocean-waves-on-beach.png" alt="Turquoise ocean waves crashing on sandy beach" />
<img src="/dense-green-forest-with-sunlight.png" alt="Dense green forest with tall pine trees and dappled sunlight" />`,
        goal: "Write meaningful alt text",
        testDescription: "Screen reader simulation shows descriptions",
        successMetric: "Alt text is descriptive, not redundant",
        hints: [
          "Describe what you see, not just 'image' or 'photo'",
          "Include important details like colors, emotions, or actions",
          "Keep it concise but informative (under 125 characters)",
        ],
      },
      {
        id: "heading-hierarchy-quest",
        title: "Heading Hierarchy Quest",
        duration: "2-3 min",
        scenario:
          "Sofia is a content writer who just finished her first blog post about sustainable gardening. She's passionate about sharing her knowledge but realizes her article is hard to navigate. Her colleague Alex, who uses keyboard navigation and relies on heading structure to jump between sections, mentioned that the current heading organization makes it confusing to find specific topics. Help Sofia restructure her headings so readers like Alex can easily navigate through her valuable gardening tips!",
        task: "Fix heading structure (h1, h2, h3 in logical order)",
        incompleteCode: `<h1>Sustainable Gardening Guide</h1>
<h1>Getting Started</h1>
<h3>Choosing Your Plants</h3>
<h1>Maintenance Tips</h1>
<h3>Watering Schedule</h3>`,
        solution: `<h1>Sustainable Gardening Guide</h1>
<h2>Getting Started</h2>
<h3>Choosing Your Plants</h3>
<h2>Maintenance Tips</h2>
<h3>Watering Schedule</h3>`,
        goal: "Create logical heading structure",
        testDescription: "Heading navigation simulation",
        successMetric: "Logical heading structure",
        hints: [
          "Use only one h1 per page for the main title",
          "Follow sequential order: h1 → h2 → h3, don't skip levels",
          "Think of headings as an outline structure",
        ],
      },
      {
        id: "color-contrast-champion",
        title: "Color Contrast Champion",
        duration: "2-3 min",
        scenario:
          "Emma is designing a call-to-action button for her nonprofit's donation page. She chose a beautiful light gray text on a white background because it looks elegant and minimal. However, her grandmother Rose, who has age-related vision changes, mentioned she couldn't read the button text clearly during a family video call. Emma realizes that what looks stylish to her might be completely invisible to users with visual impairments. Help Emma create a button that's both beautiful and accessible to everyone, including users like Rose!",
        task: "Adjust colors to meet contrast requirements",
        incompleteCode: `<button style="color: #cccccc; background-color: white; padding: 12px 24px; border: 1px solid #eee; border-radius: 6px;">Donate Now</button>`,
        solution: `<button style="color: #ffffff; background-color: #0066cc; padding: 12px 24px; border: 1px solid #0066cc; border-radius: 6px;">Donate Now</button>`,
        goal: "Achieve proper contrast ratio",
        testDescription: "Built-in contrast checker",
        successMetric: "4.5:1 contrast ratio achieved",
        hints: [
          "WCAG AA requires 4.5:1 contrast ratio for normal text",
          "Dark text on light backgrounds or light text on dark backgrounds work best",
          "Use online contrast checkers to verify your color combinations",
        ],
      },
    ],
  },
  "2": {
    title: "Keyboard Navigation Masters",
    theme: "Making websites navigable without a mouse",
    persona: "Marcus",
    personaDescription: "who navigates using only his keyboard",
    activities: [
      {
        id: "tab-order-detective",
        title: "Tab Order Detective",
        duration: "2-3 min",
        scenario:
          "David is building a contact form for his freelance design business. He's excited about the modern layout but didn't realize the tab order jumps around confusingly. When his friend Jamie, who navigates exclusively with keyboard due to a motor disability, tried to fill out the form, she got frustrated because pressing Tab didn't move through the fields in a logical order. Help David fix the tab sequence so keyboard users like Jamie can smoothly navigate through his contact form!",
        task: "Fix tab order with tabindex",
        incompleteCode: `<form>
  <input tabindex="3" placeholder="Email" />
  <input tabindex="1" placeholder="Name" />
  <input tabindex="2" placeholder="Phone" />
  <button tabindex="4">Submit</button>
</form>`,
        solution: `<form>
  <input tabindex="1" placeholder="Name" />
  <input tabindex="2" placeholder="Phone" />
  <input tabindex="3" placeholder="Email" />
  <button tabindex="4">Submit</button>
</form>`,
        goal: "Create logical tab sequence",
        testDescription: "Tab through form simulation",
        successMetric: "Logical tab order",
        hints: [
          "Tab order should follow visual layout and logical flow",
          "Use positive tabindex values in sequential order",
          "Consider removing tabindex entirely to use natural DOM order",
        ],
      },
      {
        id: "focus-ring-rescuer",
        title: "Focus Ring Rescuer",
        duration: "2-3 min",
        scenario:
          "Taylor designed a sleek navigation menu with custom styling that removes the default focus outlines because they thought it looked 'cleaner.' However, when their colleague Sam, who uses keyboard navigation due to repetitive strain injury, tried to navigate the site, they couldn't tell which button was currently selected. Sam kept getting lost and couldn't complete basic tasks. Help Taylor add visible focus indicators that maintain the site's aesthetic while ensuring keyboard users like Sam can see exactly where they are!",
        task: "Add visible focus indicators",
        incompleteCode: `button { 
  outline: none; 
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}`,
        solution: `button { 
  outline: none; 
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

button:focus {
  outline: 2px solid #ffcc00;
  outline-offset: 2px;
}`,
        goal: "Provide clear focus indicators",
        testDescription: "Keyboard navigation preview",
        successMetric: "Clear focus indicators",
        hints: [
          "Never remove focus indicators without providing alternatives",
          "Use high contrast colors for focus outlines",
          "Consider outline-offset for better visual separation",
        ],
      },
      {
        id: "skip-link-creator",
        title: "Skip Link Creator",
        duration: "2-3 min",
        scenario:
          "Maya built a news website with a comprehensive navigation menu containing 20+ links. While this is great for discoverability, her user testing revealed that keyboard users like Jordan, who has limited mobility, have to tab through every single navigation link just to reach the main article content. Jordan mentioned it takes nearly a minute just to get to the actual news story! Help Maya add a skip link so keyboard users can jump directly to the main content and start reading immediately.",
        task: "Add skip navigation link",
        incompleteCode: `<nav>
  <a href="/home">Home</a>
  <a href="/news">News</a>
  <a href="/sports">Sports</a>
  <a href="/weather">Weather</a>
  <!-- ... 16 more navigation links ... -->
</nav>
<main id="main-content">
  <h1>Breaking News Story</h1>
  <p>Article content starts here...</p>
</main>`,
        solution: `<a href="#main-content" class="skip-link">Skip to main content</a>
<nav>
  <a href="/home">Home</a>
  <a href="/news">News</a>
  <a href="/sports">Sports</a>
  <a href="/weather">Weather</a>
  <!-- ... 16 more navigation links ... -->
</nav>
<main id="main-content">
  <h1>Breaking News Story</h1>
  <p>Article content starts here...</p>
</main>`,
        goal: "Enable content skipping",
        testDescription: "Tab to see skip link appear",
        successMetric: "Working skip link",
        hints: [
          "Skip links should be the first focusable element on the page",
          "Use descriptive text like 'Skip to main content'",
          "Consider hiding skip links until they receive focus",
        ],
      },
    ],
  },
  "3": {
    title: "Screen Reader Allies",
    theme: "Making content understandable to assistive technology",
    persona: "Sofia",
    personaDescription: "who relies on screen reader announcements",
    activities: [
      {
        id: "aria-label-wizard",
        title: "ARIA Label Wizard",
        duration: "2-3 min",
        scenario:
          "Chris designed a modern email interface with sleek icon-only buttons to save space. The trash, reply, and forward buttons look intuitive to sighted users, but when their beta tester Maria, who uses a screen reader due to blindness, tried the interface, she heard confusing announcements like 'button' with no description of what each button actually does. Maria couldn't tell if she was about to delete an important email or reply to it! Help Chris add proper labels so screen reader users like Maria know exactly what each button will do before clicking it.",
        task: "Add aria-label to icon buttons",
        incompleteCode: `<button><TrashIcon /></button>
<button><ReplyIcon /></button>
<button><ForwardIcon /></button>`,
        solution: `<button aria-label="Delete email"><TrashIcon /></button>
<button aria-label="Reply to email"><ReplyIcon /></button>
<button aria-label="Forward email"><ForwardIcon /></button>`,
        goal: "Provide clear button descriptions",
        testDescription: "Screen reader announcement preview",
        successMetric: "Clear button purpose announced",
        hints: [
          "Use aria-label for buttons with only icons",
          "Describe the action, not just the icon",
          "Keep labels concise but descriptive",
        ],
      },
      {
        id: "form-label-guardian",
        title: "Form Label Guardian",
        duration: "2-3 min",
        scenario:
          "Alex created a user registration form with beautiful floating labels that appear inside the input fields. While it looks modern and clean, their accessibility consultant Kevin, who uses screen reader software, pointed out that his screen reader can't properly associate the labels with the input fields. When Kevin tries to fill out the form, he hears 'edit text' for each field but has no idea what information to enter. Help Alex properly connect the labels to inputs so screen reader users like Kevin understand what each field is asking for!",
        task: "Associate labels with inputs",
        incompleteCode: `<div>
  <label>Full Name</label>
  <input type="text" placeholder="Enter your name" />
</div>
<div>
  <label>Email Address</label>
  <input type="email" placeholder="Enter your email" />
</div>`,
        solution: `<div>
  <label for="fullname">Full Name</label>
  <input id="fullname" type="text" placeholder="Enter your name" />
</div>
<div>
  <label for="email">Email Address</label>
  <input id="email" type="email" placeholder="Enter your email" />
</div>`,
        goal: "Link labels to inputs",
        testDescription: "Screen reader form navigation",
        successMetric: "All inputs properly labeled",
        hints: [
          "Use 'for' attribute on labels and matching 'id' on inputs",
          "Each input should have a unique id",
          "Labels should be descriptive and clear",
        ],
      },
      {
        id: "live-region-herald",
        title: "Live Region Herald",
        duration: "2-3 min",
        scenario:
          "Jordan built a dynamic form that shows success and error messages after submission. Sighted users can see the green 'Form submitted successfully!' message appear, but their user tester Patricia, who uses screen reader technology, never hears these important status updates. Patricia often submits forms multiple times because she doesn't know if her first submission worked. Help Jordan make these status messages audible to screen reader users like Patricia so they get immediate feedback about their form submissions!",
        task: "Add aria-live to status messages",
        incompleteCode: `<form>
  <input type="text" placeholder="Your message" />
  <button type="submit">Send</button>
</form>
<div id="status" style="color: green; margin-top: 10px;">
  Form submitted successfully!
</div>`,
        solution: `<form>
  <input type="text" placeholder="Your message" />
  <button type="submit">Send</button>
</form>
<div id="status" aria-live="polite" style="color: green; margin-top: 10px;">
  Form submitted successfully!
</div>`,
        goal: "Enable status announcements",
        testDescription: "Screen reader announcement simulation",
        successMetric: "Status changes announced",
        hints: [
          "Use aria-live='polite' for status messages",
          "Use aria-live='assertive' for urgent alerts",
          "Live regions announce content changes automatically",
        ],
      },
    ],
  },
  "4": {
    title: "Universal Design Champions",
    theme: "Comprehensive accessibility thinking",
    persona: "Everyone",
    personaDescription: "including users with diverse needs and preferences",
    activities: [
      {
        id: "responsive-text-resizer",
        title: "Responsive Text Resizer",
        duration: "2-3 min",
        scenario:
          "Morgan created a beautiful recipe blog with fixed-width containers and small text. Everything looks perfect on their high-resolution monitor, but when their grandfather Robert, who has age-related vision changes, tries to read the recipes, he zooms his browser to 200% to make the text readable. Unfortunately, the fixed layout causes horizontal scrolling and cuts off important ingredients! Robert gets frustrated and can't follow the recipes. Help Morgan make the layout flexible so users like Robert can zoom in comfortably while still accessing all the content.",
        task: "Fix layout for 200% zoom",
        incompleteCode: `<div style="width: 300px; font-size: 12px; overflow: hidden;">
  <h2>Chocolate Chip Cookies</h2>
  <p>A delicious recipe that's been in our family for generations...</p>
</div>`,
        solution: `<div style="max-width: 300px; font-size: 16px; overflow: visible;">
  <h2>Chocolate Chip Cookies</h2>
  <p>A delicious recipe that's been in our family for generations...</p>
</div>`,
        goal: "Support high zoom levels",
        testDescription: "Zoom simulation",
        successMetric: "Content remains usable at 200% zoom",
        hints: [
          "Use max-width instead of fixed width",
          "Use relative units like em or rem for text",
          "Avoid overflow: hidden on content containers",
        ],
      },
      {
        id: "motion-sensitivity-supporter",
        title: "Motion Sensitivity Supporter",
        duration: "2-3 min",
        scenario:
          "Casey designed an engaging loading screen with spinning animations and sliding transitions to make their app feel dynamic and modern. However, their colleague Sam, who has vestibular disorders, experiences dizziness and nausea when viewing the constant motion. Sam mentioned they have to look away from the screen or close the app entirely when these animations play. Help Casey respect users' motion preferences so people like Sam can use the app comfortably without triggering their vestibular symptoms.",
        task: "Add prefers-reduced-motion CSS",
        incompleteCode: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
}`,
        solution: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}`,
        goal: "Respect motion preferences",
        testDescription: "Reduced motion preview",
        successMetric: "Animations respect user preferences",
        hints: [
          "Use @media (prefers-reduced-motion: reduce) to detect user preference",
          "Disable or reduce animations for sensitive users",
          "Consider alternative loading indicators like progress bars",
        ],
      },
      {
        id: "multi-modal-master",
        title: "Multi-Modal Master",
        duration: "2-3 min",
        scenario:
          "Riley created an educational video series about web development fundamentals. The videos are informative and well-produced, but their student Lisa, who is deaf, can't access the audio content and feels left out of the learning experience. Additionally, their student Marcus, who has auditory processing difficulties, struggles to follow along with just the audio and would benefit from reading the content as well. Help Riley make the videos accessible to learners like Lisa and Marcus by providing multiple ways to access the same information.",
        task: "Add captions and transcript link",
        incompleteCode: `<video src="/tutorial.mp4" controls width="600">
  Your browser does not support the video tag.
</video>`,
        solution: `<video src="/tutorial.mp4" controls width="600">
  <track kind="captions" src="/tutorial-captions.vtt" srclang="en" label="English" default>
  Your browser does not support the video tag.
</video>
<p><a href="/tutorial-transcript.html">View full transcript</a></p>`,
        goal: "Provide alternative content formats",
        testDescription: "Caption display check",
        successMetric: "Captions visible and accurate",
        hints: [
          "Use <track> element with kind='captions' for video captions",
          "Provide transcript links for complete accessibility",
          "Ensure captions are synchronized with audio",
        ],
      },
    ],
  },
}

interface ActivityPageProps {
  params: {
    dayNumber: string
    activityId: string
  }
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const dayData = learningDays[params.dayNumber as keyof typeof learningDays]
  const activity = dayData?.activities.find((a) => a.id === params.activityId)

  if (!dayData || !activity) {
    notFound()
  }

  const dayNumber = Number.parseInt(params.dayNumber)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/day/${dayNumber}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Day {dayNumber}
                </Button>
              </Link>
              <Badge variant="secondary">Day {dayNumber}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">{activity.duration}</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Instructions Panel */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{activity.title}</h1>
              <p className="text-muted-foreground">{dayData.title}</p>
            </div>

            {/* Scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{activity.scenario}</p>
              </CardContent>
            </Card>

            {/* Task */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Your Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{activity.task}</p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">Success Metric:</p>
                  <p className="text-sm text-muted-foreground">{activity.successMetric}</p>
                </div>
              </CardContent>
            </Card>

            {/* Hints */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {activity.hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-primary" />
                  Code Editor
                </CardTitle>
                <CardDescription>Edit the code below to complete the activity</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  initialCode={activity.incompleteCode}
                  solution={activity.solution}
                  hints={activity.hints}
                  testDescription={activity.testDescription}
                  dayNumber={dayNumber}
                  activityId={params.activityId}
                  activityTitle={activity.title}
                  activityType={
                    activity.id.includes("alt-text")
                      ? "alt-text"
                      : activity.id.includes("heading")
                        ? "heading"
                        : activity.id.includes("contrast")
                          ? "contrast"
                          : activity.id.includes("tab-order")
                            ? "tab-order"
                            : activity.id.includes("focus")
                              ? "focus"
                              : activity.id.includes("skip-link")
                                ? "skip-link"
                                : activity.id.includes("aria-label")
                                  ? "aria-label"
                                  : activity.id.includes("form-label")
                                    ? "form-label"
                                    : activity.id.includes("live-region")
                                      ? "live-region"
                                      : activity.id.includes("responsive")
                                        ? "responsive"
                                        : activity.id.includes("motion")
                                          ? "motion"
                                          : activity.id.includes("captions")
                                            ? "captions"
                                            : "alt-text"
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
