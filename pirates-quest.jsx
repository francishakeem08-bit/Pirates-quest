import { useState, useEffect, useRef } from "react";
import React from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const DEVIL_FRUITS = [
  { name: "Gomu Gomu no Mi", type: "Paramecia", power: "Rubber Body", icon: "🍑", rarity: "Rare" },
  { name: "Mera Mera no Mi", type: "Logia", power: "Fire Control", icon: "🔥", rarity: "Legendary" },
  { name: "Hie Hie no Mi", type: "Logia", power: "Ice Control", icon: "❄️", rarity: "Legendary" },
  { name: "Yami Yami no Mi", type: "Logia", power: "Darkness", icon: "🌑", rarity: "Mythic" },
  { name: "Ope Ope no Mi", type: "Paramecia", power: "Room Manipulation", icon: "💠", rarity: "Legendary" },
  { name: "Bari Bari no Mi", type: "Paramecia", power: "Barrier Creation", icon: "🛡️", rarity: "Uncommon" },
  { name: "Tori Tori no Mi", type: "Zoan", power: "Phoenix Form", icon: "🦅", rarity: "Mythic" },
];

const MYSTERY_REWARDS = {
  financial: [
    { name: "The Compound Effect", icon: "📈", desc: "Small daily actions create massive long-term wealth.", rarity: "Rare", type: "book" },
    { name: "50/30/20 Budget Rule", icon: "💡", desc: "50% needs, 30% wants, 20% savings & investments.", rarity: "Uncommon", type: "tip" },
    { name: "Rich Dad Poor Dad", icon: "📗", desc: "Learn the difference between assets and liabilities.", rarity: "Rare", type: "book" },
    { name: "Emergency Fund", icon: "🏦", desc: "Save 3–6 months of expenses before investing.", rarity: "Uncommon", type: "tip" },
    { name: "The Psychology of Money", icon: "🧠", desc: "Understand your relationship with wealth and risk.", rarity: "Legendary", type: "book" },
    { name: "Index Fund Insight", icon: "📊", desc: "Low-cost index funds beat most active managers long-term.", rarity: "Rare", type: "tip" },
  ],
  productivity: [
    { name: "The 1% Rule", icon: "⚡", desc: "Improve just 1% daily. In a year you're 37x better.", rarity: "Rare", type: "hack" },
    { name: "Deep Work Protocol", icon: "🎯", desc: "90-min focus blocks with zero distractions = 4x output.", rarity: "Legendary", type: "hack" },
    { name: "Atomic Habits", icon: "📘", desc: "Tiny habits compounded over time reshape your identity.", rarity: "Legendary", type: "book" },
    { name: "Time Blocking", icon: "🗓️", desc: "Schedule every hour the night before. Own your day.", rarity: "Uncommon", type: "hack" },
    { name: "The 5-Second Rule", icon: "⏱️", desc: "Count 5-4-3-2-1 and move before doubt kicks in.", rarity: "Uncommon", type: "hack" },
  ],
  mindset: [
    { name: "Stoic's Wisdom", icon: "🏛️", desc: "Control what you can. Release what you cannot. That is power.", rarity: "Mythic", type: "wisdom" },
    { name: "Think & Grow Rich", icon: "🌟", desc: "Desire, faith, and persistence are the roots of all achievement.", rarity: "Legendary", type: "book" },
    { name: "Growth Mindset Unlock", icon: "🔓", desc: "Your abilities are not fixed. Every challenge is training.", rarity: "Rare", type: "wisdom" },
    { name: "The Power of Now", icon: "🌅", desc: "Master the present moment and you master your life.", rarity: "Rare", type: "book" },
  ],
};

const SHIP_PARTS = ["Hull", "Mast", "Sail", "Figurehead", "Cannon", "Anchor", "Helm"];

const TASKS = {
  morning: [
    { id: "m1", name: "100 Push-ups", category: "Strength", points: 50, xp: 30, stat: "attack", icon: "💪", tip: "Break into 10 sets of 10. Rest 30s between sets. Build the warrior body." },
    { id: "m2", name: "Morning Meditation (10 min)", category: "Mind", points: 30, xp: 20, stat: "wisdom", icon: "🧘", tip: "Sit still, focus on your breath. Clarity in the morning = power all day." },
    { id: "m3", name: "Cold Shower", category: "Endurance", points: 40, xp: 25, stat: "defense", icon: "🧊", tip: "Start warm, finish 30s cold. Builds iron discipline and mental toughness." },
    { id: "m4", name: "Write Today's Goals & Intentions", category: "Life Skills", points: 25, xp: 15, stat: "wisdom", icon: "✍️", tip: "3 goals, 3 intentions. Where focus goes, energy flows. Plan your voyage." },
    { id: "m5", name: "Review Your Budget / Savings", category: "Finance", points: 35, xp: 22, stat: "wealth", icon: "💰", tip: "Check your accounts. Know your numbers. A pirate who doesn't count their treasure loses it." },
  ],
  afternoon: [
    { id: "a1", name: "200 Squats", category: "Strength", points: 60, xp: 35, stat: "attack", icon: "🏋️", tip: "Go below parallel. 4 sets of 50, 1 min rest. Build legs like a sea giant." },
    { id: "a2", name: "1 Hour Run / Walk", category: "Endurance", points: 70, xp: 40, stat: "defense", icon: "🏃", tip: "Run what you can, walk the rest. Distance is distance. Keep moving forward." },
    { id: "a3", name: "Read 20 Pages (Self-Growth)", category: "Mind", points: 35, xp: 22, stat: "wisdom", icon: "📚", tip: "Choose books on mindset, productivity, investing, or leadership. Knowledge is a weapon." },
    { id: "a4", name: "Financial Literacy Lesson (15 min)", category: "Finance", points: 40, xp: 25, stat: "wealth", icon: "📈", tip: "Watch a video, read an article — compound interest, budgeting, stocks, or crypto basics." },
    { id: "a5", name: "Learn a New Skill (20 min)", category: "Life Skills", points: 40, xp: 25, stat: "wisdom", icon: "🧠", tip: "A language, coding, design, cooking — any skill. Every day you grow sharper." },
  ],
  evening: [
    { id: "e1", name: "Stretching (15 min)", category: "Recovery", points: 20, xp: 12, stat: "endurance", icon: "🧘", tip: "Hold each stretch 30s. Hips, back, hamstrings. Recovery is part of the grind." },
    { id: "e2", name: "Journal: Wins, Lessons & Plans", category: "Mind", points: 30, xp: 18, stat: "wisdom", icon: "📔", tip: "What went well? What did you learn? What will you do tomorrow? Review your map." },
    { id: "e3", name: "Gratitude List (3 items)", category: "Mind", points: 20, xp: 12, stat: "luck", icon: "🙏", tip: "3 real things to be grateful for. Small things count. Rewires your mind for abundance." },
    { id: "e4", name: "Track One Financial Goal", category: "Finance", points: 35, xp: 22, stat: "wealth", icon: "💎", tip: "Log a saving, note an expense, or update a goal. Wealth is built in small daily steps." },
    { id: "e5", name: "Sleep by 11pm", category: "Life Skills", points: 35, xp: 22, stat: "endurance", icon: "😴", tip: "Sleep is where your body repairs and your mind consolidates what you learned. Guard it." },
  ],
};

const HAKI_LEVELS = [
  { name: "No Haki", threshold: 0, color: "#666", desc: "Your journey begins..." },
  { name: "Observation Haki", threshold: 200, color: "#4fc3f7", desc: "You can sense the presence of others." },
  { name: "Armament Haki", threshold: 500, color: "#90a4ae", desc: "Your body is clad in invisible armor." },
  { name: "Advanced Armament", threshold: 1000, color: "#b0bec5", desc: "You can emit Haki from your body." },
  { name: "Conqueror's Haki", threshold: 2000, color: "#ffd700", desc: "You possess the qualities of a King." },
];

const JOLLY_ROGERS = ["💀", "⚓", "🏴‍☠️", "⚔️", "🌊", "🔱", "👁️"];

const SKIN_TONES = [
  { id: "s1", color: "#FDDBB4", label: "Light" },
  { id: "s2", color: "#E8B88A", label: "Medium Light" },
  { id: "s3", color: "#C8883C", label: "Medium" },
  { id: "s4", color: "#8D5524", label: "Medium Dark" },
  { id: "s5", color: "#4A2C0A", label: "Dark" },
  { id: "s6", color: "#1A0A00", label: "Deep" },
];

