import routes from "./routes/index";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import { useAppSelector, useAppDispatch } from "./hooks/hooks";
import { signOut } from "./store/slice/authSlice";

const lastSignInWithin12Hours = (lastSignInTime) => {
  if (!lastSignInTime) return false;
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - Number(lastSignInTime);
  const twelveHours = 12 * 60 * 60 * 1000;
  return timeDifference <= twelveHours;
};

const PrivateRoute = ({ element }) => {
  const dispatch = useAppDispatch();
  const { token, lastSignInTime } = useAppSelector((state) => state.auth);
  if (!token || !lastSignInWithin12Hours(lastSignInTime)) {
    dispatch(signOut());
    return <Navigate to="/signup" replace />;
  }
  return element;
};

function App() {
  const dispatch = useAppDispatch();
  const { token, lastSignInTime } = useAppSelector((state) => state.auth);

  if (token && !lastSignInWithin12Hours(lastSignInTime)) {
    dispatch(signOut());
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
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
