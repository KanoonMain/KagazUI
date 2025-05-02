import routes from "./routes/index";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";

// Dummy authentication check (replace with your actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null; // Check if token exists
};

const lastSignInWithin24Hours = () => {
  const lastSignIn = localStorage.getItem("lastSignInTime");
  if (!lastSignIn) return false; // No last sign-in time recorded
  const currentTime = new Date().getTime();
  const lastSignInTime = Number(lastSignIn); // Convert to a number
  const timeDifference = currentTime - lastSignInTime;
  // 24 hours in milliseconds
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return timeDifference <= twentyFourHours;
};

const logOut = () => {
  localStorage.removeItem("authToken"); // Remove auth token
  localStorage.removeItem("lastSignInTime"); // Remove last sign-in time
};

const PrivateRoute = ({ element }) => {
  if (!isAuthenticated() || !lastSignInWithin24Hours()) {
    logOut(); // Log out the user if they are not authenticated or it's been over 24 hours
    return <Navigate to="/signup" replace />; // Redirect to the signup page
  }
  return element;
};

function App() {
  // Check if the user has been logged out due to expiration
  if (isAuthenticated() && !lastSignInWithin24Hours()) {
    logOut(); // Log out the user if last sign-in was over 24 hours ago
  }

  return (
    <div className="root">
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            {routes.map(({ path, Component, isPrivate }, i) => (
              <Route
                key={i}
                path={path}
                element={
                  isPrivate ? (
                    <PrivateRoute element={<Component />} />
                  ) : (
                    <Component />
                  )
                }
              />
            ))}
          </Routes>{" "}
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
