import routes from "./routes/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="root">
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, Component }, i) => (
            <Route path={path} key={i} element={<Component />} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
