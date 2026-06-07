import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Residents } from './pages/Residents';
import { ActiveResidents } from './pages/ActiveResidents';
import { LeftResidents } from './pages/LeftResidents';
import { ResidentDetails } from './pages/ResidentDetails';
import { Fees } from './pages/Fees';
import { Receipts } from './pages/Receipts';
import { ReceiptView } from './pages/ReceiptView';
import { RoomsFloors } from './pages/RoomsFloors';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
export function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/residents/active" element={<ActiveResidents />} />
              <Route path="/residents/left" element={<LeftResidents />} />
              <Route path="/residents/:id" element={<ResidentDetails />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/receipts/:id" element={<ReceiptView />} />
              <Route path="/rooms" element={<RoomsFloors />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>);

}