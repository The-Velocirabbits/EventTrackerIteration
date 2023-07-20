import React, { useState, useEffect, useContext } from 'react';
import { ValuesContext } from '../pages/Contexts';
import { v4 as uuidv4 } from 'uuid';


export default function WebPlayback() {
    const { globalValues } = useContext(ValuesContext);
    const { access_token } = globalValues;
    const [load, setLoad] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [device_id, setDevice_Id] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(null);
    const [songs, setSongs] = useState([]);
    const [artistForm, setArtistForm] = useState('');

    if (!load) setLoad(true);
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        const box = document.getElementById('webplay');
        box.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(access_token); },
                volume: 0.14
            });
            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                setDevice_Id(device_id);
                console.log('Ready with Device ID', device_id);
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', (state => {
                if (!state) {
                    return;
                }
                console.log(state.track_window.current_track, current_track);
                // if (state.track_window.current_track && state.track_window.current_track.id !== current_track.id) {
                //     console.log(state.track_window.current_track.id, current_track.id);
                //     setTrack(state.track_window.current_track);
                // }
                setTrack(state.track_window.current_track);
                console.log('STATE')
                console.log(state);
                setPaused(state.paused);
                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });
            }));
            player.connect();
        };

    }, [load]);

    useEffect(() => {
        activatePlayer();
    }, [device_id])

    async function queue(songId) {
        try {
            const url = `https://api.spotify.com/v1/me/player/play`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${access_token}` },
                body: JSON.stringify({
                    uris: [`spotify:track:${songId}`]
                })
            });
            // const result = await response.json();
        }
        catch (err) { console.log(err) }
    }
    async function activatePlayer() {
        try {
            const url = `https://api.spotify.com/v1/me/player`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${access_token}` },
                body: JSON.stringify({
                    device_ids: [device_id]
                })
            });
            // const result = await response.json();
        }
        catch (err) { console.log(err) }
    }
    async function artistSongs(artist) {
        let artistId = undefined;
        let songArr = [];
        try {
            const url = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${access_token}` },
            });
            const result = await response.json();
            // console.log(result.artists.items[0].id);
            artistId = result.artists.items[0].id;
        }
        catch (err) { console.log(err) }
        if (artistId) {
            try {
                const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${access_token}` },
                });
                const result = await response.json();
                // console.log(result);
                songArr = result.tracks;
                setSongs(songArr);
            }
            catch (err) { console.log(err) }
        }
    }
    const SongList = () => {
        return (
            <div>{
                songs.map((el) => (
                    <button className="btn-spotify" key={uuidv4()} onClick={() => { queue(el.id) }}>{el.name}</button>
                ))
            }</div>
        )
    }
    const currentTrackView = () => {
        return (
            <><div><img src={current_track.album.images[0].url} className="now-playing__cover" alt="Image Loading..." /></div>
                <div className='buttonBar'>
                    <button className="webButton" onClick={() => { player.previousTrack(); }}>&lt;&lt;</button>
                    <button className="webButton" onClick={() => { player.togglePlay(); }}>{is_paused ? "PLAY" : "PAUSE"}</button>
                    <button className="webButton" onClick={() => { player.nextTrack(); }}>&gt;&gt;</button>
                </div>
                <div className="now-playing__side">
                    <div className="now-playing__name">{current_track.name}</div>
                    <div className="now-playing__artist">{current_track.artists[0].name}</div>
                </div></>
        )
    }
    // console.log('track: ', current_track)
    return (
        <>
            <h3>Sample Music</h3>
            <div className='displayBoxes'>
                <div className="artistShows webBox">
                    <div className="container">
                        {current_track ? currentTrackView() : <div></div>}
                        <div className="main-wrapper">
                        </div>
                        <input placeholder='Enter Artist' onChange={(e) => { setArtistForm(e.target.value) }}></input>
                        <button onClick={() => { artistSongs(artistForm) }}>submit</button>
                        {songs ? <SongList /> : <div></div>}
                    </div>
                </div>
            </div>
        </>
    )

}