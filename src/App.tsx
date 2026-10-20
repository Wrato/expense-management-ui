import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import ExpenseForm from "./pages/ExpenseForm";
import ExpenseDetail from "./pages/ExpenseDetail";
import ExpenseEdit from "./pages/ExpenseEdit";
import ExpenseReview from "./pages/ExpenseReview";
import Documents from "./pages/Documents";
import DocumentForm from "./pages/DocumentForm";
import DocumentDetail from "./pages/DocumentDetail";
import DocumentEdit from "./pages/DocumentEdit";
import Approvals from "./pages/Approvals";
import IssuerCompanies from "./pages/IssuerCompanies";
import IssuerCompanyForm from "./pages/IssuerCompanyForm";
import Categories from "./pages/Categories";
import CategoryForm from "./pages/CategoryForm";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import CostTypes from "./pages/CostTypes";

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
              <RoleRoute
                allowedRoles={[
                  UserRole.Admin,
                  UserRole.Approver
                ]}
              >
                <Layout>
                  <ExpenseReview />
                </Layout>
              </RoleRoute>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/approvals"
          element={
            <ProtectedRoute>
              <RoleRoute
                allowedRoles={[
                  UserRole.Admin,
                  UserRole.Approver
                ]}
              >
                <Layout>
                  <Approvals />
                </Layout>
              </RoleRoute>
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
          path="/documents/new"
          element={
            <ProtectedRoute>
              <Layout>
                <DocumentForm />
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
          path="/issuer-companies/new" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <IssuerCompanyForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

        <Route 
          path="/issuer-companies/:id/edit" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <IssuerCompanyForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
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
          path="/categories/new" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <CategoryForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

        <Route 
          path="/categories/:id/edit" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <CategoryForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

        
        <Route
          path="/cost-types"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[UserRole.Admin]}>
                <Layout>
                  <CostTypes />
                </Layout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />


        <Route 
          path="/users" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <Users /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

        <Route 
          path="/users/new" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <UserForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

        <Route 
          path="/users/:id/edit" 
          element={ 
            <ProtectedRoute> 
              <RoleRoute allowedRoles={[UserRole.Admin]}> 
                <Layout> 
                  <UserForm /> 
                </Layout> 
              </RoleRoute> 
            </ProtectedRoute> 
          } 
        />

      </Routes>
  );
}

export default App;