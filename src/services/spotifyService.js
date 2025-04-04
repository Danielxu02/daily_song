// src/services/spotifyService.js

// Spotify API credentials - in a real app, these should be secured on a backend
const CLIENT_ID = '25fbba0173da40139fb3559adaaaddd9';
const CLIENT_SECRET = '1e2e6af503d741b482f80072bd0d9a02';

let token = '';
let tokenExpiry = null;

/**
 * Get a valid Spotify access token
 * @returns {Promise<string>} The access token
 */
export const getAccessToken = async () => {
  // Return existing token if it's still valid
  if (token && tokenExpiry && new Date() < tokenExpiry) {
    return token;
  }
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      token = data.access_token;
      // Set expiry time (typically 1 hour)
      tokenExpiry = new Date(new Date().getTime() + (data.expires_in * 1000));
      return token;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

/**
 * Search for tracks on Spotify
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return (default: 10)
 * @returns {Promise<Array>} Array of track results
 */
export const searchTracks = async (query, limit = 10) => {
  if (!query) return [];
  
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

/**
 * Format Spotify track data into a consistent format for our app
 * @param {Object} spotifyTrack - Raw track data from Spotify API
 * @returns {Object} Formatted track object
 */
export const formatTrackData = (spotifyTrack) => {
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map(artist => artist.name).join(', '),
    albumArt: spotifyTrack.album.images[0]?.url || '',
    preview: spotifyTrack.preview_url,
    externalUrl: spotifyTrack.external_urls.spotify,
    albumName: spotifyTrack.album.name,
    releaseDate: spotifyTrack.album.release_date
  };
};