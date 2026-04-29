import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";

CountryList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
};

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="No cities found. Please add a city." />;

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((each) => each.country).includes(city.country))
      return [...acc, { country: city.country, emoji: city.emoji }];
    else return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
