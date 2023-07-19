import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ValuesContext } from './pages/Contexts';
//import all pages
import Home from './pages/Home.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import Preferences from './pages/Preferences.jsx';
import Callback from './pages/Callback.jsx';

//create app HTML structure
const App = () => {
  const [globalValues, setGlobalValues] = useState({ access_token: '', email: '', username: '' });

  return (
    <div>
      <ValuesContext.Provider value={{ globalValues, setGlobalValues }}>
        <Routes>
          {/* Add each page as a route */}
          <Route path="/" element={<Signin />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </ValuesContext.Provider>
    </div>
  );
};

export default App;
