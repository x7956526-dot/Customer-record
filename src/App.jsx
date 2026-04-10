import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { loadData, saveData } from './utils/storage';
import { nowISO, uid } from './utils/helpers';

export default function App() {
  const [data, setData] = useState(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const api = useMemo(() => ({
    customers: data.customers,
    projects: data.projects,
    addCustomer(payload) {
      const ts = nowISO();
      setData((prev) => ({ ...prev, customers: [...prev.customers, { id: uid(), ...payload, createdAt: ts, updatedAt: ts }] }));
    },
    updateCustomer(id, payload) {
      setData((prev) => ({
        ...prev,
        customers: prev.customers.map((c) => (c.id === id ? { ...c, ...payload, updatedAt: nowISO() } : c)),
      }));
    },
    deleteCustomer(id) {
      setData((prev) => ({
        customers: prev.customers.filter((c) => c.id !== id),
        projects: prev.projects.filter((p) => p.customerId !== id),
      }));
    },
    addProject(payload) {
      const ts = nowISO();
      setData((prev) => ({ ...prev, projects: [...prev.projects, { id: uid(), ...payload, followUps: [], createdAt: ts, updatedAt: ts }] }));
    },
    updateProject(id, payload) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...payload, updatedAt: nowISO() } : p)),
      }));
    },
    deleteProject(id) {
      setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
    },
    addFollowUp(projectId, record) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? { ...p, followUps: [{ id: uid(), createdAt: nowISO(), ...record }, ...(p.followUps || [])], updatedAt: nowISO() }
            : p,
        ),
      }));
    },
    deleteFollowUp(projectId, recordId) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? { ...p, followUps: (p.followUps || []).filter((r) => r.id !== recordId), updatedAt: nowISO() }
            : p,
        ),
      }));
    },
    replaceAll(nextData) {
      setData(nextData);
    },
  }), [data]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage api={api} />} />
        <Route path="/customers" element={<CustomerListPage api={api} />} />
        <Route path="/customers/:id" element={<CustomerDetailPage api={api} />} />
        <Route path="/projects" element={<ProjectListPage api={api} />} />
        <Route path="/projects/:id" element={<ProjectDetailPage api={api} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
