import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

CityList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
};

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="No cities found. Please add a city." />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
