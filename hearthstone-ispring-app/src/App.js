import Cards from "./components/CardsCmpnt.js";
import {cards as c} from "../src/state.js"
import Player from "./components/PlayerComponent";
import {player as p} from "../src/state.js"
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                HEARTHSTONE
            </header>
            <Player player={p}></Player>
            <Cards cards={c}></Cards>
        </div>
    );
}

export default App;
