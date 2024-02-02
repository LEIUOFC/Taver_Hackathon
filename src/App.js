/*import logo from './logo.svg';*/
import "./App.css";
import Input from "./Input.js";
import Map from "./map";
import { useState, useRef, useLayoutEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Grid,Stack } from '@mui/material';
import YourFavoriteSpotifyArtists from "./YourFavoriteSpotifyArtists.js";
import PickDate from "./PickDate.js";
import { concertList } from "./concertList.js"

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function App() {
  let cachedStartDate = localStorage.getItem('startDate');
  let cachedEndDate = localStorage.getItem('endDate');
  const [width, height] = useWindowSize();
  const [concerts, setConcerts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [startDate, setStartDate] = useState(cachedStartDate === null ? new Date() : new Date(cachedStartDate));
  const [endDate, setEndDate] = useState(cachedEndDate === null ? new Date() : new Date(cachedEndDate));
  const [mapStyle, setMapStyle] = useState("1fc21c527f198d4e");
  const childRef = useRef();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBrho3RkNlDaztsqX0paNbBW4Do98758a4", // Add your API key
  });

  const handleChildClick = (artistName) => {
    //send artistName to input component
    console.log(artistName);
    childRef.current.handleRequestFromParent(artistName);
  };
  return (
    <div className="App">
      {width > 700 ? (
        <Grid className="App-header" container spacing={2}>
          <Grid item xs={12} md={6}>
            <PickDate updateStartDateInParent={setStartDate} updateEndDateInParent={setEndDate} />
            <Input setConcerts={setConcerts} setUserLocation={setUserLocation} setMapStyle={setMapStyle} startDate={startDate} endDate={endDate} ref={childRef} />
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={<YourFavoriteSpotifyArtists onChildClick={handleChildClick} startDate={startDate} endDate={endDate}></YourFavoriteSpotifyArtists>}
                />
              </Routes>
            </Router>
          </Grid>
          <Grid item xs={12} md={6}>
            {isLoaded ? <Map concerts={concerts} userLocation={userLocation} mapStyle={mapStyle} /> : null}
          </Grid>
        </Grid>
      ) : (
        <Stack spacing={2}>
          <Grid container item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <PickDate updateStartDateInParent={setStartDate} updateEndDateInParent={setEndDate} />
            <Input setConcerts={setConcerts} setUserLocation={setUserLocation} setMapStyle={setMapStyle} startDate={startDate} endDate={endDate} ref={childRef} />
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={<YourFavoriteSpotifyArtists onChildClick={handleChildClick} startDate={startDate} endDate={endDate}></YourFavoriteSpotifyArtists>}
                />
              </Routes>
              <Routes>
                <Route
                  path="/"
                  element={<concertList onChildClick={handleChildClick} startDate={startDate} endDate={endDate}></concertList>}
                />
              </Routes>
            </Router>
          </Grid>
          <Grid container item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isLoaded ? <Map concerts={concerts} userLocation={userLocation} mapStyle={mapStyle} /> : null}
          </Grid>
        </Stack>
      )}
    </div>
  );
}
export default App;
