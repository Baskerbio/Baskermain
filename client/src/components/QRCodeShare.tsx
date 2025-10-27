import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface QRCodeShareProps {
  profileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeShare({ profileUrl, isOpen, onClose }: QRCodeShareProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = qrRef.current.querySelector('canvas');
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = 'basker-profile-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Basker Profile',
          text: 'Check out my Basker profile',
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(profileUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Profile with QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to visit your profile
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* QR Code with Logo */}
          <div ref={qrRef} className="relative bg-white p-4 rounded-lg shadow-lg">
            <QRCode
              value={profileUrl}
              size={256}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {profileUrl}
          </p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
