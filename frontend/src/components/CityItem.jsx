import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  // console.log("current city", currentCity);
  // console.log("city", city);
  const { cityName, emoji, date, _id, position} = city;
 
  function handleClick(e) {
    e.preventDefault();
    deleteCity(_id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity._id === _id ? styles["cityItem--active"] : ""
        }`}
        to={`${_id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>

        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