// Fortnite-style locker: each item has a slot, rarity, gradient, and unlock condition
const LOCKER = {
  // ── OUTFITS (character skins) ─────────────────────────────────
  outfits: [
    {
      id: "o1", slot: "outfit", label: "Rookie Pirate", icon: "🥋",
      desc: "Every legend starts somewhere.",
      rarity: "Common", gradient: ["#555", "#333"],
      unlocked: true,
    },
    {
      id: "o2", slot: "outfit", label: "Sea Marauder", icon: "🧥",
      desc: "A weathered coat earned through the first voyage.",
      rarity: "Uncommon", gradient: ["#2e7d32", "#1b5e20"],
      unlockAt: 200,
    },
    {
      id: "o3", slot: "outfit", label: "Iron Warrior", icon: "🛡️",
      desc: "Forged in battle. Hardened by discipline.",
      rarity: "Rare", gradient: ["#1565c0", "#0d47a1"],
      unlockAt: 500,
    },
    {
      id: "o4", slot: "outfit", label: "The Captain", icon: "🎩",
      desc: "You command respect before you even speak.",
      rarity: "Epic", gradient: ["#6a1b9a", "#4a148c"],
      unlockAt: 1000,
    },
    {
      id: "o5", slot: "outfit", label: "Inferno Cloak", icon: "🔥",
      desc: "The sea parts for those who burn this bright.",
      rarity: "Legendary", gradient: ["#e65100", "#bf360c"],
      unlockAt: 1500,
    },
    {
      id: "o6", slot: "outfit", label: "Warlord Supreme", icon: "👘",
      desc: "The rarest skin. Only Kings wear this.",
      rarity: "Mythic", gradient: ["#b8860b", "#8b6914"],
      unlockAt: 2000,
    },
  ],

  // ── BACK BLINGS ──────────────────────────────────────────────
  backblings: [
    {
      id: "b1", slot: "backbling", label: "Sailor's Pack", icon: "🎒",
      desc: "The basics. All you need for now.",
      rarity: "Common", gradient: ["#555", "#333"],
      unlocked: true,
    },
    {
      id: "b2", slot: "backbling", label: "Jolly Roger Cape", icon: "🏴‍☠️",
      desc: "Your flag flies behind you wherever you go.",
      rarity: "Uncommon", gradient: ["#2e7d32", "#1b5e20"],
      unlockAt: 300,
    },
    {
      id: "b3", slot: "backbling", label: "Haki Wings", icon: "🌀",
      desc: "Pure Haki energy trails your every move.",
      rarity: "Rare", gradient: ["#1565c0", "#0d47a1"],
      unlockAt: 500,
    },
    {
      id: "b4", slot: "backbling", label: "Treasure Chest", icon: "📦",
      desc: "You carry your wealth on your back.",
      rarity: "Epic", gradient: ["#6a1b9a", "#4a148c"],
      unlockAt: 1000,
    },
    {
      id: "b5", slot: "backbling", label: "Phoenix Wings", icon: "🦅",
      desc: "Rise. Every single time.",
      rarity: "Legendary", gradient: ["#e65100", "#bf360c"],
      unlockAt: 1500,
    },
    {
      id: "b6", slot: "backbling", label: "Devil Fruit Aura", icon: "🍑",
      desc: "Only those who've eaten the fruit carry this energy.",
      rarity: "Mythic", gradient: ["#b8860b", "#8b6914"],
      requiresFruit: true,
    },
  ],

  // ── HARVESTING TOOLS (weapons) ────────────────────────────────
  pickaxes: [
    {
      id: "p1", slot: "pickaxe", label: "Cutlass", icon: "🗡️",
      desc: "The classic pirate blade.",
      rarity: "Common", gradient: ["#555", "#333"],
      unlocked: true,
    },
    {
      id: "p2", slot: "pickaxe", label: "Flintlock", icon: "🔫",
      desc: "For those who prefer range.",
      rarity: "Uncommon", gradient: ["#2e7d32", "#1b5e20"],
      unlockAt: 400,
    },
    {
      id: "p3", slot: "pickaxe", label: "Trident", icon: "🔱",
      desc: "Command the sea itself.",
      rarity: "Rare", gradient: ["#1565c0", "#0d47a1"],
      unlockAt: 700,
    },
    {
      id: "p4", slot: "pickaxe", label: "Dual Blades", icon: "⚔️",
      desc: "Two swords. Double the discipline.",
      rarity: "Epic", gradient: ["#6a1b9a", "#4a148c"],
      unlockAt: 1200,
    },
    {
      id: "p5", slot: "pickaxe", label: "Conqueror's Staff", icon: "👑",
      desc: "The weapon of a King.",
      rarity: "Mythic", gradient: ["#b8860b", "#8b6914"],
      unlockAt: 2000,
    },
  ],

  // ── SPRAYS (emotes/effects) ───────────────────────────────────
  sprays: [
    {
      id: "sp1", slot: "spray", label: "Fist Pump", icon: "✊",
      desc: "Default victory move.",
      rarity: "Common", gradient: ["#555", "#333"],
      unlocked: true,
    },
    {
      id: "sp2", slot: "spray", label: "Sea Laugh", icon: "😂",
      desc: "Laugh in the face of the storm.",
      rarity: "Uncommon", gradient: ["#2e7d32", "#1b5e20"],
      unlockAt: 250,
    },
    {
      id: "sp3", slot: "spray", label: "Haki Burst", icon: "💥",
      desc: "Release your Haki energy.",
      rarity: "Rare", gradient: ["#1565c0", "#0d47a1"],
      unlockAt: 600,
    },
    {
      id: "sp4", slot: "spray", label: "Gold Rain", icon: "💰",
      desc: "Let it rain. You've earned it.",
      rarity: "Legendary", gradient: ["#e65100", "#bf360c"],
      unlockAt: 1500,
    },
  ],
};

const CATEGORY_COLORS = {
  Strength: "#ff6b35", Mind: "#ce93d8", Finance: "#a5d6a7",
  "Life Skills": "#4fc3f7", Endurance: "#66bb6a", Recovery: "#80cbc4",
};

const RARITY_COLORS = {
  Uncommon: "#66bb6a", Rare: "#4fc3f7", Legendary: "#ffd700", Mythic: "#ce93d8",
};

const STREAK_MILESTONES = [
  {
    days: 3,
    title: "First Voyage",
    desc: "3 days in. The sea is calling and you answered.",
    icon: "⚓",
    rarity: "Uncommon",
    gradient: ["#1a4a1a", "#0d2e0d"],
    glow: "#66bb6a",
    rewards: [
      { icon: "💎", text: "+150 Bonus Points" },
      { icon: "🧥", text: "Sea Marauder outfit unlocked early" },
    ],
  },
  {
    days: 7,
    title: "One Week Warrior",
    desc: "7 days straight. Most people quit by now. You didn't.",
    icon: "🔥",
    rarity: "Rare",
    gradient: ["#0d2a5e", "#061535"],
    glow: "#4fc3f7",
    rewards: [
      { icon: "💎", text: "+500 Bonus Points" },
      { icon: "📈", text: "+10 to all Growth Stats" },
      { icon: "🎒", text: "Jolly Roger Cape back bling unlocked" },
    ],
  },
  {
    days: 14,
    title: "Fortnight Captain",
    desc: "Two full weeks. Your discipline is becoming your identity.",
    icon: "🌊",
    rarity: "Rare",
    gradient: ["#0d2a5e", "#061535"],
    glow: "#4fc3f7",
    rewards: [
      { icon: "💎", text: "+800 Bonus Points" },
      { icon: "🔱", text: "Trident harvesting tool unlocked" },
      { icon: "🧠", text: "+15 Wisdom" },
    ],
  },
  {
    days: 30,
    title: "The Grand Line",
    desc: "30 days. You've crossed into waters most never see.",
    icon: "🌟",
    rarity: "Epic",
    gradient: ["#3a0a5e", "#1e0535"],
    glow: "#ce93d8",
    rewards: [
      { icon: "💎", text: "+2,000 Bonus Points" },
      { icon: "🎩", text: "The Captain outfit unlocked" },
      { icon: "📦", text: "Treasure Chest back bling unlocked" },
      { icon: "💰", text: "+20 Wealth Stat" },
    ],
  },
  {
    days: 60,
    title: "New World Pirate",
    desc: "60 days. You have entered the New World. Few make it here.",
    icon: "👑",
    rarity: "Legendary",
    gradient: ["#5e2e00", "#2e1500"],
    glow: "#ffd700",
    rewards: [
      { icon: "💎", text: "+5,000 Bonus Points" },
      { icon: "🔥", text: "Inferno Cloak outfit unlocked" },
      { icon: "🦅", text: "Phoenix Wings back bling unlocked" },
      { icon: "⚔️", text: "Dual Blades unlocked" },
    ],
  },
  {
    days: 100,
    title: "Pirate King",
    desc: "100 days. You didn't just change your habits. You changed who you are.",
    icon: "🏴‍☠️",
    rarity: "Mythic",
    gradient: ["#5e4a00", "#2e2400"],
    glow: "#ffec6e",
    rewards: [
      { icon: "💎", text: "+10,000 Bonus Points" },
      { icon: "👘", text: "Warlord Supreme outfit unlocked" },
      { icon: "👑", text: "Conqueror's Staff unlocked" },
      { icon: "🍑", text: "Devil Fruit Aura unlocked" },
      { icon: "💰", text: "+50 to all Growth Stats" },
    ],
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap');
  @keyframes floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse      { 0%,100%{box-shadow:0 0 18px rgba(212,175,55,0.25)} 50%{box-shadow:0 0 36px rgba(212,175,55,0.55)} }
  @keyframes fadeIn     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInFast { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake      { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-6deg)} 75%{transform:rotate(6deg)} }
  @keyframes slideDown  { from{opacity:0;transform:translate(-50%,-16px)} to{opacity:1;transform:translate(-50%,0)} }
  @keyframes glowPulse  { 0%,100%{text-shadow:0 0 8px rgba(212,175,55,0.25)} 50%{text-shadow:0 0 28px rgba(212,175,55,0.75)} }
  @keyframes borderPulse{ 0%,100%{box-shadow:0 0 16px rgba(212,175,55,0.1)} 50%{box-shadow:0 0 36px rgba(212,175,55,0.3)} }
  @keyframes spin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes popIn      { 0%{transform:scale(0.82);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  @keyframes activeTab  { from{width:0} to{width:20px} }
  @keyframes hakiRipple { 0%{transform:scale(0);opacity:0.8} 100%{transform:scale(4);opacity:0} }
  @keyframes hakiFlash  { 0%,100%{opacity:0} 10%,90%{opacity:1} }
  @keyframes hakiText   { 0%{opacity:0;transform:scale(0.5) translateY(20px)} 60%{transform:scale(1.08) translateY(-4px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes hakiOrb    { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.3);opacity:1} }
  @keyframes hakiShockwave { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 100%{transform:translate(-50%,-50%) scale(8);opacity:0} }
  @keyframes hakiSweep  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  * { box-sizing:border-box; margin:0; padding:0; }
  ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#080810} ::-webkit-scrollbar-thumb{background:#d4af37;border-radius:2px}
  input,textarea{outline:none}
  button{cursor:pointer}
`;

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function StatBar({ label, value, color, icon }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "#666", letterSpacing: 1, fontFamily: "'Cinzel', serif" }}>{icon} {label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 700 }}>{value}<span style={{ color: "#2a2a3a", fontWeight: 400 }}>/100</span></span>
      </div>
      <div style={{ background: "#0e0e1a", borderRadius: 6, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${Math.min(value, 100)}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}66, ${color})`,
          borderRadius: 6, transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 6px ${color}44`,
        }} />
      </div>
    </div>
  );
}

function TaskCard({ task, completed, onComplete }) {
  const [showTip, setShowTip] = useState(false);
  const cc = CATEGORY_COLORS[task.category] || "#d4af37";
  return (
    <div style={{ marginBottom: 9, animation: "fadeInFast 0.3s ease" }}>
      <div
        onClick={() => !completed && onComplete(task)}
        style={{
          background: completed ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.025)",
          border: `1px solid ${completed ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.055)"}`,
          borderLeft: `3px solid ${completed ? "#d4af37" : cc}`,
          borderRadius: showTip ? "12px 12px 0 0" : 12,
          padding: "13px 14px", cursor: completed ? "default" : "pointer",
          display: "flex", alignItems: "center", gap: 12,
          transition: "background 0.2s, border-color 0.2s",
          opacity: completed ? 0.7 : 1,
        }}
      >
        <div style={{ fontSize: 22, flexShrink: 0 }}>{task.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Cinzel', serif", color: completed ? "#d4af37" : "#ececec", lineHeight: 1.3 }}>
            {task.name}
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{
              fontSize: 9, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5,
              background: `${cc}14`, color: cc, fontFamily: "'Cinzel', serif",
            }}>{task.category}</span>
            <span style={{ fontSize: 10, color: "#3a3a4a" }}>+{task.points} pts · +{task.xp} XP</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            border: `2px solid ${completed ? "#d4af37" : "#252535"}`,
            background: completed ? "#d4af37" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#0a0a1a", fontWeight: 700, transition: "all 0.3s",
          }}>{completed ? "✓" : ""}</div>
          {task.tip && (
            <div
              onClick={e => { e.stopPropagation(); setShowTip(s => !s); }}
              style={{ fontSize: 13, opacity: showTip ? 1 : 0.3, transition: "opacity 0.2s", lineHeight: 1 }}
            >💡</div>
          )}
        </div>
      </div>
      {showTip && (
        <div style={{
          background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.12)",
          borderTop: "none", borderRadius: "0 0 12px 12px", padding: "10px 14px 12px",
          fontSize: 12, color: "#aaa", fontFamily: "'Crimson Pro', serif", fontStyle: "italic",
          lineHeight: 1.65, animation: "fadeInFast 0.2s ease",
        }}>💡 {task.tip}</div>
      )}
    </div>
  );
}

