import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PinInput from './pages/PinInput';
import CheckInSuccess from './pages/CheckInSuccess';
import CheckOutConfirmation from './pages/CheckOutConfirmation';
import CheckOutSuccess from './pages/CheckOutSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PinInput />} />
        <Route path="/checkin-success" element={<CheckInSuccess />} />
        <Route path="/checkout-confirmation" element={<CheckOutConfirmation />} />
        <Route path="/checkout-success" element={<CheckOutSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
