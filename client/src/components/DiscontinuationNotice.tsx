import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'basker-discontinuation-notice-dismissed';

export function DiscontinuationNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the notice
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem(STORAGE_KEY, expiryDate.toISOString());
  };

  // Check if the dismissal has expired
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const expiryDate = new Date(dismissed);
      if (new Date() > expiryDate) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 border-rose-500/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <DialogTitle className="text-2xl font-bold text-white">
              Important Update: Basker Platform Transition
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/80 space-y-4 pt-2">
            <p className="text-base leading-relaxed">
              This site is being discontinued. However, <strong className="text-white">Basker will still exist in a 100% functional form</strong> but is being built into another platform called <strong className="text-amber-400">Karmanal</strong>.
            </p>
            <p className="text-base leading-relaxed">
              <strong className="text-amber-400">Karmanal</strong> is an AT Protocol based site that is both a Bluesky client and an alternative to a Reddit-style community. All of Basker's full features will be conveniently included in this new platform.
            </p>
            <p className="text-base leading-relaxed text-rose-300">
              The <strong>basker.bio</strong> domain will be phased out as we transition to the new platform.
            </p>
            <div className="pt-2 px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <p className="text-base leading-relaxed text-emerald-200 font-medium">
              <strong className="text-emerald-100">Important:</strong> No data will be lost during this transition. Your Basker profile, widgets, settings, and all features will remain fully functional and will be seamlessly migrated to Karmanal.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
          >
            Understood
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