// ── SIMULATED AUTH HELPERS ────────────────────────────────────────────────────
// When you're ready to go live, replace these three functions with real API calls
// to Firebase Auth, Supabase, or your own backend. The UI stays exactly the same.

const authSignUp = (email, password, name) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem("pq_users") || "{}");
    if (users[email]) return reject("An account with this email already exists.");
    users[email] = { email, password, name, createdAt: new Date().toISOString() };
    localStorage.setItem("pq_users", JSON.stringify(users));
    resolve({ email, name });
  }, 1200);
});

const authSignIn = (email, password) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem("pq_users") || "{}");
    const user = users[email];
    if (!user) return reject("No account found with this email.");
    if (user.password !== password) return reject("Incorrect password.");
    resolve({ email, name: user.name });
  }, 1000);
});

const authResetPassword = (email) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem("pq_users") || "{}");
    if (!users[email]) return reject("No account found with this email.");
    resolve();
  }, 900);
});

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const validate = () => {
    if (mode === "signup" && !form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !form.email.includes("@")) return "Please enter a valid email.";
    if (mode !== "forgot" && form.password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup" && form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "signup") {
        const user = await authSignUp(form.email.trim().toLowerCase(), form.password, form.name.trim());
        onAuth(user);
      } else if (mode === "signin") {
        const user = await authSignIn(form.email.trim().toLowerCase(), form.password);
        onAuth(user);
      } else {
        await authResetPassword(form.email.trim().toLowerCase());
        setSuccess("Reset link sent! Check your inbox. (Simulated — wire up email service on launch.)");
      }
    } catch (e) {
      setError(typeof e === "string" ? e : "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const inputStyle = (hasVal) => ({
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: `1px solid ${hasVal ? "rgba(212,175,55,0.35)" : "#181828"}`,
    borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 14,
    fontFamily: "'Crimson Pro', serif", transition: "border-color 0.2s",
  });

  const titles = { signin: "WELCOME BACK", signup: "JOIN THE CREW", forgot: "RESET PASSWORD" };
  const subs = {
    signin: "Sign in to continue your voyage.",
    signup: "Create your account and begin.",
    forgot: "We'll send a reset link to your email.",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 20%, #180e00 0%, #0a0a1a 55%, #080810 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 28, position: "relative", overflow: "hidden",
    }}>
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          background: "#fff", opacity: Math.random() * 0.2 + 0.03,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        }} />
      ))}

      {/* Logo */}
      <div style={{ fontSize: 48, marginBottom: 10, animation: "floatUp 3s ease-in-out infinite" }}>🏴‍☠️</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#7a5c0e", letterSpacing: 6, marginBottom: 32 }}>PIRATE'S QUEST</div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)",
        borderRadius: 20, padding: "28px 26px", animation: "fadeIn 0.4s ease",
      }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "#ffd700", letterSpacing: 3, marginBottom: 6, textAlign: "center" }}>
          {titles[mode]}
        </h2>
        <p style={{ fontSize: 13, color: "#666", textAlign: "center", fontFamily: "'Crimson Pro', serif", marginBottom: 24, lineHeight: 1.6 }}>
          {subs[mode]}
        </p>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 10, color: "#666", letterSpacing: 2, fontFamily: "'Cinzel', serif", display: "block", marginBottom: 7 }}>YOUR NAME</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Francis Hakeem Tajah Guevara" style={inputStyle(form.name)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 10, color: "#666", letterSpacing: 2, fontFamily: "'Cinzel', serif", display: "block", marginBottom: 7 }}>EMAIL</label>
            <input value={form.email} onChange={e => set("email", e.target.value)} placeholder="captain@yourship.com" type="email" style={inputStyle(form.email)} />
          </div>
          {mode !== "forgot" && (
            <div>
              <label style={{ fontSize: 10, color: "#666", letterSpacing: 2, fontFamily: "'Cinzel', serif", display: "block", marginBottom: 7 }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  value={form.password} onChange={e => set("password", e.target.value)}
                  placeholder="Min. 6 characters" type={showPass ? "text" : "password"}
                  style={{ ...inputStyle(form.password), paddingRight: 44 }}
                />
                <button onClick={() => setShowPass(s => !s)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#555", fontSize: 16,
                }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>
          )}
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 10, color: "#666", letterSpacing: 2, fontFamily: "'Cinzel', serif", display: "block", marginBottom: 7 }}>CONFIRM PASSWORD</label>
              <input value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Repeat password" type="password" style={inputStyle(form.confirm)} />
            </div>
          )}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{
            marginTop: 14, padding: "10px 14px", background: "rgba(180,40,40,0.1)",
            border: "1px solid rgba(180,40,40,0.25)", borderRadius: 10,
            fontSize: 12, color: "#e57373", fontFamily: "'Crimson Pro', serif",
            animation: "fadeInFast 0.2s ease",
          }}>⚠️ {error}</div>
        )}
        {success && (
          <div style={{
            marginTop: 14, padding: "10px 14px", background: "rgba(165,214,167,0.08)",
            border: "1px solid rgba(165,214,167,0.2)", borderRadius: 10,
            fontSize: 12, color: "#a5d6a7", fontFamily: "'Crimson Pro', serif",
            animation: "fadeInFast 0.2s ease",
          }}>✅ {success}</div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%", marginTop: 20,
            background: loading ? "#1a1a28" : "linear-gradient(135deg, #d4af37, #7a5200)",
            border: "none", borderRadius: 12, padding: "14px",
            color: loading ? "#444" : "#0a0a1a",
            fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700,
            letterSpacing: 2, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {loading
            ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>⚓</span> LOADING...</>
            : mode === "signin" ? "SIGN IN →"
            : mode === "signup" ? "CREATE ACCOUNT →"
            : "SEND RESET LINK →"
          }
        </button>

        {/* Mode switchers */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {mode === "signin" && (
            <>
              <button onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#555", fontSize: 12, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", cursor: "pointer" }}>
                Forgot your password?
              </button>
              <div style={{ fontSize: 12, color: "#444", fontFamily: "'Crimson Pro', serif" }}>
                No account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#d4af37", fontSize: 12, fontFamily: "'Crimson Pro', serif", cursor: "pointer", fontStyle: "italic" }}>
                  Join the crew →
                </button>
              </div>
            </>
          )}
          {mode === "signup" && (
            <div style={{ fontSize: 12, color: "#444", fontFamily: "'Crimson Pro', serif" }}>
              Already a member?{" "}
              <button onClick={() => { setMode("signin"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#d4af37", fontSize: 12, fontFamily: "'Crimson Pro', serif", cursor: "pointer", fontStyle: "italic" }}>
                Sign in →
              </button>
            </div>
          )}
          {mode === "forgot" && (
            <button onClick={() => { setMode("signin"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#555", fontSize: 12, fontFamily: "'Crimson Pro', serif", fontStyle: "italic", cursor: "pointer" }}>
              ← Back to sign in
            </button>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div style={{ marginTop: 28, fontSize: 9, color: "#1a1a28", fontFamily: "'Cinzel', serif", letterSpacing: 1, textAlign: "center" }}>
        © {new Date().getFullYear()} Francis Hakeem Tajah Guevara · All Rights Reserved
      </div>
    </div>
  );
}

function MysteryBox({ onOpen, alreadyOpened }) {
  const [opened, setOpened] = useState(alreadyOpened);
  const [reward, setReward] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opened || opening) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setOpening(true);
      setTimeout(() => {
        const roll = Math.random();
        let r;
        if (roll < 0.20) {
          const part = SHIP_PARTS[Math.floor(Math.random() * SHIP_PARTS.length)];
          r = { type: "ship", name: `Ship Part: ${part}`, icon: "⚓", desc: `Your ship gains a new ${part}!`, rarity: "Rare" };
        } else if (roll < 0.38) {
          const fruit = DEVIL_FRUITS[Math.floor(Math.random() * DEVIL_FRUITS.length)];
          r = { type: "fruit", name: fruit.name, icon: fruit.icon, desc: `${fruit.type} · ${fruit.power}`, rarity: fruit.rarity };
        } else if (roll < 0.58) {
          const pool = MYSTERY_REWARDS.financial;
          r = { type: "knowledge", ...pool[Math.floor(Math.random() * pool.length)] };
        } else if (roll < 0.78) {
          const pool = MYSTERY_REWARDS.productivity;
          r = { type: "knowledge", ...pool[Math.floor(Math.random() * pool.length)] };
        } else {
          const pool = MYSTERY_REWARDS.mindset;
          r = { type: "knowledge", ...pool[Math.floor(Math.random() * pool.length)] };
        }
        setReward(r);
        setOpened(true);
        setOpening(false);
        onOpen(r);
      }, 500);
    }, 500);
  };

  if (opening) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 44, animation: "spin 0.7s linear infinite" }}>✨</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", marginTop: 12, letterSpacing: 3 }}>OPENING...</div>
    </div>
  );

  if (opened && reward) {
    const rc = RARITY_COLORS[reward.rarity] || "#d4af37";
    return (
      <div style={{
        background: `${rc}0c`, border: `1px solid ${rc}33`,
        borderRadius: 16, padding: 22, textAlign: "center",
        animation: "popIn 0.4s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 0 28px ${rc}18`,
      }}>
        <div style={{ fontSize: 46, marginBottom: 10 }}>{reward.icon}</div>
        <div style={{ fontSize: 10, color: rc, fontFamily: "'Cinzel', serif", letterSpacing: 3, marginBottom: 7 }}>{reward.rarity}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Cinzel', serif", marginBottom: 7 }}>{reward.name}</div>
        <div style={{ fontSize: 13, color: "#999", fontFamily: "'Crimson Pro', serif", lineHeight: 1.65, fontStyle: "italic" }}>{reward.desc}</div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#2e2e3e" }}>Come back tomorrow for a new box!</div>
      </div>
    );
  }

  if (opened) return (
    <div style={{ textAlign: "center", padding: "20px 0", color: "#444", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontSize: 13 }}>
      Come back tomorrow for a new box!
    </div>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <div
        onClick={open}
        style={{
          width: 112, height: 112, margin: "0 auto 14px", borderRadius: 22,
          background: "linear-gradient(145deg, #d4af37 0%, #8b6914 55%, #4a3208 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, border: "1px solid #ffd70044",
          boxShadow: "0 0 28px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          animation: shaking ? "shake 0.5s" : "pulse 2.5s ease-in-out infinite",
        }}
      >🎁</div>
      <div style={{ fontSize: 12, color: "#444", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>Tap to reveal your reward</div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function PiratesQuest() {
  const [screen, setScreen] = useState("splash");
  const [onboardStep, setOnboardStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null); // { email, name }
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const [avatar, setAvatar] = useState({ name: "", crew: "", jollyRoger: "💀", skinTone: "s3", outfit: "o1", backbling: "b1", pickaxe: "p1", spray: "sp1" });
  const [stats, setStats] = useState({ attack: 10, defense: 10, intelligence: 10, luck: 10, endurance: 10, wisdom: 10, wealth: 10 });
  const [points, setPoints] = useState(0);
  const [xp, setXp] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [devilFruits, setDevilFruits] = useState([]);
  const [shipParts, setShipParts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState("quests");
  const [boxOpened, setBoxOpened] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [streak, setStreak] = useState(0);
  const [streakReward, setStreakReward] = useState(null);
  const [hakiAwakening, setHakiAwakening] = useState(null); // haki level being celebrated
  const prevPointsRef = React.useRef(0);

  const leaderboard = [
    { name: "Monkey D. Luffy", points: 4820, haki: "Conqueror's" },
    { name: "Roronoa Zoro", points: 3940, haki: "Advanced Armament" },
    { name: "Vinsmoke Sanji", points: 3210, haki: "Advanced Armament" },
    { name: "Nico Robin", points: 2870, haki: "Armament" },
    { name: "Nami", points: 2240, haki: "Armament" },
  ];

  const currentHaki = HAKI_LEVELS.slice().reverse().find(h => points >= h.threshold) || HAKI_LEVELS[0];
  const nextHaki = HAKI_LEVELS.find(h => h.threshold > points);
  const totalTasks = Object.values(TASKS).flat().length;
  const progress = Math.round((completedTasks.length / totalTasks) * 100);

  // ── LOAD ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem("piratesquest_v2");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.avatar) setAvatar(d.avatar);
        if (d.stats) setStats(d.stats);
        if (d.points != null) setPoints(d.points);
        if (d.xp != null) setXp(d.xp);
        if (d.devilFruits) setDevilFruits(d.devilFruits);
        if (d.shipParts) setShipParts(d.shipParts);
        if (d.inventory) setInventory(d.inventory);
        if (d.streak != null) setStreak(d.streak);
        const today = new Date().toDateString();
        if (d.lastDay === today) {
          if (d.completedTasks) setCompletedTasks(d.completedTasks);
          if (d.boxOpened != null) setBoxOpened(d.boxOpened);
        } else {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          if (d.lastDay !== yesterday) setStreak(0);
          setCompletedTasks([]);
          setBoxOpened(false);
        }
        if (d.savedAt) setLastSaved(d.savedAt);
        if (d.avatar?.name) setScreen("main");
        if (d.user) setUser(d.user);
      }
    } catch {
      setErrorBanner("Could not load your save. Starting fresh.");
    }
    setLoaded(true);
  }, []);

  // ── SAVE ──
  useEffect(() => {
    if (!loaded) return;
    try {
      const today = new Date().toDateString();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      localStorage.setItem("piratesquest_v2", JSON.stringify({
        avatar, stats, points, xp, completedTasks,
        devilFruits, shipParts, inventory, boxOpened,
        streak, lastDay: today, savedAt: ts, user,
      }));
      setLastSaved(ts);
    } catch {
      setErrorBanner("Auto-save failed. Device storage may be full.");
    }
  }, [avatar, stats, points, xp, completedTasks, devilFruits, shipParts, inventory, boxOpened, streak, user, loaded]);

  // ── HAKI AWAKENING DETECTION ──
  useEffect(() => {
    if (!loaded) return;
    const prev = prevPointsRef.current;
    // Find if we just crossed a haki threshold
    const crossed = HAKI_LEVELS.find(h =>
      h.threshold > 0 && prev < h.threshold && points >= h.threshold
    );
    if (crossed) {
      setTimeout(() => setHakiAwakening(crossed), 400);
    }
    prevPointsRef.current = points;
  }, [points, loaded]);
  const showNotif = (msg, icon = "⭐") => {
    setNotification({ msg, icon });
    setTimeout(() => setNotification(null), 3200);
  };

  const claimStreakRewards = (milestone) => {
    setPoints(p => {
      const bonus = milestone.days === 3 ? 150 : milestone.days === 7 ? 500 : milestone.days === 14 ? 800 : milestone.days === 30 ? 2000 : milestone.days === 60 ? 5000 : 10000;
      return p + bonus;
    });
    if (milestone.days >= 7) {
      setStats(s => ({
        ...s,
        wisdom: Math.min(100, s.wisdom + (milestone.days >= 100 ? 50 : milestone.days >= 30 ? 20 : milestone.days >= 14 ? 15 : 10)),
        wealth: Math.min(100, s.wealth + (milestone.days >= 100 ? 50 : milestone.days >= 30 ? 20 : 10)),
      }));
    }
    setStreakReward(null);
  };

  const completeTask = (task) => {
    if (completedTasks.includes(task.id)) return;
    const next = [...completedTasks, task.id];
    setCompletedTasks(next);
    setPoints(p => p + task.points);
    setXp(x => x + task.xp);
    setStats(s => ({ ...s, [task.stat]: Math.min(100, s[task.stat] + 3) }));
    if (next.length === totalTasks) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      // Check if this streak hits a milestone
      const milestone = STREAK_MILESTONES.find(m => m.days === newStreak);
      if (milestone) {
        setTimeout(() => setStreakReward(milestone), 800);
      } else {
        showNotif(`ALL QUESTS COMPLETE! 🔥 ${newStreak} day streak!`, "🏆");
      }
    } else {
      showNotif(`+${task.points} pts · +${task.xp} XP · ${task.stat.toUpperCase()}↑`, "⚔️");
    }
  };

  const handleBoxOpen = (reward) => {
    if (reward.type === "fruit") setDevilFruits(p => [...p, reward]);
    else if (reward.type === "ship") setShipParts(p => [...p, reward.name.replace("Ship Part: ", "")]);
    else if (reward.type === "knowledge") {
      setInventory(p => [...p, reward]);
      const isFinance = MYSTERY_REWARDS.financial.some(r => r.name === reward.name);
      setStats(s => ({
        ...s,
        wisdom: Math.min(100, s.wisdom + 4),
        wealth: isFinance ? Math.min(100, s.wealth + 4) : s.wealth,
      }));
    }
    setBoxOpened(true);
    showNotif(`${reward.icon} ${reward.name} unlocked!`, reward.icon);
  };

  // ── LOADING ──
  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <style>{CSS}</style>
      <div style={{ fontSize: 52, animation: "floatUp 1.4s ease-in-out infinite" }}>🏴‍☠️</div>
      <div style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: 12, letterSpacing: 4 }}>LOADING...</div>
    </div>
  );

  // ── SPLASH ──
  if (screen === "splash") return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 25%, #180e00 0%, #0a0a1a 55%, #080810 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 28, position: "relative", overflow: "hidden",
    }}>
      <style>{CSS}</style>
      {[...Array(44)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          background: "#fff", opacity: Math.random() * 0.3 + 0.04,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        }} />
      ))}
      <div style={{ fontSize: 90, animation: "floatUp 3s ease-in-out infinite", marginBottom: 18 }}>🏴‍☠️</div>
      <h1 style={{
        fontFamily: "'Cinzel', serif", fontSize: 33, color: "#ffd700",
        textAlign: "center", letterSpacing: 4, margin: "0 0 5px",
        animation: "glowPulse 3s ease-in-out infinite",
      }}>PIRATE'S QUEST</h1>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#7a5c0e", letterSpacing: 7, margin: "0 0 34px" }}>ONE PIECE</p>

      <div style={{
        border: "1px solid rgba(212,175,55,0.25)", borderRadius: 18,
        padding: "22px 26px", maxWidth: 340, width: "100%",
        background: "rgba(212,175,55,0.03)", textAlign: "center",
        animation: "borderPulse 3s ease-in-out infinite", marginBottom: 30,
      }}>
        <div style={{ fontSize: 10, color: "#d4af37", letterSpacing: 3, fontFamily: "'Cinzel', serif", marginBottom: 10 }}>INTELLECTUAL PROPERTY</div>
        <div style={{ fontSize: 12, color: "#888", fontFamily: "'Crimson Pro', serif", lineHeight: 1.8, marginBottom: 10 }}>
          This application and all its original content, features, concepts, and design are the exclusive property of
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, color: "#ffd700", letterSpacing: 1, lineHeight: 1.7 }}>
          Francis Hakeem<br />Tajah Guevara
        </div>
        <div style={{ width: 48, height: 1, background: "linear-gradient(90deg,transparent,#d4af37,transparent)", margin: "12px auto" }} />
        <div style={{ fontSize: 11, color: "#555", fontFamily: "'Crimson Pro', serif", lineHeight: 1.75 }}>
          © {new Date().getFullYear()} Francis Hakeem Tajah Guevara.<br />
          All rights reserved. Unauthorized reproduction<br />or distribution is strictly prohibited.
        </div>
      </div>

      <button
        onClick={() => setScreen("auth")}
        style={{
          background: "linear-gradient(135deg, #d4af37, #7a5200)", border: "none",
          borderRadius: 50, padding: "14px 54px", color: "#0a0a1a",
          fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
          letterSpacing: 3, boxShadow: "0 4px 22px rgba(212,175,55,0.3)",
          transition: "transform 0.15s",
        }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
      >ENTER →</button>
    </div>
  );

  // ── AUTH ──
  if (screen === "auth") return (
    <div style={{ fontFamily: "'Crimson Pro', serif" }}>
      <style>{CSS}</style>
      <AuthScreen onAuth={(u) => {
        setUser(u);
        setScreen("onboarding");
      }} />
    </div>
  );

  // ── ONBOARDING ──
  if (screen === "onboarding") {
    const steps = [
      { title: "Welcome, Future Pirate King", sub: "Pirate's Quest turns your daily grind into an epic voyage. Build real strength. Grow real wealth. Unlock real power.", icon: "🏴‍☠️" },
      { title: "Complete Daily Quests", sub: "15 quests every day — morning, afternoon, and evening. Each one builds your body, mind, or wealth. Simple. Consistent. Powerful.", icon: "⚔️" },
      { title: "Grow Your Stats", sub: "Every quest raises a stat. Push-ups build Attack. Finance tasks build Wealth. Journaling builds Wisdom. You become what you do daily.", icon: "📊" },
      { title: "Rewards & Haki", sub: "Reach bounty milestones to awaken Haki. Open daily Mystery Boxes for Devil Fruits, book recs, finance tips, and rare ship parts.", icon: "🌀" },
    ];

    if (onboardStep < steps.length) {
      const s = steps[onboardStep];
      return (
        <div style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse at 50% 25%, #180e00 0%, #0a0a1a 55%, #080810 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 28, position: "relative", overflow: "hidden",
        }}>
          <style>{CSS}</style>
          {[...Array(22)].map((_, i) => (
            <div key={i} style={{
              position: "absolute", borderRadius: "50%",
              width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
              background: "#fff", opacity: Math.random() * 0.25 + 0.04,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }} />
          ))}
          <div style={{ fontSize: 78, animation: "floatUp 3s ease-in-out infinite", marginBottom: 26 }}>{s.icon}</div>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: 24, color: "#ffd700", textAlign: "center",
            margin: "0 0 18px", letterSpacing: 2, lineHeight: 1.4,
            animation: "fadeIn 0.45s ease",
          }}>{s.title}</h1>
          <p style={{
            fontFamily: "'Crimson Pro', serif", fontSize: 16, color: "#bbb",
            textAlign: "center", maxWidth: 320, lineHeight: 1.85, margin: "0 0 44px",
            animation: "fadeIn 0.45s ease 0.1s both",
          }}>{s.sub}</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 34 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                height: 7, borderRadius: 4, transition: "all 0.35s ease",
                width: i === onboardStep ? 28 : 8,
                background: i === onboardStep ? "#d4af37" : i < onboardStep ? "#7a5200" : "#1a1a28",
              }} />
            ))}
          </div>
          <button
            onClick={() => setOnboardStep(s => s + 1)}
            style={{
              background: "linear-gradient(135deg, #d4af37, #7a5200)", border: "none",
              borderRadius: 50, padding: "14px 50px", color: "#0a0a1a",
              fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 2, boxShadow: "0 4px 18px rgba(212,175,55,0.3)",
            }}
          >{onboardStep === steps.length - 1 ? "CREATE YOUR PIRATE →" : "NEXT →"}</button>
        </div>
      );
    }

    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 25%, #180e00 0%, #0a0a1a 55%, #080810 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 28,
      }}>
        <style>{CSS}</style>
        <div style={{ fontSize: 52, marginBottom: 14, animation: "floatUp 3s ease-in-out infinite" }}>🧍</div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 21, color: "#ffd700", marginBottom: 7, letterSpacing: 2 }}>CREATE YOUR PIRATE</h1>
        <p style={{ color: "#555", fontFamily: "'Crimson Pro', serif", marginBottom: 28, fontSize: 14 }}>Who will you become on this grand voyage?</p>
        <div style={{ width: "100%", maxWidth: 360 }}>
          {[
            { label: "PIRATE NAME", key: "name", placeholder: "e.g. Francis Hakeem Tajah Guevara" },
            { label: "CREW NAME", key: "crew", placeholder: "e.g. The Guevara Pirates" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#666", fontSize: 10, letterSpacing: 2, marginBottom: 7, fontFamily: "'Cinzel', serif" }}>{f.label}</label>
              <input
                value={avatar[f.key]}
                onChange={e => setAvatar(a => ({ ...a, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${avatar[f.key] ? "rgba(212,175,55,0.4)" : "#181828"}`,
                  borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 14,
                  fontFamily: "'Crimson Pro', serif", transition: "border-color 0.2s",
                }}
              />
            </div>
          ))}
          <label style={{ display: "block", color: "#666", fontSize: 10, letterSpacing: 2, marginBottom: 10, fontFamily: "'Cinzel', serif" }}>JOLLY ROGER</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {JOLLY_ROGERS.map(r => (
              <button key={r} onClick={() => setAvatar(a => ({ ...a, jollyRoger: r }))} style={{
                width: 50, height: 50, borderRadius: 12, fontSize: 24,
                border: `2px solid ${avatar.jollyRoger === r ? "#d4af37" : "#181828"}`,
                background: avatar.jollyRoger === r ? "rgba(212,175,55,0.14)" : "rgba(255,255,255,0.025)",
                transform: avatar.jollyRoger === r ? "scale(1.1)" : "scale(1)", transition: "all 0.2s",
              }}>{r}</button>
            ))}
          </div>
          <button
            onClick={() => { if (avatar.name.trim()) setScreen("main"); }}
            style={{
              width: "100%",
              background: avatar.name.trim() ? "linear-gradient(135deg, #d4af37, #7a5200)" : "#0f0f1a",
              border: `1px solid ${avatar.name.trim() ? "transparent" : "#181828"}`,
              borderRadius: 50, padding: 14, color: avatar.name.trim() ? "#0a0a1a" : "#282838",
              fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 2, transition: "all 0.3s",
            }}
          >SET SAIL →</button>
          {!avatar.name.trim() && (
            <p style={{ textAlign: "center", fontSize: 11, color: "#333", marginTop: 10, fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>
              Enter your pirate name to continue
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  const tabs = [
    { id: "quests", label: "Quests", icon: "⚔️" },
    { id: "avatar", label: "Avatar", icon: "🧍" },
    { id: "ship", label: "Ship", icon: "⚓" },
    { id: "rewards", label: "Rewards", icon: "🎁" },
    { id: "crew", label: "Crew", icon: "👥" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{CSS}</style>

      {/* TOAST */}
      {notification && (
        <div style={{
          position: "fixed", top: 14, left: "50%",
          background: "linear-gradient(135deg, #130f00, #1e1800)",
          border: "1px solid rgba(212,175,55,0.45)",
          borderRadius: 50, padding: "10px 20px", zIndex: 9999,
          animation: "slideDown 0.3s ease",
          display: "flex", alignItems: "center", gap: 9,
          boxShadow: "0 4px 22px rgba(0,0,0,0.7)",
          whiteSpace: "nowrap", maxWidth: "88vw",
        }}>
          <span style={{ fontSize: 15 }}>{notification.icon}</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#d4af37", letterSpacing: 1 }}>{notification.msg}</span>
        </div>
      )}

      {/* ERROR BANNER */}
      {errorBanner && (
        <div style={{
          position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480, background: "#2a0808",
          borderBottom: "1px solid #6b0000", padding: "11px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 9998, fontSize: 12, color: "#ff8a80", fontFamily: "'Crimson Pro', serif",
        }}>
          <span>⚠️ {errorBanner}</span>
          <button onClick={() => setErrorBanner(null)} style={{ background: "none", border: "none", color: "#ff8a80", fontSize: 18, paddingLeft: 10 }}>✕</button>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {supportOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9997, padding: 22, animation: "fadeIn 0.2s ease",
        }}>
          <div style={{
            background: "#0d0d1e", border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 20, padding: 26, width: "100%", maxWidth: 360,
            animation: "popIn 0.28s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: 14, letterSpacing: 2 }}>CREW SUPPORT</h3>
              <button onClick={() => { setSupportOpen(false); setSupportSent(false); }} style={{ background: "none", border: "none", color: "#444", fontSize: 20 }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 18, fontFamily: "'Crimson Pro', serif" }}>
              Experiencing a bug, have feedback, or need help? Send a message and the crew will review it.
            </p>
            {supportSent ? (
              <div style={{
                textAlign: "center", padding: "22px 0",
                animation: "popIn 0.3s ease",
              }}>
                <div style={{ fontSize: 42, marginBottom: 10 }}>✅</div>
                <div style={{ fontFamily: "'Cinzel', serif", color: "#a5d6a7", fontSize: 13, letterSpacing: 1 }}>Message received, Captain!</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontFamily: "'Crimson Pro', serif" }}>We'll look into it shortly.</div>
              </div>
            ) : (
              <>
                <label style={{ display: "block", fontSize: 10, color: "#555", letterSpacing: 2, fontFamily: "'Cinzel', serif", marginBottom: 7 }}>YOUR MESSAGE</label>
                <textarea
                  value={supportMsg}
                  onChange={e => setSupportMsg(e.target.value)}
                  placeholder="Describe your issue or share feedback..."
                  rows={4}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)",
                    border: "1px solid #181828", borderRadius: 12,
                    padding: "12px 14px", color: "#fff", fontSize: 13,
                    fontFamily: "'Crimson Pro', serif", resize: "none", marginBottom: 14,
                  }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setSupportOpen(false)}
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid #181828",
                      borderRadius: 12, padding: 12, color: "#555",
                      fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1,
                    }}
                  >CANCEL</button>
                  <button
                    onClick={() => {
                      if (!supportMsg.trim()) return;
                      setSupportSent(true);
                      setSupportMsg("");
                      setTimeout(() => { setSupportSent(false); setSupportOpen(false); }, 3000);
                    }}
                    style={{
                      flex: 2,
                      background: supportMsg.trim() ? "linear-gradient(135deg, #d4af37, #7a5200)" : "#0f0f1a",
                      border: "none", borderRadius: 12, padding: 12,
                      color: supportMsg.trim() ? "#0a0a1a" : "#252535",
                      fontFamily: "'Cinzel', serif", fontSize: 10, fontWeight: 700,
                      letterSpacing: 1, transition: "all 0.2s",
                    }}
                  >SEND MESSAGE</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* STREAK MILESTONE MODAL */}
      {streakReward && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9996, padding: 22, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            background: `linear-gradient(160deg, ${streakReward.gradient[0]}, ${streakReward.gradient[1]})`,
            border: `2px solid ${streakReward.glow}55`,
            borderRadius: 24, padding: "32px 26px", width: "100%", maxWidth: 360,
            textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 60px ${streakReward.glow}33`,
            position: "relative", overflow: "hidden",
          }}>
            {/* Top rarity stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${streakReward.glow}, transparent)` }} />

            {/* Sparkle bg */}
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", fontSize: 16, opacity: 0.15,
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                animation: `floatUp ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}>✨</div>
            ))}

            <div style={{ fontSize: 72, marginBottom: 6, animation: "floatUp 2s ease-in-out infinite" }}>{streakReward.icon}</div>
            <div style={{ fontSize: 10, color: streakReward.glow, fontFamily: "'Cinzel', serif", letterSpacing: 4, marginBottom: 8, opacity: 0.8 }}>
              {streakReward.rarity.toUpperCase()} MILESTONE
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#fff", marginBottom: 6, letterSpacing: 1 }}>
              {streakReward.title}
            </div>
            <div style={{ fontSize: 10, color: streakReward.glow, fontFamily: "'Cinzel', serif", letterSpacing: 2, marginBottom: 14 }}>
              🔥 {streakReward.days} DAY STREAK
            </div>
            <div style={{ fontSize: 13, color: "#bbb", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", lineHeight: 1.7, marginBottom: 22 }}>
              "{streakReward.desc}"
            </div>

            {/* Rewards list */}
            <div style={{
              background: "rgba(0,0,0,0.3)", border: `1px solid ${streakReward.glow}22`,
              borderRadius: 14, padding: "14px 16px", marginBottom: 22, textAlign: "left",
            }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: streakReward.glow, letterSpacing: 2, marginBottom: 12 }}>REWARDS UNLOCKED</div>
              {streakReward.rewards.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < streakReward.rewards.length - 1 ? 8 : 0 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                  <span style={{ fontSize: 12, color: "#ccc", fontFamily: "'Crimson Pro', serif" }}>{r.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => claimStreakRewards(streakReward)}
              style={{
                width: "100%", background: `linear-gradient(135deg, ${streakReward.glow}, ${streakReward.gradient[0]})`,
                border: "none", borderRadius: 50, padding: "14px",
                color: "#000", fontFamily: "'Cinzel', serif", fontSize: 14,
                fontWeight: 700, letterSpacing: 2, cursor: "pointer",
                boxShadow: `0 4px 20px ${streakReward.glow}44`,
              }}
            >CLAIM REWARDS →</button>
          </div>
        </div>
      )}

      {/* HAKI AWAKENING MODAL */}
      {hakiAwakening && (() => {
        const HAKI_DATA = {
          "Observation Haki": {
            bg: "#000d1a", color: "#4fc3f7", glow: "#4fc3f7",
            particles: ["👁️","✨","💫","🌀"],
            verse: "Your eyes pierce beyond what is visible. You feel the world before it moves.",
            power: "You can now sense the presence, emotions, and intent of all living things.",
            animIcon: "👁️",
          },
          "Armament Haki": {
            bg: "#0a0a0a", color: "#90a4ae", glow: "#b0bec5",
            particles: ["🌑","⚫","💎","🛡️"],
            verse: "Your body becomes an unbreakable weapon. Iron will made manifest.",
            power: "Your body is now clad in invisible armor. You can harm those who cannot be touched.",
            animIcon: "🛡️",
          },
          "Advanced Armament": {
            bg: "#080810", color: "#cfd8dc", glow: "#eceff1",
            particles: ["⚡","💥","🌑","✨"],
            verse: "You no longer just wear the armor. You become the force that flows through it.",
            power: "You can emit Haki from your body and destroy from within.",
            animIcon: "⚡",
          },
          "Conqueror's Haki": {
            bg: "#1a1000", color: "#ffd700", glow: "#ffec6e",
            particles: ["👑","⚡","🔥","💫","🌟"],
            verse: "The will of a King cannot be contained. The world bends.",
            power: "You now possess the power to dominate the will of the weak. Only one in a million is born with this.",
            animIcon: "👑",
          },
        };
        const hd = HAKI_DATA[hakiAwakening.name] || HAKI_DATA["Observation Haki"];
        const isConqueror = hakiAwakening.name === "Conqueror's Haki";
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: hd.bg, overflow: "hidden",
            animation: "hakiFlash 3s ease-in-out",
          }}>
            {/* Shockwave rings */}
            {[1,2,3].map(i => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 200, height: 200, borderRadius: "50%",
                border: `2px solid ${hd.glow}`,
                animation: `hakiShockwave ${1 + i * 0.4}s ease-out ${i * 0.3}s forwards`,
                opacity: 0,
              }} />
            ))}
            {/* Particles */}
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", fontSize: 20 + Math.random() * 20,
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                opacity: 0.15 + Math.random() * 0.3,
                animation: `floatUp ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                filter: `drop-shadow(0 0 8px ${hd.glow})`,
              }}>
                {hd.particles[Math.floor(Math.random() * hd.particles.length)]}
              </div>
            ))}
            {/* Conqueror lightning */}
            {isConqueror && [...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", fontSize: 32,
                left: `${10 + i * 11}%`, top: `${20 + Math.random() * 40}%`,
                animation: `hakiFlash ${0.3 + Math.random() * 0.4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`,
                filter: "drop-shadow(0 0 12px #ffd700)",
              }}>⚡</div>
            ))}
            {/* Radial glow */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${hd.glow}22 0%, transparent 70%)`,
              animation: "hakiOrb 2s ease-in-out infinite",
            }} />
            {/* Content */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: 28, textAlign: "center",
            }}>
              <div style={{
                fontSize: 88, marginBottom: 16,
                filter: `drop-shadow(0 0 30px ${hd.glow})`,
                animation: "hakiOrb 1.5s ease-in-out infinite",
              }}>{hd.animIcon}</div>
              <div style={{
                fontSize: 10, color: hd.color, fontFamily: "'Cinzel', serif",
                letterSpacing: 6, marginBottom: 10, opacity: 0.7,
                animation: "hakiText 0.8s ease 0.2s both",
              }}>HAKI AWAKENING</div>
              <h1 style={{
                fontFamily: "'Cinzel', serif", fontSize: isConqueror ? 26 : 22,
                color: hd.glow, letterSpacing: 2, margin: "0 0 8px",
                animation: "hakiText 0.8s ease 0.4s both",
                textShadow: `0 0 40px ${hd.glow}, 0 0 80px ${hd.glow}55`,
              }}>{hakiAwakening.name.toUpperCase()}</h1>
              <div style={{
                fontFamily: "'Crimson Pro', serif", fontSize: 14, color: hd.color,
                fontStyle: "italic", lineHeight: 1.8, maxWidth: 300, margin: "0 0 20px",
                animation: "hakiText 0.8s ease 0.6s both", opacity: 0.85,
              }}>"{hd.verse}"</div>
              <div style={{
                width: 80, height: 1,
                background: `linear-gradient(90deg, transparent, ${hd.glow}, transparent)`,
                margin: "0 0 20px", animation: "hakiText 0.8s ease 0.7s both",
              }} />
              <div style={{
                background: `${hd.glow}0f`, border: `1px solid ${hd.glow}33`,
                borderRadius: 14, padding: "14px 18px", maxWidth: 300, marginBottom: 28,
                animation: "hakiText 0.8s ease 0.8s both",
              }}>
                <div style={{ fontSize: 10, color: hd.glow, fontFamily: "'Cinzel', serif", letterSpacing: 2, marginBottom: 8 }}>NEW ABILITY UNLOCKED</div>
                <div style={{ fontSize: 12, color: "#ccc", fontFamily: "'Crimson Pro', serif", lineHeight: 1.7 }}>{hd.power}</div>
              </div>
              <button
                onClick={() => setHakiAwakening(null)}
                style={{
                  background: `linear-gradient(135deg, ${hd.glow}, ${hd.color}88)`,
                  border: "none", borderRadius: 50, padding: "14px 52px",
                  color: "#000", fontFamily: "'Cinzel', serif", fontSize: 14,
                  fontWeight: 700, letterSpacing: 3, cursor: "pointer",
                  boxShadow: `0 0 30px ${hd.glow}66`,
                  animation: "hakiText 0.8s ease 1s both",
                }}
              >I FEEL IT →</button>
            </div>
          </div>
        );
      })()}

      <div style={{
        background: "linear-gradient(180deg, #0c0c20 0%, #080810 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)", padding: "14px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, color: "#ffd700", letterSpacing: 1 }}>
            {avatar.jollyRoger} {avatar.name} {LOCKER.outfits.find(o => o.id === avatar.outfit)?.icon || ""}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
            <div style={{ fontSize: 10, color: currentHaki.color, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{currentHaki.name}</div>
            {streak > 0 && (
              <div style={{
                fontSize: 9, color: "#ff6b35", fontFamily: "'Cinzel', serif",
                background: "rgba(255,107,53,0.09)", border: "1px solid rgba(255,107,53,0.22)",
                padding: "1px 8px", borderRadius: 20,
              }}>🔥 {streak}d streak</div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#d4af37" }}>{points.toLocaleString()}</div>
          <div style={{ fontSize: 9, color: "#1e1e28", marginTop: 1 }}>{lastSaved ? `💾 ${lastSaved}` : ""}</div>
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{ padding: "10px 18px 12px", background: "#0c0c1c", borderBottom: "1px solid #0e0e1c" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#2e2e3e", marginBottom: 5 }}>
          <span style={{ fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>DAILY PROGRESS {progress}%</span>
          <span>{completedTasks.length}/{totalTasks}</span>
        </div>
        <div style={{ background: "#0e0e1a", borderRadius: 6, height: 6 }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: progress === 100
              ? "linear-gradient(90deg, #ffd700, #ff6b35)"
              : "linear-gradient(90deg, #d4af3788, #d4af37)",
            borderRadius: 6, transition: "width 0.8s ease",
            boxShadow: progress === 100 ? "0 0 8px rgba(212,175,55,0.45)" : "none",
          }} />
        </div>
        {nextHaki && (
          <div style={{ fontSize: 9, color: "#1e1e2e", marginTop: 5, fontFamily: "'Cinzel', serif" }}>
            {(nextHaki.threshold - points).toLocaleString()} pts to <span style={{ color: nextHaki.color }}>{nextHaki.name}</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "18px 18px 104px" }}>

        {/* ── QUESTS ── */}
        {activeTab === "quests" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>

            {/* Streak Progress Card */}
            {(() => {
              const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak);
              const prevMilestone = [...STREAK_MILESTONES].reverse().find(m => m.days <= streak);
              const base = prevMilestone ? prevMilestone.days : 0;
              const target = nextMilestone ? nextMilestone.days : 100;
              const pct = Math.round(((streak - base) / (target - base)) * 100);
              return (
                <div style={{
                  background: streak === 0 ? "rgba(255,255,255,0.02)" : `linear-gradient(135deg, ${nextMilestone ? nextMilestone.gradient[0] : "#5e4a00"}44, rgba(8,8,16,0))`,
                  border: `1px solid ${streak === 0 ? "#0e0e1c" : nextMilestone ? nextMilestone.glow + "33" : "#ffd70033"}`,
                  borderRadius: 16, padding: "16px 18px", marginBottom: 20,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>🔥</span>
                      <div>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: streak > 0 ? "#ffd700" : "#444", letterSpacing: 1 }}>
                          {streak > 0 ? `${streak} DAY STREAK` : "NO ACTIVE STREAK"}
                        </div>
                        <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>
                          {streak === 0 ? "Complete all 15 quests today to start" : nextMilestone ? `${nextMilestone.days - streak} days to ${nextMilestone.title}` : "Pirate King achieved!"}
                        </div>
                      </div>
                    </div>
                    {nextMilestone && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 24 }}>{nextMilestone.icon}</div>
                        <div style={{ fontSize: 8, color: nextMilestone.glow, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{nextMilestone.rarity.toUpperCase()}</div>
                      </div>
                    )}
                  </div>
                  {nextMilestone && (
                    <>
                      <div style={{ background: "#0e0e1a", borderRadius: 6, height: 6, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`, height: "100%",
                          background: `linear-gradient(90deg, ${nextMilestone.glow}88, ${nextMilestone.glow})`,
                          borderRadius: 6, transition: "width 0.8s ease",
                          boxShadow: `0 0 6px ${nextMilestone.glow}66`,
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#333", marginTop: 5, fontFamily: "'Cinzel', serif" }}>
                        <span>{streak}d</span><span>{nextMilestone.days}d — {nextMilestone.title}</span>
                      </div>
                    </>
                  )}
                  {/* All milestones row */}
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {STREAK_MILESTONES.map(m => (
                      <div key={m.days} style={{
                        fontSize: 9, padding: "2px 8px", borderRadius: 10,
                        background: streak >= m.days ? `${m.glow}18` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${streak >= m.days ? m.glow + "44" : "#0e0e1c"}`,
                        color: streak >= m.days ? m.glow : "#2a2a3a",
                        fontFamily: "'Cinzel', serif",
                      }}>
                        {streak >= m.days ? "✓ " : ""}{m.days}d
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {progress === 100 && (
              <div style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(255,107,53,0.06))",
                border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16,
                padding: "18px 20px", marginBottom: 22, textAlign: "center",
                animation: "borderPulse 2s ease-in-out infinite",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
                <div style={{ fontFamily: "'Cinzel', serif", color: "#ffd700", fontSize: 13, letterSpacing: 2 }}>ALL QUESTS COMPLETE</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 5, fontFamily: "'Crimson Pro', serif" }}>Outstanding, Captain. Return tomorrow for a new set.</div>
              </div>
            )}
            {[
              { key: "morning", label: "Morning", icon: "🌅" },
              { key: "afternoon", label: "Afternoon", icon: "☀️" },
              { key: "evening", label: "Evening", icon: "🌙" },
            ].map(({ key, label, icon }) => {
              const done = TASKS[key].filter(t => completedTasks.includes(t.id)).length;
              const allDone = done === TASKS[key].length;
              return (
                <div key={key} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 18 }}>{icon}</span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: allDone ? "#ffd700" : "#d4af37", letterSpacing: 2 }}>{label.toUpperCase()} QUESTS</span>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: allDone ? "#ffd700" : "#2e2e3e" }}>
                      {allDone ? "✓ " : ""}{done}/{TASKS[key].length}
                    </span>
                  </div>
                  {TASKS[key].map(task => (
                    <TaskCard key={task.id} task={task} completed={completedTasks.includes(task.id)} onComplete={completeTask} />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── AVATAR / LOCKER ── */}
        {activeTab === "avatar" && (() => {
          const skin = SKIN_TONES.find(s => s.id === avatar.skinTone) || SKIN_TONES[2];
          const equippedOutfit = LOCKER.outfits.find(o => o.id === avatar.outfit) || LOCKER.outfits[0];
          const equippedBack = LOCKER.backblings.find(b => b.id === avatar.backbling) || LOCKER.backblings[0];
          const equippedPickaxe = LOCKER.pickaxes.find(p => p.id === avatar.pickaxe) || LOCKER.pickaxes[0];
          const equippedSpray = LOCKER.sprays.find(s => s.id === avatar.spray) || LOCKER.sprays[0];

          const RARITY_BG = {
            Common:    ["#3a3a3a","#222"],
            Uncommon:  ["#1a4a1a","#0d2e0d"],
            Rare:      ["#0d2a5e","#061535"],
            Epic:      ["#3a0a5e","#1e0535"],
            Legendary: ["#5e2e00","#2e1500"],
            Mythic:    ["#5e4a00","#2e2400"],
          };
          const RARITY_GLOW = {
            Common: "#888", Uncommon: "#66bb6a", Rare: "#4fc3f7",
            Epic: "#ce93d8", Legendary: "#ffd700", Mythic: "#ffec6e",
          };

          const isItemUnlocked = (item) =>
            item.unlocked ||
            (item.unlockAt && points >= item.unlockAt) ||
            (item.requiresFruit && devilFruits.length > 0);

          const LockerItem = ({ item, equipped, onEquip }) => {
            const unlocked = isItemUnlocked(item);
            const active = equipped === item.id;
            const glow = RARITY_GLOW[item.rarity] || "#d4af37";
            const bg = RARITY_BG[item.rarity] || RARITY_BG.Common;
            return (
              <div
                onClick={() => unlocked && onEquip(item.id)}
                style={{
                  borderRadius: 12, overflow: "hidden", cursor: unlocked ? "pointer" : "default",
                  border: `2px solid ${active ? glow : unlocked ? bg[0] + "99" : "#0e0e14"}`,
                  background: `linear-gradient(160deg, ${bg[0]}, ${bg[1]})`,
                  opacity: unlocked ? 1 : 0.45,
                  transform: active ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.2s",
                  boxShadow: active ? `0 0 16px ${glow}55` : "none",
                  position: "relative",
                }}
              >
                {/* Rarity stripe at top */}
                <div style={{ height: 3, background: glow, opacity: 0.8 }} />
                <div style={{ padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 6, filter: unlocked ? "none" : "grayscale(1)" }}>
                    {unlocked ? item.icon : "🔒"}
                  </div>
                  <div style={{ fontSize: 10, color: active ? glow : unlocked ? "#ccc" : "#444", fontFamily: "'Cinzel', serif", lineHeight: 1.3, fontWeight: active ? 700 : 400 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 8, color: glow, fontFamily: "'Cinzel', serif", letterSpacing: 1, marginTop: 3, opacity: 0.7 }}>
                    {item.rarity.toUpperCase()}
                  </div>
                  {!unlocked && (
                    <div style={{ fontSize: 8, color: "#555", marginTop: 4 }}>
                      {item.unlockAt ? `${item.unlockAt} pts` : item.requiresFruit ? "Get a fruit" : ""}
                    </div>
                  )}
                  {active && (
                    <div style={{
                      marginTop: 6, fontSize: 8, color: glow, fontFamily: "'Cinzel', serif",
                      letterSpacing: 1, background: `${glow}18`, padding: "2px 6px", borderRadius: 6,
                    }}>EQUIPPED</div>
                  )}
                </div>
              </div>
            );
          };

          return (
            <div style={{ animation: "fadeIn 0.3s ease" }}>

              {/* ── CHARACTER PREVIEW CARD ── */}
              <div style={{
                background: `linear-gradient(160deg, ${RARITY_BG[equippedOutfit.rarity]?.[0] || "#1a1a2e"}, #080810)`,
                border: `1px solid ${RARITY_GLOW[equippedOutfit.rarity] || "#d4af37"}33`,
                borderRadius: 20, padding: "24px 20px 20px", marginBottom: 16,
                boxShadow: `0 0 40px ${RARITY_GLOW[equippedOutfit.rarity] || "#d4af37"}18`,
                position: "relative", overflow: "hidden",
              }}>
                {/* Rarity stripe */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${RARITY_GLOW[equippedOutfit.rarity]}, transparent)` }} />

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {/* Avatar figure */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: 18,
                      background: `radial-gradient(circle at 35% 30%, ${skin.color}ee, ${skin.color}88)`,
                      border: `2px solid ${skin.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 44, animation: "floatUp 3s ease-in-out infinite",
                      boxShadow: `0 0 20px ${skin.color}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    }}>
                      {equippedOutfit.icon}
                    </div>
                    {/* Back bling */}
                    <div style={{ position: "absolute", top: -6, right: -10, fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}>{equippedBack.icon}</div>
                    {/* Pickaxe */}
                    <div style={{ position: "absolute", bottom: -4, right: -14, fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}>{equippedPickaxe.icon}</div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: RARITY_GLOW[equippedOutfit.rarity], fontFamily: "'Cinzel', serif", letterSpacing: 2, marginBottom: 4 }}>
                      {equippedOutfit.rarity.toUpperCase()} OUTFIT
                    </div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, color: "#fff", marginBottom: 4 }}>{avatar.name}</div>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>{avatar.crew || "Solo Pirate"}</div>
                    {/* Equipped tags */}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {[equippedOutfit, equippedBack, equippedPickaxe, equippedSpray].map((item, i) => (
                        <div key={i} style={{
                          fontSize: 9, padding: "2px 7px", borderRadius: 6,
                          background: `${RARITY_GLOW[item.rarity]}15`,
                          border: `1px solid ${RARITY_GLOW[item.rarity]}33`,
                          color: RARITY_GLOW[item.rarity], fontFamily: "'Cinzel', serif",
                        }}>{item.icon} {item.label}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Haki + stats row */}
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                  <div style={{ padding: "3px 12px", background: `${currentHaki.color}14`, border: `1px solid ${currentHaki.color}44`, borderRadius: 20, fontSize: 9, color: currentHaki.color, fontFamily: "'Cinzel', serif" }}>{currentHaki.name}</div>
                  <div style={{ padding: "3px 12px", background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 20, fontSize: 9, color: "#d4af37", fontFamily: "'Cinzel', serif" }}>{xp.toLocaleString()} XP</div>
                  {streak > 0 && <div style={{ padding: "3px 12px", background: "rgba(255,107,53,0.07)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 20, fontSize: 9, color: "#ff6b35", fontFamily: "'Cinzel', serif" }}>🔥 {streak}d streak</div>}
                </div>
              </div>

              {/* ── SKIN TONE ── */}
              <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>🎨 SKIN TONE</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {SKIN_TONES.map(s => (
                    <button key={s.id} onClick={() => setAvatar(a => ({ ...a, skinTone: s.id }))} style={{
                      width: 38, height: 38, borderRadius: "50%",
                      border: `3px solid ${avatar.skinTone === s.id ? "#ffd700" : "transparent"}`,
                      background: s.color, cursor: "pointer", transition: "all 0.2s",
                      transform: avatar.skinTone === s.id ? "scale(1.18)" : "scale(1)",
                      boxShadow: avatar.skinTone === s.id ? `0 0 12px ${s.color}99` : "none",
                    }} title={s.label} />
                  ))}
                </div>
              </div>

              {/* ── OUTFIT LOCKER ── */}
              {[
                { key: "outfits", slotKey: "outfit", label: "OUTFITS", icon: "🎭" },
                { key: "backblings", slotKey: "backbling", label: "BACK BLING", icon: "🎒" },
                { key: "pickaxes", slotKey: "pickaxe", label: "HARVESTING TOOLS", icon: "⚔️" },
                { key: "sprays", slotKey: "spray", label: "EMOTES", icon: "💫" },
              ].map(({ key, slotKey, label, icon }) => (
                <div key={key} style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#d4af37", letterSpacing: 2, marginBottom: 14 }}>{icon} {label}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {LOCKER[key].map(item => (
                      <LockerItem
                        key={item.id}
                        item={item}
                        equipped={avatar[slotKey]}
                        onEquip={id => setAvatar(a => ({ ...a, [slotKey]: id }))}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* ── STATS ── */}
              <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 18, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#d4af37", letterSpacing: 2, marginBottom: 4 }}>BATTLE STATS</div>
                <div style={{ fontSize: 11, color: "#222230", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", marginBottom: 14 }}>Built through physical training</div>
                <StatBar label="ATTACK" value={stats.attack} color="#ff6b35" icon="⚔️" />
                <StatBar label="DEFENSE" value={stats.defense} color="#4fc3f7" icon="🛡️" />
                <StatBar label="ENDURANCE" value={stats.endurance} color="#66bb6a" icon="💪" />
                <StatBar label="LUCK" value={stats.luck} color="#ffd700" icon="🍀" />
              </div>
              <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 18 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "#d4af37", letterSpacing: 2, marginBottom: 4 }}>GROWTH STATS</div>
                <div style={{ fontSize: 11, color: "#222230", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", marginBottom: 14 }}>Built through learning & discipline</div>
                <StatBar label="WISDOM" value={stats.wisdom} color="#ce93d8" icon="🧠" />
                <StatBar label="WEALTH" value={stats.wealth} color="#a5d6a7" icon="💰" />
              </div>
            </div>
          );
        })()}

        {/* ── SHIP ── */}
        {activeTab === "ship" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(10,35,60,0.4), transparent)",
              border: "1px solid rgba(79,195,247,0.12)", borderRadius: 18,
              padding: 24, marginBottom: 18, textAlign: "center",
            }}>
              <div style={{ fontSize: 70, animation: "floatUp 3s ease-in-out infinite" }}>⛵</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: "#4fc3f7", marginTop: 10 }}>
                {avatar.jollyRoger} {avatar.crew ? `The ${avatar.crew} Ship` : "Your Ship"}
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 5 }}>{shipParts.length}/{SHIP_PARTS.length} parts collected</div>
              <div style={{ marginTop: 12, background: "#0e0e1a", borderRadius: 6, height: 6 }}>
                <div style={{
                  width: `${(shipParts.length / SHIP_PARTS.length) * 100}%`, height: "100%",
                  background: "linear-gradient(90deg, #4fc3f766, #4fc3f7)", borderRadius: 6, transition: "width 0.8s",
                }} />
              </div>
            </div>

            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>SHIP PARTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 26 }}>
              {SHIP_PARTS.map(part => (
                <div key={part} style={{
                  background: shipParts.includes(part) ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.015)",
                  border: `1px solid ${shipParts.includes(part) ? "rgba(212,175,55,0.3)" : "#0e0e1c"}`,
                  borderRadius: 12, padding: 14, textAlign: "center", transition: "all 0.3s",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 7 }}>{shipParts.includes(part) ? "✨" : "🔒"}</div>
                  <div style={{ fontSize: 11, color: shipParts.includes(part) ? "#ffd700" : "#2a2a3a", fontFamily: "'Cinzel', serif" }}>{part}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>JOLLY ROGER</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {JOLLY_ROGERS.map(r => (
                <button key={r} onClick={() => setAvatar(a => ({ ...a, jollyRoger: r }))} style={{
                  width: 52, height: 52, borderRadius: 12, fontSize: 26,
                  border: `2px solid ${avatar.jollyRoger === r ? "#d4af37" : "#0e0e1c"}`,
                  background: avatar.jollyRoger === r ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.015)",
                  transform: avatar.jollyRoger === r ? "scale(1.1)" : "scale(1)", transition: "all 0.2s",
                }}>{r}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── REWARDS ── */}
        {activeTab === "rewards" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 18, padding: 24, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#d4af37", letterSpacing: 2, marginBottom: 6 }}>DAILY MYSTERY BOX</div>
              <div style={{ fontSize: 12, color: "#444", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", marginBottom: 20 }}>
                {boxOpened ? "Box opened for today. Return tomorrow!" : "A reward awaits. Open your box."}
              </div>
              <MysteryBox onOpen={handleBoxOpen} alreadyOpened={boxOpened} />
            </div>

            {devilFruits.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>🍑 DEVIL FRUITS ({devilFruits.length})</div>
                {devilFruits.map((f, i) => {
                  const rc = RARITY_COLORS[f.rarity] || "#d4af37";
                  return (
                    <div key={i} style={{
                      background: `${rc}08`, border: `1px solid ${rc}22`,
                      borderLeft: `3px solid ${rc}`, borderRadius: 12,
                      padding: "12px 16px", marginBottom: 8,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <span style={{ fontSize: 28 }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#e8e8e8", fontFamily: "'Cinzel', serif" }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{f.desc}</div>
                      </div>
                      <div style={{ fontSize: 9, color: rc, fontWeight: 700 }}>{f.rarity}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {inventory.length > 0 && (
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>📚 KNOWLEDGE VAULT ({inventory.length})</div>
                {inventory.map((item, i) => {
                  const tc = { book: "#4fc3f7", tip: "#a5d6a7", hack: "#ffd700", wisdom: "#ce93d8" }[item.type] || "#d4af37";
                  const tl = { book: "📘 BOOK REC", tip: "💰 FINANCE TIP", hack: "⚡ PRODUCTIVITY", wisdom: "🏛️ MINDSET" }[item.type] || "REWARD";
                  return (
                    <div key={i} style={{
                      background: `${tc}07`, border: `1px solid ${tc}1a`,
                      borderLeft: `3px solid ${tc}`, borderRadius: 12,
                      padding: "13px 16px", marginBottom: 10,
                      display: "flex", alignItems: "flex-start", gap: 12,
                      animation: "fadeInFast 0.3s ease",
                    }}>
                      <span style={{ fontSize: 27, flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, color: tc, fontFamily: "'Cinzel', serif", letterSpacing: 1.5, marginBottom: 5 }}>{tl}</div>
                        <div style={{ fontSize: 13, color: "#ececec", fontFamily: "'Cinzel', serif", marginBottom: 6 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#888", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", lineHeight: 1.65 }}>{item.desc}</div>
                      </div>
                      <div style={{ fontSize: 9, color: RARITY_COLORS[item.rarity] || "#d4af37", fontWeight: 700, flexShrink: 0 }}>{item.rarity}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {devilFruits.length === 0 && inventory.length === 0 && (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#222230", fontFamily: "'Crimson Pro', serif", fontStyle: "italic", fontSize: 13 }}>
                Open your Mystery Box to start collecting rewards.
              </div>
            )}
          </div>
        )}

        {/* ── CREW ── */}
        {activeTab === "crew" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "#d4af37", letterSpacing: 2, marginBottom: 14 }}>🏆 LEADERBOARD</div>
            {[{ name: avatar.name, points, haki: currentHaki.name }, ...leaderboard]
              .sort((a, b) => b.points - a.points)
              .map((p, i) => {
                const isMe = p.name === avatar.name;
                const mc = ["#ffd700", "#c0c0c0", "#cd7f32"];
                return (
                  <div key={i} style={{
                    background: isMe ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.015)",
                    border: `1px solid ${isMe ? "rgba(212,175,55,0.22)" : "#0e0e1c"}`,
                    borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                    display: "flex", alignItems: "center", gap: 12,
                    animation: "fadeInFast 0.3s ease",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: i < 3 ? mc[i] : "#0e0e1c",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: i < 3 ? "#000" : "#333",
                      border: i >= 3 ? "1px solid #1a1a28" : "none",
                    }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontFamily: "'Cinzel', serif",
                        color: isMe ? "#ffd700" : "#d8d8d8",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>{p.haki}</div>
                    </div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: isMe ? "#d4af37" : "#555" }}>
                      {p.points.toLocaleString()}
                    </div>
                  </div>
                );
              })}

            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 18, marginTop: 22, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 12 }}>SHARE PROGRESS</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ icon: "📸", label: "Screenshot" }, { icon: "📤", label: "Share" }, { icon: "👥", label: "Invite" }].map(s => (
                  <button key={s.label} onClick={() => showNotif(`${s.label} coming soon!`, s.icon)} style={{
                    flex: 1, background: "rgba(255,255,255,0.025)", border: "1px solid #141422",
                    borderRadius: 12, padding: "12px 6px", color: "#444",
                    fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 1, transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{s.icon}</div>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 18, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 10 }}>⚙️ DATA & SAVE</div>
              {user && (
                <div style={{
                  background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 14,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span>👤</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#d4af37", fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>SIGNED IN</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Sign out? Your progress stays saved.")) {
                        setUser(null);
                        setScreen("auth");
                      }
                    }}
                    style={{
                      background: "none", border: "1px solid #252535", borderRadius: 8,
                      padding: "4px 10px", color: "#555", fontSize: 10,
                      fontFamily: "'Cinzel', serif", letterSpacing: 1,
                    }}
                  >SIGN OUT</button>
                </div>
              )}
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.75, marginBottom: 14, fontFamily: "'Crimson Pro', serif" }}>
                Progress saves automatically after every action. Daily quests reset each new day — your stats, points, and rewards are permanent.
              </div>
              <div style={{
                background: "rgba(165,214,167,0.05)", border: "1px solid rgba(165,214,167,0.12)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 14,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span>💾</span>
                <div>
                  <div style={{ fontSize: 10, color: "#a5d6a7", fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>AUTO-SAVE ACTIVE</div>
                  <div style={{ fontSize: 11, color: "#333" }}>{lastSaved ? `Last saved at ${lastSaved}` : "No save yet"}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Reset ALL progress? This cannot be undone.")) {
                    localStorage.removeItem("piratesquest_v2");
                    window.location.reload();
                  }
                }}
                style={{
                  width: "100%", background: "rgba(180,40,40,0.06)", border: "1px solid rgba(180,40,40,0.18)",
                  borderRadius: 10, padding: 11, color: "#e57373",
                  fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1,
                }}
              >🗑️ RESET ALL PROGRESS</button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid #0e0e1c", borderRadius: 16, padding: 18 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: "#d4af37", letterSpacing: 2, marginBottom: 10 }}>🆘 NEED HELP?</div>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.75, marginBottom: 14, fontFamily: "'Crimson Pro', serif" }}>
                Experiencing a bug? Have a suggestion? Want to report an issue? We're here.
              </div>
              <button
                onClick={() => setSupportOpen(true)}
                style={{
                  width: "100%", background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.04))",
                  border: "1px solid rgba(212,175,55,0.18)", borderRadius: 10, padding: 12,
                  color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 1,
                }}
              >📨 CONTACT SUPPORT</button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(6,6,16,0.97)", borderTop: "1px solid rgba(212,175,55,0.08)",
        backdropFilter: "blur(14px)", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "10px 0 8px", background: "none", border: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              transition: "opacity 0.2s",
            }}>
              <div style={{ fontSize: 19, filter: activeTab === tab.id ? "none" : "grayscale(1) brightness(0.4)" }}>{tab.icon}</div>
              <div style={{
                fontSize: 8, fontFamily: "'Cinzel', serif", letterSpacing: 0.5,
                color: activeTab === tab.id ? "#d4af37" : "#252535",
              }}>{tab.label}</div>
              <div style={{
                height: 2, borderRadius: 1, background: "#d4af37",
                width: activeTab === tab.id ? 18 : 0, transition: "width 0.25s ease",
              }} />
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", paddingBottom: 7, fontSize: 8, color: "#111120", fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>
          © {new Date().getFullYear()} Francis Hakeem Tajah Guevara · All Rights Reserved
        </div>
      </div>
    </div>
  );
}
