import React from 'react';
import './App.css';
import DropDown from './components/dropDown';


function App() {

  return (
    <div className="App" onScroll={()=>console.log("Run along!")} >
        <DropDown/>
    </div>
  );
}

export default App;