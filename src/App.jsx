import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import SpotifyCallback from './pages/SpotifyCallback.jsx';
import Home from './pages/Home.jsx';
import Playlist from './pages/Playlist.jsx';
import Library from './pages/Library.jsx';
import Search from './pages/Search.jsx';
import CreatePlaylist from './pages/CreatePlaylist.jsx';
import LikedSongs from './pages/LikedSongs.jsx';
import Episodes from './pages/Episodes.jsx';
import Artist from './pages/Artist.jsx';
import Album from './pages/Album.jsx';
import Show from './pages/Show.jsx';

import MobileHome from './pages/MobileHome.jsx';
import MobileSearch from './pages/MobileSearch.jsx';
import MobileLibrary from './pages/MobileLibrary.jsx';
import MobileCreate from './pages/MobileCreate.jsx';
import MobilePlaylist from './pages/MobilePlaylist.jsx';
import MobileNowPlaying from './pages/MobileNowPlaying.jsx';
import DeviceLab from './pages/DeviceLab.jsx';

import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MobileShell from './components/MobileShell.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<SpotifyCallback />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
        <Route path="create-playlist" element={<CreatePlaylist />} />
        <Route path="liked-songs" element={<LikedSongs />} />
        <Route path="episodes" element={<Episodes />} />
        <Route path="playlist/:id" element={<Playlist />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="show/:id" element={<Show />} />
      </Route>

      <Route
        path="/mobile"
        element={
          <ProtectedRoute>
            <MobileShell />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<MobileHome />} />
        <Route path="search" element={<MobileSearch />} />
        <Route path="library" element={<MobileLibrary />} />
        <Route path="create" element={<MobileCreate />} />
        <Route path="playlist/:id" element={<MobilePlaylist />} />
        <Route path="now-playing" element={<MobileNowPlaying />} />
      </Route>

      <Route
        path="/device-lab"
        element={
          <ProtectedRoute>
            <DeviceLab />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;