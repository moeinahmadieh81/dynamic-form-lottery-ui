import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoute } from '../auth/AdminRoute';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminFormBuilderPage } from '../pages/AdminFormBuilderPage';
import { AdminFormDetailsPage } from '../pages/AdminFormDetailsPage';
import { FormDetailPage } from '../pages/FormDetailPage';
import { FormsPage } from '../pages/FormsPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { LotteryResultPage } from '../pages/LotteryResultPage';
import { MySubmissionsPage } from '../pages/MySubmissionsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="forms/:id" element={<FormDetailPage />} />
            <Route path="forms/:id/lottery" element={<LotteryResultPage />} />
            <Route path="my-submissions" element={<MySubmissionsPage />} />

            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="admin/forms/new" element={<AdminFormBuilderPage />} />
              <Route path="admin/forms/:id/edit" element={<AdminFormBuilderPage />} />
              <Route path="admin/forms/:id" element={<AdminFormDetailsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
