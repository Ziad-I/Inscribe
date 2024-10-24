mod commands;
mod models;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::read_directory,
            commands::create_directory,
            commands::remove_directory,
            commands::read_file,
            commands::create_file,
            commands::remove_file,
            commands::write_file,
            commands::rename
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
