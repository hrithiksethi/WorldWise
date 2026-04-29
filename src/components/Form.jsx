// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// function flagemojiToPNG(flag) {
//   const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
//     .map((char) => String.fromCharCode(char - 127397).toLowerCase())
//     .join("");
//   return <img src={`https://flagcdn.com/24x18${countryCode}.png`} alt={flag} />;
// }

function Form() {
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { createCity } = useCities();

  const BASE_URL = `https://us1.locationiq.com/v1/reverse`;
  const KEY = "pk.b3aaee66d4ccab426de00c1ed918a479";

  // state variables to implement the reactiveness to the click on map opening the form with the cities details.
  const [mapLat, mapLng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");
  const { isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapLat && !mapLng) return;
    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");
        const res = await fetch(
          `${BASE_URL}?key=${KEY}&lat=${mapLat}&lon=${mapLng}&format=json`,
        );
        const data = await res.json();

        if (data.address == undefined)
          throw new Error(
            "Selected Location out of reach! Please select a location within a Country's Boundary",
          );
        setCityName(
          data.address.city ||
            data.address.state_district ||
            data.address.city_district ||
            data.address.county ||
            "",
        );
        setCountry(data.address.country);
        // setEmoji(convertToEmoji(data.address.country_code));
        setEmoji(convertToEmoji(data.address.country_code));

        console.log(data);
        console.log(country);
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
        console.log(isLoadingGeocoding);
      }
    }
    fetchCityData();
  }, [mapLat, mapLng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (!mapLat && !mapLng)
    return <Message message="Click on the Map to start" />;
  if (isLoadingGeocoding) return <Spinner />;

  if (geoCodingError) {
    return <Message message={geoCodingError} />;
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
