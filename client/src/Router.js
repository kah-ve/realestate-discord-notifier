import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
  Routes
} from "react-router-dom"
import FrontPage from "./components/FrontPage/FrontPage"


function MyRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<FrontPage />} />
        <Route
        path="/*"
        element={<Navigate to="/" />}
    />
      </Routes>
    </Router>
  );
}

export default MyRouter;
