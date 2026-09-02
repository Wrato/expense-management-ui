import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ExpenseForm from "./pages/ExpenseForm";
import ExpenseDetail from "./pages/ExpenseDetail";
import ExpenseEdit from "./pages/ExpenseEdit";
import ExpenseReview from "./pages/ExpenseReview";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import DocumentEdit from "./pages/DocumentEdit";
import IssuerCompanies from "./pages/IssuerCompanies";
import Categories from "./pages/Categories";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Layout from "./components/Layout";

import { UserRole } from "./models/UserRole";

function App() {
  return (
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-expense"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Layout>
                <Documents />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <DocumentEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DocumentDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/issuer-companies"
          element={
            <RoleRoute allowedRoles={[UserRole.Admin]}>
              <Layout>
                <IssuerCompanies />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <RoleRoute allowedRoles={[UserRole.Admin]}>
              <Layout>
                <Categories />
              </Layout>
            </RoleRoute>
          }
        />

        <Route
          path="/expenses/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/:id/review"
          element={
            <ProtectedRoute>
              <ExpenseReview />
            </ProtectedRoute>
          }
        />

      </Routes>
  );
}

export default App;