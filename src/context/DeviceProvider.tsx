import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDeviceInfo, type DeviceInfo } from '../lib/deviceFingerprint';

interface DeviceContextValue {
  deviceInfo: DeviceInfo | null;
  isLoading: boolean;
  deviceHash: string;
}

const DeviceContext = createContext<DeviceContextValue>({
  deviceInfo: null,
  isLoading: true,
  deviceHash: '',
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getDeviceInfo()
      .then((info) => {
        if (mounted) {
          setDeviceInfo(info);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize device fingerprint:', err);
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        deviceInfo,
        isLoading,
        deviceHash: deviceInfo?.device_hash || '',
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextValue => {
  return useContext(DeviceContext);
};
