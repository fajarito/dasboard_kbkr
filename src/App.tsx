import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DemandSatisfiedDetailPage } from './pages/DemandSatisfiedDetailPage'
import { FourTDetailPage } from './pages/FourTDetailPage'
import { GenericIndicatorDetailPage } from './pages/GenericIndicatorDetailPage'
import { KtdDetailPage } from './pages/KtdDetailPage'
import { McprDetailPage } from './pages/McprDetailPage'
import { MiiDetailPage } from './pages/MiiDetailPage'
import { MkjpDetailPage } from './pages/MkjpDetailPage'
import { OverviewPage } from './pages/OverviewPage'
import { PetaCapaianPage } from './pages/PetaCapaianPage'
import { UnmetNeedDetailPage } from './pages/UnmetNeedDetailPage'
import { remainingIndicators } from './data/remainingIndicators'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/peta" element={<PetaCapaianPage />} />
        <Route path="/indikator/mcpr" element={<McprDetailPage />} />
        <Route path="/indikator/unmet-need" element={<UnmetNeedDetailPage />} />
        <Route
          path="/indikator/demand-satisfied"
          element={<DemandSatisfiedDetailPage />}
        />
        <Route path="/indikator/4t" element={<FourTDetailPage />} />
        <Route path="/indikator/ktd" element={<KtdDetailPage />} />
        <Route path="/indikator/mii" element={<MiiDetailPage />} />
        <Route path="/indikator/mkjp" element={<MkjpDetailPage />} />
        {remainingIndicators.map((config) => (
          <Route
            key={config.slug}
            path={`/indikator/${config.slug}`}
            element={<GenericIndicatorDetailPage config={config} />}
          />
        ))}
        <Route path="/indikator" element={<Navigate to="/indikator/mcpr" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
