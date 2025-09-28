import { useAuth } from '../contexts/AuthContext';
import Landing from './Landing';

export default function Home() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always show landing page - it will handle authentication internally
  return <Landing />;
}
