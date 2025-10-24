import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    spotifyId: { type: String, unique: true, required: true },
    display_name: String,
    email: String,
    profileUrl: String,
    images: [String],
    followers: Number,
    country: String,
    product: String,
    lastLogin: Date,
});

const trackSchema = new mongoose.Schema({
    spotifyId: { type: String, unique: true, required: true },
    name: String,
    albumName: String,
    artistNames: [String],
    albumArt: String,
    popularity: Number,
    duration_ms: Number,
    explicit: Boolean,
    externalUrl: String,
    // 👇 Custom user-controlled fields
    liked: { type: Boolean, default: false },
    playCount: { type: Number, default: 0 },
    lastPlayed: { type: Date, default: null },
});

const genreSchema = new mongoose.Schema({
    genre_code: String,
    genre_name: String,
    similar_genres_codes: String,
    sub_genres: String,
});
const userTrackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track" },
    liked: { type: Boolean, default: false },
    playCount: { type: Number, default: 0 },
});

const artistSchema = new mongoose.Schema(
    {
        spotifyId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        genres: {
            type: [String],
            default: [],
        },
        followers: {
            type: Number,
            default: 0,
        },
        popularity: {
            type: Number,
            default: 0,
        },
        image: {
            type: String, // typically the first image from Spotify images array
        },
        externalUrl: {
            type: String, // Spotify profile URL
        },
        uri: {
            type: String, // "spotify:artist:XXXX"
        },

        // Optional metadata for caching and analytics
        lastFetched: {
            type: Date,
            default: Date.now,
        },
        cached: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

// === Models ===
export const User = mongoose.model("User", userSchema);
export const Track = mongoose.model("Song", trackSchema);
export const Artist = mongoose.model("Artist", artistSchema);
export const Genre = mongoose.model("Genre", genreSchema);
export const UserTrack = mongoose.model("UserTrack", userTrackSchema);
