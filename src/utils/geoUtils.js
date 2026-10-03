/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Returns a human-friendly distance descriptor
 */
export function formatDistanceLabel(distanceKm) {
  if (distanceKm == null) return 'Distance variable';
  if (distanceKm === 0 || distanceKm < 5) return 'In your immediate area (< 5 km)';
  if (distanceKm < 30) return `${distanceKm} km away • In-city`;
  if (distanceKm < 150) return `${distanceKm} km away • ~${Math.round(distanceKm / 70)}h drive (Day Trip)`;
  if (distanceKm < 450) return `${distanceKm} km away • Weekend Drive`;
  return `${distanceKm} km away • Fly or Long-haul`;
}

/**
 * Requests browser geolocation with a Promise
 */
export function getCurrentLocationCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
