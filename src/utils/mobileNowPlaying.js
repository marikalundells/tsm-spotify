const STORAGE_KEY = 'mobile_now_playing_track';

export function getMobileNowPlaying() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Kunde inte läsa mobile now playing:', error);
    return null;
  }
}

export function setMobileNowPlaying(track) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(track));
    window.dispatchEvent(new Event('mobile-now-playing-updated'));
  } catch (error) {
    console.error('Kunde inte spara mobile now playing:', error);
  }
}

export function clearMobileNowPlaying() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('mobile-now-playing-updated'));
  } catch (error) {
    console.error('Kunde inte rensa mobile now playing:', error);
  }
}