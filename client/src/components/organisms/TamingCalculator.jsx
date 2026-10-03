import { useMemo, useState } from "react";
import { calculate, formatTime } from "../../utils/TamingCalc";
import styles from "./TamingCalculator.module.css";

const MAX_FOODS = 3; 
const num = (v, fallback) => (Number.isFinite(Number(v)) && v !== "" ? Number(v) : fallback);

export default function TamingCalculator({ dino, foods }) {
    const [level, setLevel] = useState(150);
    const [tamingSpeed, setTamingSpeed] = useState(1);
    const [sanguine, setSanguine] = useState(false);
    const [selected, setSelected] = useState({});

    const hasData = dino.affinity_needed != null && foods && foods.length > 0;
    const lvl = Math.max(1, num(level, 1));

    const rows = useMemo(() => {
        if (!hasData) return [];
        return calculate({
        dino,
        foods: foods.slice(0, MAX_FOODS),
        level: lvl,
        tamingSpeed: Math.max(0.1, num(tamingSpeed, 1)),
        sanguine,
        selected,
        });
    }, [dino, foods, lvl, tamingSpeed, sanguine, selected, hasData]);

    if (!hasData) {
        return <p className={styles.empty}>Taming calculator data isn't available for this creature yet.</p>;
    }

    const setFed = (id, v) => setSelected((s) => ({ ...s, [id]: v === "" ? "" : Math.max(0, Number(v)) }));

    return (
        <section className={styles.calc} aria-labelledby="calc-title">
        <h2 id="calc-title" className={styles.title}>Taming Calculator</h2>

        <div className={styles.settings}>
            <label className={styles.field}>
            <input type="number" min="1" value={level} onChange={(e) => setLevel(e.target.value)} />
            <span>Level</span>
            </label>
            <label className={styles.field}>
            <input type="number" min="0.1" step="0.1" value={tamingSpeed}
                    onChange={(e) => setTamingSpeed(e.target.value)} />
            <span>Taming speed</span>
            </label>
        </div>

        <label className={styles.elixir}>
            <input type="checkbox" checked={sanguine} onChange={(e) => setSanguine(e.target.checked)} />
            <strong>Use Sanguine Elixir</strong> <small>increases taming by 30%</small>
        </label>

        <div className={styles.table} role="table">
            <div className={`${styles.row} ${styles.head}`} role="row">
            <span role="columnheader">Food</span>
            <span role="columnheader">Selected food / Max</span>
            <span role="columnheader">Time</span>
            <span role="columnheader">Effectiveness</span>
            </div>
            {rows.map((r) => (
            <div className={styles.row} role="row" key={r.id}>
                <span className={styles.food}>{r.name}</span>
                <span className={styles.qty}>
                <input aria-label={`${r.name} fed`} type="number" min="0" value={selected[r.id] ?? 0}
                        onChange={(e) => setFed(r.id, e.target.value)} />
                <span className={styles.max}>{r.max ?? "—"}</span>
                </span>
                <span>{formatTime(r.seconds)}</span>
                <span className={styles.eff}>
                {r.max == null ? (
                    <em>Can't finish with this food</em>
                ) : (
                    <>
                    <b>{(r.effectiveness * 100).toFixed(1)}%</b>{" "}
                    <small>+{r.bonusLevels} Lvl ({lvl + r.bonusLevels})</small>
                    <span className={styles.bar}><span style={{ width: `${r.effectiveness * 100}%` }} /></span>
                    </>
                )}
                </span>
            </div>
            ))}
        </div>
        </section>
    );
}