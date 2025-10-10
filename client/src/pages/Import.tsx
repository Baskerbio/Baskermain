import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ImportData } from '@/components/ImportData';
import { useAuth } from '@/contexts/AuthContext';

export default function Import() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to import data</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
      </div>
      
      <ImportData />
    </div>
  );
}

