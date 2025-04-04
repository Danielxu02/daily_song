import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import SongSearch from './components/SongSearch';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [songEntries, setSongEntries] = useState({});
  
  // Load saved songs from localStorage on initial load
  useEffect(() => {
    const savedEntries = localStorage.getItem('songEntries');
    if (savedEntries) {
      setSongEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('songEntries', JSON.stringify(songEntries));
  }, [songEntries]);
  
  const addSongForDate = (date, song) => {
    const dateStr = date.toISOString().split('T')[0];
    setSongEntries(prev => ({
      ...prev,
      [dateStr]: song
    }));
  };
  
  const getSongForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return songEntries[dateStr];
  };
  
  return (
    <div className="app">
      <header>
        <h1>Daily Song Tracker</h1>
      </header>
      <main>
        <div className="calendar-container">
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            songEntries={songEntries}
          />
        </div>
        <div className="song-selection">
          <h2>Select Song for {selectedDate.toLocaleDateString()}</h2>
          {getSongForDate(selectedDate) && (
            <div className="current-song">
              <h3>Current selection:</h3>
              <div className="song-card">
                <img src={getSongForDate(selectedDate).albumArt} alt="Album Art" />
                <div>
                  <strong>{getSongForDate(selectedDate).title}</strong>
                  <p>{getSongForDate(selectedDate).artist}</p>
                </div>
              </div>
            </div>
          )}
          <SongSearch onSongSelect={(song) => addSongForDate(selectedDate, song)} />
        </div>
      </main>
    </div>
  );
}

export default App;