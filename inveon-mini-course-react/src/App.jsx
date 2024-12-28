import HomePage from "./pages/Homepage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseDetailPage from "./components/top-header/CourseDetailPage.jsx";

function App() {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/course/:id" element={<CourseDetailPage />} />

          </Routes>
      </Router>
  )
}

export default App
