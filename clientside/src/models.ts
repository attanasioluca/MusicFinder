// ===== Spotify Models =====
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyData {
  user: SpotifyUser | null;
  tracks: SpotifyTrack[] | null;
  loading: boolean;
  error: string | null;
}

export interface SpotifyArtist {
    id: string;
    name: string;
    href: string;
    uri: string;
    external_urls: {
      spotify: string;
    };
  }
  
  export interface SpotifyImage {
    height: number;
    width: number;
    url: string;
  }
  
  export interface SpotifyAlbum {
    id: string;
    name: string;
    album_type: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    href: string;
    uri: string;
    external_urls: {
      spotify: string;
    };
    images: SpotifyImage[];
    artists: SpotifyArtist[];
  }
  
  export interface SpotifyExternalIds {
    isrc?: string;
  }
  
  export interface SpotifyTrack {
    id: string;
    name: string;
    href: string;
    uri: string;
    duration_ms: number;
    explicit: boolean;
    popularity: number;
    track_number: number;
    disc_number: number;
    is_playable: boolean;
    preview_url: string | null;
    is_local: boolean;
    type: "track";
    external_urls: {
      spotify: string;
    };
    external_ids: SpotifyExternalIds;
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
  }
  