/**
 * Interactive Learning: the 50 everyday scenarios from the Zenomi mindfulness
 * session map, each paired with one session from the app's audio library.
 * Nine scenarios also have a Janey story video.
 *
 * Session lengths are measured from the MP3s, not taken from the map, whose
 * minute labels do not match the audio.
 */

export type Category = "school" | "home" | "friends";

export const categories: { id: Category; label: string }[] = [
  { id: "school", label: "At school" },
  { id: "home", label: "At home" },
  { id: "friends", label: "Friendships" },
];

export interface Session { title: string; kind: string; about: string; src: string; seconds: number }

export const sessions: Record<string, Session> = {
  "Calm Before Exam": { title: "Calm Before Exam", kind: "Micro moment", about: "Steady racing thoughts before walking in.", src: "/interactive/audio/calm_before_exam.mp3", seconds: 711 },
  "Stop Overthinking": { title: "Stop Overthinking", kind: "Micro moment", about: "Cut the thought loop with a gentle attention reset.", src: "/interactive/audio/stop_overthinking.mp3", seconds: 795 },
  "Reset After Fight": { title: "Reset After Fight", kind: "Micro moment", about: "Soften the chest and drop the shoulders after conflict.", src: "/interactive/audio/reset_after_fight.mp3", seconds: 747 },
  "Panic Reset": { title: "Panic Reset", kind: "Micro moment", about: "Five-senses grounding: you are safe right now.", src: "/interactive/audio/panic_reset.mp3", seconds: 785 },
  "Social Anxiety Reset": { title: "Social Anxiety Reset", kind: "Micro moment", about: "Walk in with steadier breath and softer eyes.", src: "/interactive/audio/social_anxiety_reset.mp3", seconds: 761 },
  "Box Breathing": { title: "Box Breathing", kind: "Breathing", about: "4-4-4-4: inhale, hold, exhale, hold.", src: "/interactive/audio/box_breathing.mp3", seconds: 677 },
  "Physiological Sigh": { title: "Physiological Sigh", kind: "Breathing", about: "Two inhales, one long exhale.", src: "/interactive/audio/physiological_sigh.mp3", seconds: 686 },
  "Deep Belly Breathing": { title: "Deep Belly Breathing", kind: "Breathing", about: "Slow, diaphragmatic breathing.", src: "/interactive/audio/deep_belly_breathing.mp3", seconds: 616 },
  "Rain Window Drift": { title: "Rain Window Drift", kind: "Soundscape", about: "A rain soundscape that fades out on its own.", src: "/interactive/audio/rain_window_drift.mp3", seconds: 192 },
};

export interface Scenario {
  n: number;
  category: Category;
  text: string;
  session: string;
  why: string;
  video?: { slug: string; title: string; src: string; poster: string; seconds: number };
}

