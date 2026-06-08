use std::fs;

use serde::Serialize;
use tauri::{AppHandle, Manager};

#[derive(Serialize)]
pub struct DbHealth {
    pub path: String,
    pub rows: i64,
}

/// Opens (creating if needed) the local SQLite database in the app data dir,
/// writes one healthcheck row, and returns the file path + total row count.
///
/// Proves the Rust -> rusqlite -> on-disk SQLite path works end to end
/// (Week 1 verification gate, item 5). This is a throwaway probe — the real
/// schema + migration runner lands in Week 2.
#[tauri::command]
pub fn db_healthcheck(app: AppHandle) -> Result<DbHealth, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let db_path = dir.join("pos-dev.sqlite");

    let conn = rusqlite::Connection::open(&db_path).map_err(|e| e.to_string())?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS healthcheck (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );",
    )
    .map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO healthcheck DEFAULT VALUES;", [])
        .map_err(|e| e.to_string())?;
    let rows: i64 = conn
        .query_row("SELECT COUNT(*) FROM healthcheck;", [], |r| r.get(0))
        .map_err(|e| e.to_string())?;

    Ok(DbHealth {
        path: db_path.to_string_lossy().to_string(),
        rows,
    })
}
