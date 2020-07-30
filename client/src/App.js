import React, { createContext, useReducer } from 'react';
import Navbar from './components/navbar';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { reducer, initialState } from './reducers/userReducer';
import Routing from './components/routing';

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
