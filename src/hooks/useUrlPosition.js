import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  // the searchParams is an object that we can use to get the values of the query parameters in the URL. It has a method called get that we can use to get the value of a specific query parameter by its name. We can also use the setSearchParams function to update the query parameters in the URL, but in this case we only need to read them, so we don't need to use it.
  const Lat = searchParams.get("lat");
  const Lng = searchParams.get("lng");

  return [Lat, Lng];
}