export const scenarios: Scenario[] = [
  { n: 1, category: "school", text: "You studied for a test but freeze when you see the first question.", session: "Panic Reset", why: "Freezing is a panic spike; five-senses grounding brings you back to the page.", video: { slug: "mind-goes-blank", title: "When Your Mind Goes Blank", src: "/interactive/video/mind-goes-blank.mp4", poster: "/interactive/poster/mind-goes-blank.jpg", seconds: 52 } },
  { n: 2, category: "school", text: "Your teacher calls on you, and you worry classmates will laugh if you answer incorrectly.", session: "Social Anxiety Reset", why: "Fear of being judged for answering; a short reset steadies your voice before you speak.", video: { slug: "teacher-calls-on-you", title: "When Your Teacher Calls on You", src: "/interactive/video/teacher-calls-on-you.mp4", poster: "/interactive/poster/teacher-calls-on-you.jpg", seconds: 52 } },
  { n: 3, category: "school", text: "You’re assigned a group project, but one person leaves everyone else to do the work.", session: "Reset After Fight", why: "Frustration at an unfair workload; settle the heat before raising it calmly.", video: { slug: "group-project", title: "Group Project, One Missing Member", src: "/interactive/video/group-project.mp4", poster: "/interactive/poster/group-project.jpg", seconds: 74 } },
  { n: 4, category: "school", text: "A friend asks to copy your homework right before class.", session: "Box Breathing", why: "A steady breathing pause helps you say no clearly instead of reacting.", video: { slug: "copy-homework", title: "A Friend Asks to Copy Your Homework", src: "/interactive/video/copy-homework.mp4", poster: "/interactive/poster/copy-homework.jpg", seconds: 79 } },
  { n: 5, category: "school", text: "You don’t understand a lesson but feel embarrassed to ask for help.", session: "Social Anxiety Reset", why: "Embarrassment about asking; calm the inner critic first, then ask.", video: { slug: "ask-for-help", title: "Embarrassed to Ask for Help", src: "/interactive/video/ask-for-help.mp4", poster: "/interactive/poster/ask-for-help.jpg", seconds: 44 } },
  { n: 6, category: "school", text: "You arrive late because of transportation problems, and your teacher assumes you weren’t trying.", session: "Reset After Fight", why: "Feeling misjudged; release the sting before explaining." },
  { n: 7, category: "school", text: "You have several assignments due tomorrow and don’t know where to start.", session: "Stop Overthinking", why: "Overwhelm loop; reset attention, then plan one task at a time." },
  { n: 8, category: "school", text: "You want to join a club but worry you won’t fit in.", session: "Social Anxiety Reset", why: "Pre-event nerves about fitting in; a short reset just before you walk in.", video: { slug: "finding-my-place", title: "Finding My Place", src: "/interactive/video/finding-my-place.mp4", poster: "/interactive/poster/finding-my-place.jpg", seconds: 35 } },
  { n: 9, category: "school", text: "You walk into the cafeteria and can’t find anyone to sit with.", session: "Social Anxiety Reset", why: "Sudden social discomfort; a quick, discreet reset in the moment." },
  { n: 10, category: "school", text: "Someone makes fun of your clothes, hairstyle, or appearance in the hallway.", session: "Reset After Fight", why: "Hurtful comment; release the body reaction, then reflect." },
  { n: 11, category: "school", text: "You receive a lower grade than expected and feel like your effort didn’t matter.", session: "Stop Overthinking", why: "Disappointment spiral; break the \"effort is pointless\" loop." },
  { n: 12, category: "school", text: "Your family expects high grades, and you feel pressure to be perfect.", session: "Stop Overthinking", why: "Perfectionism pressure; quiet the \"must be perfect\" loop before it builds." },
  { n: 13, category: "school", text: "You have to give a presentation and feel nervous about speaking in front of everyone.", session: "Calm Before Exam", why: "Performance nerves; a short session just before you start speaking." },
  { n: 14, category: "school", text: "You hear classmates making an offensive joke and aren’t sure how to respond.", session: "Box Breathing", why: "Moral uncertainty; a calm pause to choose your response." },
  { n: 15, category: "school", text: "A teacher corrects you in front of the class, and you feel embarrassed.", session: "Physiological Sigh", why: "Public embarrassment; the fastest way to take the edge off in the moment." },
  { n: 16, category: "school", text: "You’re exhausted from staying up late and struggle to pay attention.", session: "Deep Belly Breathing", why: "Fatigue; slow, deep breaths to wake the body up without caffeine.", video: { slug: "sleep-wont-come", title: "When Sleep Won't Come", src: "/interactive/video/sleep-wont-come.mp4", poster: "/interactive/poster/sleep-wont-come.jpg", seconds: 53 } },
  { n: 17, category: "school", text: "You want to take an elective you enjoy, but others tell you to choose something more practical.", session: "Stop Overthinking", why: "Second-guessing a choice; get clarity on what you actually value." },
  { n: 18, category: "school", text: "You see another student being excluded and wonder whether to step in.", session: "Box Breathing", why: "Courage to step in; steady body and voice before acting." },
  { n: 19, category: "home", text: "You want time alone after school, but your family expects you to talk immediately.", session: "Deep Belly Breathing", why: "Decompress after school before talking with family." },
  { n: 20, category: "home", text: "Your parent or caregiver asks you to put your phone away while you’re in the middle of a conversation.", session: "Physiological Sigh", why: "Irritation at interruption; a quick reset to respond respectfully.", video: { slug: "one-more-message", title: "One More Message", src: "/interactive/video/one-more-message.mp4", poster: "/interactive/poster/one-more-message.jpg", seconds: 48 } },
  { n: 21, category: "home", text: "You and a sibling argue about sharing a room, clothes, or other belongings.", session: "Reset After Fight", why: "Sibling argument; cool down before negotiating." },
  { n: 22, category: "home", text: "You’re expected to finish chores while also keeping up with homework.", session: "Stop Overthinking", why: "Juggling chores and homework; reset, then prioritise." },
  { n: 23, category: "home", text: "Your family compares your grades or behavior with a sibling’s.", session: "Reset After Fight", why: "Comparison hurts; soften the sting before you answer." },
  { n: 24, category: "home", text: "You want more independence, but your caregiver says you haven’t earned it yet.", session: "Box Breathing", why: "Frustration about independence; a calm tone for the conversation." },
  { n: 25, category: "home", text: "You disagree with a household rule and struggle to explain your point calmly.", session: "Box Breathing", why: "Disagreeing with a rule; regulate first so you can explain calmly." },
  { n: 26, category: "home", text: "You’re asked to watch younger siblings when you already have plans.", session: "Physiological Sigh", why: "Plans disrupted; quick release of frustration before replying." },
  { n: 27, category: "home", text: "You hear adults arguing and feel distracted or uneasy afterward.", session: "Panic Reset", why: "Uneasy after hearing arguing; five-senses grounding says you are safe now." },
  { n: 28, category: "home", text: "You want to discuss something personal but worry your family will judge you.", session: "Social Anxiety Reset", why: "Worry about judgement; steady yourself before opening up." },
  { n: 29, category: "home", text: "Your family can’t afford something your friends have, and you feel left out.", session: "Stop Overthinking", why: "Feeling left out about money; break the comparison spiral." },
  { n: 30, category: "home", text: "Someone at home enters your room or reads your messages without asking.", session: "Reset After Fight", why: "Privacy violated; settle anger before setting a boundary." },
  { n: 31, category: "home", text: "You’re trying to finish homework, but your home is noisy and crowded.", session: "Rain Window Drift", why: "Noisy home; a rain soundscape masks the noise so you can settle into work." },
  { n: 32, category: "home", text: "You make a mistake and hesitate to tell your caregiver because you fear their reaction.", session: "Panic Reset", why: "Fear of their reaction; ground yourself first, then speak." },
  { n: 33, category: "home", text: "You want to spend time with friends, but your family has made plans for you.", session: "Physiological Sigh", why: "Disappointment about plans; release frustration, then talk." },
  { n: 34, category: "home", text: "You feel that adults listen to your behavior more than to what you’re trying to say.", session: "Box Breathing", why: "Feeling unheard; calm delivery so your message lands." },
  { n: 35, category: "friends", text: "Your friends make plans in front of you but don’t invite you.", session: "Reset After Fight", why: "Hurt at being left out; soften the feeling before you decide what it means." },
  { n: 36, category: "friends", text: "A friend shares something private that you trusted them to keep confidential.", session: "Reset After Fight", why: "Broken trust; process the hurt before confronting the friend." },
  { n: 37, category: "friends", text: "You feel pressured to wear certain brands or follow trends to fit in.", session: "Stop Overthinking", why: "Pressure to follow trends; reconnect with your own choices." },
  { n: 38, category: "friends", text: "Your friends encourage you to skip class, and you don’t want to disappoint them.", session: "Box Breathing", why: "Peer pressure to skip; steady yourself to say no." },
  { n: 39, category: "friends", text: "Someone leaves your message on read, and you start wondering whether they’re upset with you.", session: "Stop Overthinking", why: "Classic \"left on read\" overthinking loop." },
  { n: 40, category: "friends", text: "A joke in a group chat hurts your feelings, but everyone else thinks it’s funny.", session: "Reset After Fight", why: "Hurt by a group-chat joke; settle before deciding to speak up." },
  { n: 41, category: "friends", text: "Two friends are arguing, and both expect you to take their side.", session: "Box Breathing", why: "Caught in the middle; stay calm and neutral." },
  { n: 42, category: "friends", text: "You want to say no to a favor but worry that your friend will call you selfish.", session: "Box Breathing", why: "Saying no to a favour; calm voice, fewer guilt thoughts." },
  { n: 43, category: "friends", text: "A friend seems distant, and you don’t know whether to ask what’s wrong.", session: "Stop Overthinking", why: "Uncertainty about a distant friend; calm the worry, then reach out." },
  { n: 44, category: "friends", text: "You see photos of a gathering you weren’t invited to and feel excluded.", session: "Reset After Fight", why: "Excluded from a gathering; release the hurt before you keep scrolling.", video: { slug: "left-out", title: "Left Out", src: "/interactive/video/left-out.mp4", poster: "/interactive/poster/left-out.jpg", seconds: 46 } },
  { n: 45, category: "friends", text: "Someone posts a photo or video of you without asking.", session: "Box Breathing", why: "Photo posted without consent; calm before asking for removal." },
  { n: 46, category: "friends", text: "Your friends pressure you to try vaping, alcohol, or another substance.", session: "Box Breathing", why: "Substance pressure; steady breath to refuse with confidence." },
  { n: 47, category: "friends", text: "You develop a crush on someone and feel unsure about expressing your feelings.", session: "Social Anxiety Reset", why: "Crush nerves; calm the flutter before expressing feelings." },
  { n: 48, category: "friends", text: "Someone you’re dating expects you to reply immediately and gets upset when you don’t.", session: "Box Breathing", why: "Pressure to reply instantly; calm down, then set a healthy boundary." },
  { n: 49, category: "friends", text: "A friend repeatedly makes comments about your body or eating habits, and you want them to stop.", session: "Box Breathing", why: "Body comments; regulate, then ask clearly for them to stop." },
  { n: 50, category: "friends", text: "You’re changing interests or values and wonder whether your current friendships still feel right.", session: "Stop Overthinking", why: "Changing interests and values; quiet the loop so you can hear what you want." },
];

/** The scenarios that have a Janey story video, in order. */
export const stories = scenarios.filter((s) => s.video);

export const storyBySlug = (slug: string) => stories.find((s) => s.video!.slug === slug);
