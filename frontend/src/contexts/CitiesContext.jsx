import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

console.log("base url",import.meta.env.VITE_BASE_URL);
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity:action.payload,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("unknown action type");
  }
}

function CitiesProvider({ children }) {
  // const [state,dispatch]=useReducer(reducer,initialState)
  const [{ cities, isLoading, currentCity,error}, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCitiesList() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities..",
        });
      }
    }

    fetchCitiesList(); // Call the async function
  }, []); // Empty dependency array to run the effect only once


  //without using callback
//   (async function getCity(id) {
//    if (Number(id) === currentCity.id) return;
//    dispatch({ type: "loading" });
//    try {
//      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cities/${id}`);
//      const data = await res.json();
//      dispatch({ type: "city/loaded", payload: data });
//    } catch (error) {
//      dispatch({
//        type: "rejected",
//        payload: "There was an error loading city..",
//      });
//    }
//  }

//using usecallBack
 const getCity = useCallback(async function getCity(id) {
   if (Number(id) === currentCity.id) return;
   dispatch({ type: "loading" });
   try {
     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cities/${id}`);
     const data = await res.json();
     dispatch({ type: "city/loaded", payload: data });
   } catch (error) {
     dispatch({
       type: "rejected",
       payload: "There was an error loading city..",
     });
   }
 }, [currentCity.id]);

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("newly added city", data);
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city ..",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city..",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the Post Provider");
  return context;
}

export { CitiesProvider, useCities };
