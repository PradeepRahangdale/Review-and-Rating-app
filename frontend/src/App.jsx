import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompanyDetailPage from './pages/CompanyDetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
    </Routes>
  );
}
