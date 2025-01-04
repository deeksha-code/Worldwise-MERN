import PageNav from "../components/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="img-1.jpg"
          alt="person with dog overlooking mountain with sunset"
        />
        <div>
          <h2>About WorldWide.</h2>
          <p>
            WorldWide is your ultimate travel companion, helping you discover
            cities, plan your journeys, and explore the world with ease. Whether
            you're a frequent traveler or planning your first adventure,
            WorldWide simplifies the process by providing curated information
            about cities and countries across the globe.
          </p>

        </div>
      </section>
    </main>
  );
}
