import CityItem from './CityItem';
import styles from './CityList.module.css'
import Spinner from "./Spinner"
import Message from "./Message"
import { useCities } from '../contexts/CitiesContext';


function CityList() {
  const { cities, isLoading } = useCities();

  // console.log("Cities in CityList:", cities);

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  }

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        // console.log("Mapping city:", city);
        return <CityItem city={city} key={city._id} />;
      })}
    </ul>
  );
}
export default CityList;

