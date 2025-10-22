import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: Number,
    username: String,
    full_name: String,
    email: String,
    favorite_genre_code: String,
    favorite_artist_code: String,
    playlist_count: Number,
  });
  
const songSchema = new mongoose.Schema({
title: String,
id: String,
artist_code: String,
album_code: String,
cover_link: String,
genre_code: String,
listens_count: Number,
date_published: String,
duration: Number,
rating: Number,
});

const artistSchema = new mongoose.Schema({
artist_code: String,
artist_name: String,
monthly_streams: Number,
genre_code: String,
rating: Number,
});

const genreSchema = new mongoose.Schema({
    genre_code: String,
    genre_name: String,
    similar_genres_codes: String,
    sub_genres: String,
});

// === Models ===
export const User = mongoose.model("User", userSchema);
export const Song = mongoose.model("Song", songSchema);
export const Artist = mongoose.model("Artist", artistSchema);
export const Genre = mongoose.model("Genre", genreSchema);