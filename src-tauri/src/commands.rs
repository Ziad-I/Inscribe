use crate::models::{Error, FileInfo};
use std::fs;
use std::path::PathBuf;

fn validate_path(path: &str) -> Result<PathBuf, Error> {
    let path_buf = PathBuf::from(path);

    // Check if path exists (for operations that require existing paths)
    if !path_buf.exists() && !path.ends_with('/') {
        return Err(Error::InvalidPath(format!("Path does not exist: {}", path)));
    }

    // Canonicalize path to resolve any '..' or symbolic links
    let canonical = path_buf
        .canonicalize()
        .map_err(|e| Error::InvalidPath(format!("Invalid path '{}': {}", path, e)))?;

    Ok(canonical)
}

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn read_directory(path: &str) -> Result<Vec<FileInfo>, Error> {
    let path = validate_path(path)?;
    let entries = fs::read_dir(&path)?;
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

    file_info_vec.sort_by(|a, b| match (a.kind.as_str(), b.kind.as_str()) {
        ("directory", "file") => std::cmp::Ordering::Less,
        ("file", "directory") => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(file_info_vec)
}

#[tauri::command]
pub async fn create_directory(parent: &str, name: &str) -> Result<(), Error> {
    validate_path(parent)?;
    let path_buf = PathBuf::from(parent).join(name);
    fs::create_dir_all(&path_buf)?;
    Ok(())
}

#[tauri::command]
pub async fn remove_directory(path: &str) -> Result<(), Error> {
    let path = validate_path(path)?;
    fs::remove_dir_all(&path)?;
    Ok(())
}

#[tauri::command]
pub async fn read_file(path: &str) -> Result<String, Error> {
    let path = validate_path(path)?;
    fs::read_to_string(&path).map_err(Error::from)
}

#[tauri::command]
pub async fn create_file(parent: &str, name: &str) -> Result<(), Error> {
    validate_path(parent)?;
    let path_buf = PathBuf::from(parent).join(name);
    fs::File::create(&path_buf)?;
    Ok(())
}

#[tauri::command]
pub async fn remove_file(path: &str) -> Result<(), Error> {
    let path = validate_path(path)?;
    fs::remove_file(&path)?;
    Ok(())
}

#[tauri::command]
pub async fn write_file(path: &str, content: &str) -> Result<(), Error> {
    let path = validate_path(path)?;
    fs::write(&path, content)?;
    Ok(())
}

#[tauri::command]
pub async fn rename(old_path: &str, new_path: &str) -> Result<(), Error> {
    let old_path = validate_path(old_path)?;
    let new_path = PathBuf::from(new_path);

    fs::rename(old_path, new_path)?;
    Ok(())
}
