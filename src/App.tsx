import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { NotificationToast } from './components/NotificationToast';
import HomePage from './pages/HomePage';
import ProposalPage from './pages/ProposalPage';
import MarriagePage from './pages/MarriagePage';
import WeddingPreparePage from './pages/WeddingPreparePage';
import WeddingLivePage from './pages/WeddingLivePage';
import GuildHallPage from './pages/GuildHallPage';
import ReportsPage from './pages/ReportsPage';
import RankingsPage from './pages/RankingsPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-gradient">
        <Navigation />
        <NotificationToast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proposal" element={<ProposalPage />} />
          <Route path="/marriage" element={<MarriagePage />} />
          <Route path="/wedding/prepare" element={<WeddingPreparePage />} />
          <Route path="/wedding/live/:id" element={<WeddingLivePage />} />
          <Route path="/guild/wedding-hall" element={<GuildHallPage />} />
          <Route path="/reports/weekly" element={<ReportsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}
