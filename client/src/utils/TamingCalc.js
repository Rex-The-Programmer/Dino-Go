export const SANGUINE_BOOST = 1.3; 

const AFFINITY_SCALE = 4.15;

function eat(state, dino, food, count, speed, needed) {
    let eaten = 0;
    const gain = Number(food.affinity) * speed * AFFINITY_SCALE;
    while (eaten < count && state.affinity < needed && state.te > 0) {
        state.affinity += gain * state.te;
        state.te *= Math.max(0, 1 - Number(dino.ineffectiveness) / gain);
        eaten++;
    }
    return eaten;
    }

    export function calculate({ dino, foods, level, tamingSpeed, drainMult = 1, sanguine, selected }) {
    const speed = tamingSpeed * (sanguine ? SANGUINE_BOOST : 1);
    const needed = Number(dino.affinity_needed) + Number(dino.affinity_per_level) * level;
    const rate = Number(dino.food_consumption) * drainMult; // food points / second

    const base = { affinity: 0, te: 1 };
    const fedByFood = {};
    for (const f of foods) {
        const n = Math.max(0, Math.floor(selected[f.id] || 0));
        fedByFood[f.id] = eat(base, dino, f, n, speed, needed);
    }

    return foods.map((f) => {
        const s = { ...base };
        const extra = eat(s, dino, f, 100000, speed, needed);
        const done = s.affinity >= needed;
        const total = fedByFood[f.id] + extra;
        const te = done ? s.te : 0;
        return {
        id: f.id,
        name: f.food_name,
        max: done ? total : null,                       
        effectiveness: te,                             
        bonusLevels: Math.floor((te * level) / 2),      
        seconds: done && rate > 0 ? (extra * Number(f.food_value)) / rate : null,
        };
    });
}

export function formatTime(sec) {
    if (sec == null) return "—";
    const s = Math.round(sec);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    const mm = String(m).padStart(h ? 2 : 1, "0"), rr = String(r).padStart(2, "0");
    return h ? `${h}:${mm}:${rr}` : `${mm}:${rr}`;
}