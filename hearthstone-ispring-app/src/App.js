import Cards from "./components/CardsCmpnt.js";
import {cards as c} from "../src/state"
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          HEARTHSTONE
      </header>
      <Cards cards={c} ></Cards>
    </div>
  );
}

export default App;
