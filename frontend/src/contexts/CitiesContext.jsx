import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import { useAuth } from "../contexts/FakeAuthContext";

// console.log("base url", import.meta.env.VITE_BACKEND_URL);
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
        cities: state.cities.filter((city) => city._id !== action.payload),
        currentCity: action.payload,
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
  const { user } = useAuth(); // Get user from AuthContext
  const userId = user?.id;
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // console.log("cities", cities);

  // Retrieve userId from session storage
  // const userId = sessionStorage.getItem("user")
  //   ? JSON.parse(sessionStorage.getItem("user")).id
  //   : null;

  // useEffect(
  //   function () {
  //     if (!userId) return; // Only fetch if userId is available

  //     async function fetchCitiesList() {
  //       dispatch({ type: "loading" });

  //       try {
  //         const res = await axios.get(
  //           `${import.meta.env.VITE_BACKEND_URL}/api/user/cities`,
  //           {
  //             params: { userId }, // Add userId to the request
  //           }
  //         );
  //         dispatch({ type: "cities/loaded", payload: res.data });
  //       } catch (error) {
  //         dispatch({
  //           type: "rejected",
  //           payload: "There was an error loading cities..",
  //         });
  //       }
  //     }

  //     fetchCitiesList(); // Call the async function
  //   },
  //   [userId]
  // );

  // useEffect(() => {
  //   if (!userId) return; // Only fetch if userId is available

  //   async function fetchCitiesList() {
  //     dispatch({ type: "loading" });

  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/user/cities`,
  //         {
  //           params: { userId },
  //         }
  //       );
  //       dispatch({ type: "cities/loaded", payload: res.data });
  //     } catch (error) {
  //       dispatch({
  //         type: "rejected",
  //         payload: "There was an error loading cities..",
  //       });
  //     }
  //   }

  //   fetchCitiesList();
  // }, [userId]);

  useEffect(() => {
    if (!userId) return;
    async function fetchCitiesList() {
      dispatch({ type: "loading" });
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/cities`,
          { params: { userId } }
        );
        dispatch({ type: "cities/loaded", payload: res.data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities..",
        });
      }
    }
    fetchCitiesList();
  }, [userId]);

  const getCity = useCallback(
    async function getCity(id) {
      // console.log(" city id", id);
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/city/${id}`,
          {
            params: { userId }, // Add userId to the request
          }
        );
        // console.log("res data", res.data);
        dispatch({ type: "city/loaded", payload: res.data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading city..",
        });
      }
    },
    [currentCity.id, userId]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/city`,
        newCity,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { userId }, // Add userId to the request
        }
      );
      // console.log("response data", res.data.city);
      dispatch({ type: "city/created", payload: res.data.city });
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
      // console.log(" delete city id", id);
      // console.log("cities",cities);
      const data = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/city/${id}`,
        {
          params: { userId }, // Add userId to the request
        }
      );
      // console.log("deleted data", data);
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
    throw new Error("CitiesContext was used outside of the Cities Provider");
  return context;
}

export { CitiesProvider, useCities };
