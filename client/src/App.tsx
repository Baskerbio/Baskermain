import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EditModeProvider } from "./components/EditModeProvider";
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
import CookiePolicy from "@/pages/CookiePolicy";
import DataProcessingAgreement from "@/pages/DataProcessingAgreement";
import AcceptableUsePolicy from "@/pages/AcceptableUsePolicy";
import DMCAPolicy from "@/pages/DMCAPolicy";
import Examples from "@/pages/Examples";
import StarterPacks from "@/pages/StarterPacks";
import StarterPackDetail from "@/pages/StarterPackDetail";
import { LoginScreen } from "@/components/LoginScreen";
import ModerationPanel from "@/pages/ModerationPanel";
import Analytics from "@/pages/Analytics";
import Import from "@/pages/Import";
import Solaris from "@/pages/Tap";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginScreen} />
      <Route path="/profile" component={Profile} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/import" component={Import} />
      <Route path="/solaris" component={Solaris} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/support" component={Support} />
      <Route path="/info" component={InfoCenter} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/eula" component={EULA} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/data-processing" component={DataProcessingAgreement} />
      <Route path="/acceptable-use" component={AcceptableUsePolicy} />
      <Route path="/dmca" component={DMCAPolicy} />
      <Route path="/examples" component={Examples} />
      <Route path="/starter-packs" component={StarterPacks} />
      <Route path="/starter-packs/:packId" component={StarterPackDetail} />
      <Route path="/moderation" component={ModerationPanel} />
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
          <EditModeProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </EditModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
