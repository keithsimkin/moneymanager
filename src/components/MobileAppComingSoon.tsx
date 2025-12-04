import { useEffect, useState } from 'react';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';

export function MobileAppComingSoon() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup on all devices
    const hasSeenPopup = localStorage.getItem('hasSeenMobilePopup');
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenMobilePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Mobile App Coming Soon!
          </h2>
          
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            We're working on a dedicated mobile app for a better experience on your device. Stay tuned!
          </p>

          <Button onClick={handleClose} className="w-full">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
