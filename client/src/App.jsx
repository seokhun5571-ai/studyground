import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeatSelection from './pages/SeatSelection';
import CheckInSuccess from './pages/CheckInSuccess';
import CheckOutConfirmation from './pages/CheckOutConfirmation';
import CheckOutSuccess from './pages/CheckOutSuccess';
import LeaveSuccess from './pages/LeaveSuccess';
import ReturnSuccess from './pages/ReturnSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SeatSelection />} />
        <Route path="/checkin-success" element={<CheckInSuccess />} />
        <Route path="/checkout-confirmation" element={<CheckOutConfirmation />} />
        <Route path="/checkout-success" element={<CheckOutSuccess />} />
        <Route path="/leave-success" element={<LeaveSuccess />} />
        <Route path="/return-success" element={<ReturnSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
