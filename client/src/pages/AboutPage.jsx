import styles from './AboutPage.module.css';

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>About Dino Go</h1>
                <p className={styles.heroSubtitle}>
                    Why this app exists and where the data comes from.
                </p>
            </header>

            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Purpose</h2>
                <p>
                    Dino Go is a quick taming reference for <em>ARK: Survival Evolved</em> —
                    built so you can check the taming method, preferred food, and knockout
                    weapon for a dino before heading out to tame it, without digging
                    through a full wiki.
                </p>
            </section>

            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Data &amp; Images</h2>
                <p>
                    Taming data for 18 common tames, sourced from the ARK Official
                    Community Wiki and cross-checked against Dododex's stat calculator,
                    specifically for <em>ARK: Survival Evolved</em> (not Ascended).
                    Images are stored locally so the app doesn't depend on an external
                    host staying up.
                </p>
            </section>

            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Built With</h2>
                <ul className={styles.tagList}>
                    <li>React + Vite</li>
                    <li>React Router</li>
                    <li>Node.js + Express</li>
                    <li>PostgreSQL (Supabase)</li>
                </ul>
            </section>

            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Made by</h2>
                <p>Gerail — student project, built for a React coursework assignment.</p>
            </section>
        </div>
    );
}