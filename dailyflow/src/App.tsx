import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Wheels from './pages/Wheels'
import Missions from './pages/Missions'
import MissionEditor from './pages/MissionEditor'
import MissionRun from './pages/MissionRun'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Install from './pages/Install'
import { Lab, Learn } from './pages/Soon'

// HashRouter : fonctionne sur n'importe quel hébergement statique sans configuration de redirection.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="roues" element={<Wheels />} />
          <Route path="roues/:wheel/missions" element={<Missions />} />
          <Route path="roues/:wheel/missions/nouvelle" element={<MissionEditor />} />
          <Route path="missions/:missionId" element={<MissionEditor />} />
          <Route path="mission/:runId" element={<MissionRun />} />
          <Route path="progression" element={<Progress />} />
          <Route path="reglages" element={<Settings />} />
          <Route path="installer" element={<Install />} />
          <Route path="apprendre" element={<Learn />} />
          <Route path="lab" element={<Lab />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
