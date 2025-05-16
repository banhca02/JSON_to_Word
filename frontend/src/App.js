import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ConvertJson from "./pages/ConvertJson";

function App(){
  return(
    <Router>
      <Routes>
        <Route path = "/" element = {<ConvertJson/>} />
      </Routes>
    </Router>
  );
};

export default App