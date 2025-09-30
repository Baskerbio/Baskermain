import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EditModeProvider } from "./components/EditModeProvider";
import { AdminProvider } from "./contexts/AdminContext";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import PublicProfilePage from "@/pages/PublicProfilePage";
import NotFound from "@/pages/not-found";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Pricing from "@/pages/Pricing";
import Support from "@/pages/Support";
import InfoCenter from "@/pages/InfoCenter";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import EULA from "@/pages/EULA";
import VerificationPolicy from "@/pages/VerificationPolicy";
import { LoginScreen } from "@/components/LoginScreen";
import { AdminPanel } from "@/components/AdminPanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginScreen} />
      <Route path="/profile" component={Profile} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/support" component={Support} />
      <Route path="/info" component={InfoCenter} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/eula" component={EULA} />
      <Route path="/verification-policy" component={VerificationPolicy} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/:handle" component={PublicProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <EditModeProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </EditModeProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
