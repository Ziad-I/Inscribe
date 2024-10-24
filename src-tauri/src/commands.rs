use crate::models::{Error, FileInfo};

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn read_directory(path: &str) -> Result<Vec<FileInfo>, Error> {
    let entries = std::fs::read_dir(path)?;
    let mut file_info_vec = Vec::new();

    for entry in entries {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let file_name = entry.file_name().to_string_lossy().to_string();
        let file_path = entry.path().to_string_lossy().to_string();

        let kind = if file_type.is_dir() {
            "directory"
        } else {
            "file"
        };

        let file_info = FileInfo {
            name: file_name,
            kind: kind.to_string(),
            path: file_path,
        };

        file_info_vec.push(file_info);
    }

    file_info_vec.sort_by(|a, b| a.kind.cmp(&b.kind));
    Ok(file_info_vec)
}
