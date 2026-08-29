import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface DeviceInfo {
  device_hash: string;
  browser: string;
  platform: string;
  device_name: string;
}

let cachedDeviceInfo: DeviceInfo | null = null;
let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown Browser';
  const ua = navigator.userAgent;

  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
  if (ua.includes('Opera') || ua.includes('OPR/')) return 'Opera';
  return 'Browser';
}

function detectPlatform(): string {
  if (typeof window === 'undefined') return 'Unknown Platform';
  const ua = navigator.userAgent;
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Win/.test(platform) || /Windows/.test(ua)) return 'Windows';
  if (/Mac/.test(platform) || /Macintosh/.test(ua)) return 'macOS';
  if (/Linux/.test(platform) || /Linux/.test(ua)) return 'Linux';
  return platform || 'Desktop';
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  if (cachedDeviceInfo) {
    return cachedDeviceInfo;
  }

  // Check localStorage cache first for instant response
  try {
    const stored = localStorage.getItem('app_device_info');
    if (stored) {
      cachedDeviceInfo = JSON.parse(stored);
      return cachedDeviceInfo!;
    }
  } catch {
    // Ignore localStorage errors
  }

  const browser = detectBrowser();
  const platform = detectPlatform();
  const deviceName = `${browser} ${platform}`;

  let deviceHash = '';

  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    deviceHash = result.visitorId;
  } catch (error) {
    console.warn('FingerprintJS generation error, using fallback:', error);
    // Fallback fingerprint using hardware and screen properties
    const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'res';
    const lang = typeof navigator !== 'undefined' ? navigator.language : 'lang';
    deviceHash = btoa(`${browser}-${platform}-${screenRes}-${lang}`).substring(0, 32);
  }

  const info: DeviceInfo = {
    device_hash: deviceHash,
    browser,
    platform,
    device_name: deviceName,
  };

  cachedDeviceInfo = info;

  try {
    localStorage.setItem('app_device_info', JSON.stringify(info));
  } catch {
    // Ignore
  }

  return info;
}
