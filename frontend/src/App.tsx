import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Lavage from "./pages/Lavage";
import Entretien from "./pages/Entretien";
import Esthetique from "./pages/Esthetique";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import About from "./pages/About";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminVehicleForm from "./pages/admin/AdminVehicleForm";
import AdminServices from "./pages/admin/AdminServices";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/voitures" element={<Vehicles />} />
          <Route path="/voitures/:slug" element={<VehicleDetail />} />
          <Route path="/lavage" element={<Lavage />} />
          <Route path="/entretien" element={<Entretien />} />
          <Route path="/esthetique" element={<Esthetique />} />
          <Route path="/rendez-vous" element={<Booking />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="voitures" element={<AdminVehicles />} />
          <Route path="voitures/nouveau" element={<AdminVehicleForm />} />
          <Route path="voitures/:id" element={<AdminVehicleForm />} />
          <Route path="rendez-vous" element={<AdminAppointments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="lavage" element={<AdminServices category="Lavage" />} />
          <Route path="entretien" element={<AdminServices category="Entretien" />} />
          <Route path="esthetique" element={<AdminServices category="Esthétique" />} />
          <Route path="avis" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="parametres" element={<AdminSettings />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}
