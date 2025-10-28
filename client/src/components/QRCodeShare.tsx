import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface QRCodeShareProps {
  profileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeShare({ profileUrl, isOpen, onClose }: QRCodeShareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    if (!canvasRef.current) {
      console.error('Canvas ref is null');
      alert('Failed to download QR code. Please try again.');
      return;
    }

    try {
      console.log('Starting QR code download...');
      
      // Check if canvas is tainted
      let dataURL;
      try {
        dataURL = canvasRef.current.toDataURL('image/png');
        console.log('Successfully got data URL');
      } catch (toDataError) {
        console.error('Failed to get data URL (canvas may be tainted):', toDataError);
        alert('The QR code contains an external image that cannot be downloaded due to browser security. Please take a screenshot instead.');
        return;
      }
      
      // Get the canvas data URL and download it
      const link = document.createElement('a');
      link.download = 'basker-profile-qr.png';
      link.href = dataURL;
      console.log('Triggering download...');
      link.click();
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code. Please try again.');
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
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <QRCodeCanvas
              ref={canvasRef}
              value={profileUrl}
              size={256}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="500.000000pt" height="500.000000pt" viewBox="0 0 300.000000 300.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(-90.000000,370.000000) scale(0.150000,-0.150000)" fill="#000000" stroke="none"><path d="M1468 2193 c-26 -119 -51 -220 -55 -224 -5 -4 -22 -10 -39 -14 l-32 -6 -87 151 c-49 82 -89 149 -91 148 -1 -2 17 -75 40 -163 63 -236 60 -236 -229 -75 -120 67 -218 120 -220 118 -3 -4 213 -389 226 -402 5 -6 5 2 0 20 -13 42 -24 68 -31 74 -3 3 -14 21 -24 40 -20 40 -47 87 -88 148 -15 24 -26 47 -23 52 6 10 45 1 45 -10 0 -5 14 -11 30 -15 16 -4 30 -11 30 -16 0 -5 7 -9 15 -9 8 0 15 -5 15 -10 0 -6 3 -9 8 -8 4 1 25 -9 47 -22 21 -14 46 -25 54 -27 9 -1 17 -7 19 -12 2 -6 8 -11 12 -11 5 0 26 -10 47 -22 50 -30 61 -30 95 -6 27 18 29 25 25 67 -2 25 -8 54 -12 64 -13 31 14 19 34 -15 11 -18 27 -40 36 -49 19 -20 63 -30 71 -17 3 5 12 7 19 4 13 -5 55 66 55 93 0 19 40 192 52 224 12 31 28 36 28 9 0 -10 3 -22 8 -26 4 -4 7 -11 7 -14 1 -15 57 -189 72 -224 28 -65 75 -91 116 -63 19 14 77 100 77 115 0 6 4 10 10 10 9 0 7 -51 -6 -112 -7 -35 20 -86 48 -90 40 -6 79 10 221 96 78 46 119 67 124 63 2 -3 -25 -64 -61 -137 -36 -72 -66 -144 -66 -158 1 -18 34 37 103 173 56 110 101 202 100 204 -1 1 -90 -49 -198 -114 -264 -157 -267 -156 -224 80 16 88 29 164 29 170 0 5 -36 -55 -81 -135 -44 -80 -84 -148 -88 -153 -4 -4 -21 -3 -37 3 -29 10 -34 20 -97 219 -37 114 -67 213 -67 219 0 7 -3 12 -7 12 -5 0 -29 -98 -55 -217z"/><path d="M1460 1850 c-95 -12 -197 -54 -257 -104 -29 -25 -46 -28 -186 -41 -68 -6 -105 -13 -133 -27 -16 -7 -52 0 -154 31 -74 22 -136 38 -137 37 -2 -2 62 -43 142 -92 142 -87 146 -90 140 -118 -3 -16 -6 -31 -8 -32 -1 -2 -99 -19 -217 -39 -118 -21 -222 -39 -230 -42 -8 -3 81 -38 199 -79 190 -66 221 -74 287 -74 l74 0 0 -32 c1 -151 145 -361 300 -436 71 -35 179 -62 250 -62 134 0 276 59 378 155 102 96 154 197 177 345 l5 35 74 -3 c72 -3 78 -2 223 62 83 36 163 70 179 77 26 10 10 15 -171 51 -110 22 -203 43 -207 46 -4 4 -8 19 -10 34 -3 26 7 34 147 118 83 49 146 90 140 90 -5 0 -70 -18 -144 -40 -84 -24 -141 -36 -150 -31 -22 11 -68 19 -185 31 -82 8 -103 14 -129 36 -93 78 -261 122 -397 104z m205 -26 c62 -16 196 -82 202 -99 2 -6 -24 -12 -59 -13 -35 -2 -97 -10 -138 -18 -96 -18 -185 -18 -283 1 -43 8 -106 15 -139 15 -42 0 -58 4 -56 12 7 19 125 80 192 99 77 22 204 24 281 3z m-823 -161 c17 -3 28 -14 32 -29 4 -15 14 -24 25 -24 20 0 33 -28 46 -100 4 -19 13 -56 21 -82 10 -31 13 -63 9 -92 l-7 -45 -83 5 c-46 3 -92 7 -102 9 -19 3 -132 41 -173 58 -14 6 -34 12 -45 14 -10 2 -22 8 -26 15 -4 6 -12 7 -19 3 -9 -5 -11 -4 -6 3 5 8 -1 12 -16 13 -46 1 13 16 157 39 211 34 214 35 231 77 8 19 14 36 12 38 -2 1 -27 19 -57 39 -33 22 -55 45 -56 57 -1 14 3 18 14 14 9 -4 28 -9 43 -12z m1121 2 c68 -6 112 -26 120 -54 6 -23 -1 -92 -14 -142 -13 -51 -48 -99 -89 -121 -47 -26 -182 -22 -225 6 -28 18 -28 19 -7 35 25 19 146 206 157 241 6 22 6 23 -8 10 -9 -8 -52 -67 -97 -130 -45 -63 -85 -116 -90 -118 -4 -1 -15 9 -24 23 -17 26 -17 26 64 128 44 56 87 110 96 120 8 10 23 16 37 13 12 -3 48 -7 80 -11z m-578 -20 c39 -20 40 -21 39 -71 -3 -94 -67 -199 -141 -230 -39 -17 -150 -18 -190 -3 -28 11 -28 11 -7 27 38 31 182 257 171 268 -3 4 -133 -166 -204 -265 -5 -8 -43 32 -43 46 0 7 41 62 90 122 50 60 90 111 90 115 0 3 -8 6 -19 6 -17 0 -63 -44 -143 -139 -21 -25 -40 -43 -42 -40 -3 2 -6 26 -8 53 -3 49 -2 50 51 93 l53 44 132 -3 c105 -3 139 -8 171 -23z m422 12 c-15 -7 -56 -47 -92 -89 -35 -43 -66 -74 -69 -69 -3 4 -8 26 -12 49 -6 38 -4 43 31 74 44 38 64 46 125 47 44 0 44 0 17 -12z m433 -7 c0 -10 -19 -30 -56 -59 -19 -15 -25 -27 -22 -52 5 -47 37 -64 176 -93 68 -13 127 -27 130 -31 9 -9 -14 -21 -132 -72 -84 -37 -107 -43 -160 -41 -34 1 -68 -2 -74 -6 -8 -5 -12 4 -13 31 -1 21 -7 -8 -14 -63 -7 -56 -24 -128 -37 -160 -33 -80 -76 -146 -90 -138 -7 5 -8 3 -3 -5 11 -20 -90 -107 -170 -147 -42 -21 -104 -41 -158 -51 -80 -14 -94 -14 -174 0 -48 9 -115 30 -148 46 -118 59 -228 182 -275 309 -24 63 -41 183 -33 225 l6 28 21 -20 c37 -35 97 -53 172 -54 83 0 147 25 190 76 28 33 86 151 98 199 6 28 37 43 72 36 20 -3 29 -20 70 -120 54 -135 127 -189 253 -190 151 -2 216 58 246 222 11 60 26 90 46 90 13 0 19 7 19 24 0 13 6 26 13 29 16 5 47 -3 47 -13z m-1260 0 c0 -12 -35 -31 -44 -23 -11 11 -6 21 12 26 29 8 32 7 32 -3z m1146 -3 c4 -3 1 -13 -6 -22 -12 -14 -15 -14 -31 1 -11 10 -19 21 -19 26 0 10 45 6 56 -5z m-658 -14 c-2 -10 -10 -18 -18 -18 -8 0 -16 8 -18 18 -2 12 3 17 18 17 15 0 20 -5 18 -17z"/><path d="M1500 1295 c0 -26 24 -35 32 -12 7 18 -2 37 -18 37 -8 0 -14 -10 -14 -25z"/><path d="M1554 1305 c-7 -18 3 -35 22 -35 8 0 14 10 14 25 0 27 -27 35 -36 10z"/><path d="M1163 1159 c-51 -23 -60 -55 -14 -46 23 5 43 -2 88 -29 180 -108 447 -108 608 1 23 16 47 24 68 22 49 -3 39 20 -19 47 -38 17 -55 21 -63 13 -8 -8 -6 -15 5 -28 14 -15 11 -19 -28 -42 -75 -44 -153 -61 -268 -62 -114 0 -165 13 -274 67 -49 25 -57 32 -43 40 22 12 22 38 0 37 -10 0 -37 -9 -60 -20z"/></g></svg>'),
                height: 50,
                width: 50,
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
