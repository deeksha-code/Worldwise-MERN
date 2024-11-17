//installed vite react app
//implemented routings for navigation without refreshing the page
//created context API and useReducer
//implemented module css to avoid issues with global CSS where styles can accidentally override each other
//implemented useCallback to avoid changing of functions during renders (city.jsx,cityContext.jsx)

/*
implemented Lazy loading to improve performance by loading components (like HomePage, Login, etc.)
 only when their routes are accessed, instead of loading everything upfront. This reduces the initial load time,
 saves bandwidth, and ensures a better user experience with a loading indicator (<SpinnerFullPage />) while fetching components.
*/

/*
used react leaflet library for Interactive Maps which Enables users to pan, zoom, and explore maps effortlessly.

*/


/*
Worldwise (Web Application)
A travel tracking web app where users can register and log cities they have visited or plan to visit. All data is stored in a JSON file. Key features and skills learned during development:

Implemented Routing: Set up client-side navigation to enable page transitions without page refreshes, ensuring a smooth user experience.
State Management: Utilized React Context API and useReducer to manage global state efficiently across components.
Scoped Styling: Applied Module CSS to prevent global style conflicts, ensuring component-level styling encapsulation.
Optimized Performance: Leveraged useCallback to prevent unnecessary re-renders of functions, improving app performance (e.g., in City.jsx and CityContext.jsx).
Lazy Loading: Improved application performance by implementing lazy loading for components like HomePage and Login, reducing initial load time and saving bandwidth. A <SpinnerFullPage /> was used as a loading indicator during component fetches.
Interactive Maps: Integrated the React Leaflet library to enable users to interact with maps, providing panning, zooming, and exploration features.
*/