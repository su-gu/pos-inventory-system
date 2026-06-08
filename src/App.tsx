import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/components/ui/button';
import { cloudHealthcheck } from '@/lib/supabase';
import './App.css';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const [cloudStatus, setCloudStatus] = useState('');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('greet', { name }));
  }

  async function checkDb() {
    try {
      const res = await invoke<{ path: string; rows: number }>('db_healthcheck');
      setDbStatus(`SQLite OK — ${res.rows} row(s) at ${res.path}`);
    } catch (e) {
      setDbStatus(`SQLite error: ${String(e)}`);
    }
  }

  async function checkCloud() {
    try {
      const ok = await cloudHealthcheck();
      setCloudStatus(ok ? 'Cloud OK' : 'Cloud unreachable (check .env.local)');
    } catch (e) {
      setCloudStatus(`Cloud error: ${String(e)}`);
    }
  }

  return (
    <main className="container">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit">Greet</Button>
      </form>
      <p>{greetMsg}</p>

      <div className="row">
        <Button type="button" onClick={checkDb}>
          Check SQLite
        </Button>
        <Button type="button" onClick={checkCloud}>
          Check Cloud
        </Button>
      </div>
      <p>{dbStatus}</p>
      <p>{cloudStatus}</p>
    </main>
  );
}

export default App;
