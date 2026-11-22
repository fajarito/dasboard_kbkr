import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DemandSatisfiedDetailPage } from './pages/DemandSatisfiedDetailPage'
import { McprDetailPage } from './pages/McprDetailPage'
import { OverviewPage } from './pages/OverviewPage'
import { UnmetNeedDetailPage } from './pages/UnmetNeedDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/indikator/mcpr" element={<McprDetailPage />} />
        <Route path="/indikator/unmet-need" element={<UnmetNeedDetailPage />} />
        <Route
          path="/indikator/demand-satisfied"
          element={<DemandSatisfiedDetailPage />}
        />
        <Route path="/indikator" element={<Navigate to="/indikator/mcpr" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
