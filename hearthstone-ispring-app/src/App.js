import logo from './logo.svg';
import CardsCmpnt from "../components/CardComponent.js"
import {cards as c} from "../src/state"
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <Cards cards={c} ></Cards>
    </div>
  );
}

export default App;
