import MainPage from "../pages/Home";
import CreateTemplate from "../pages/CreateTemplate"
import AdminMain from "../pages/Admin/Main"
const routes = [
  {
    Component: CreateTemplate,
    path: "/create",
  },
  {
    Component: MainPage,
    path: "/",
  },
  {
    Component: AdminMain,
    path: "/admin",
  },
  {
    Component: AdminMain,
    path: "/admin/:path",
  }
];

export default routes;
