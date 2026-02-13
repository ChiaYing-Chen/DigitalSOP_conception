import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Runner } from './pages/Runner';
import { History } from './pages/History';
import { Calendar } from './pages/Calendar';
import { VersionControl } from './pages/VersionControl';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/run/:id" element={<Runner />} />
          <Route path="/history" element={<History />} />
          <Route path="/versions" element={<VersionControl />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;