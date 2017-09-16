extern crate serde;
extern crate serde_json;

#[macro_use]
extern crate serde_derive;

use std::env;
use std::process;
use std::process::{Command, Stdio};
use std::error::Error;
use std::io::{self, BufRead};
use std::io::prelude::*;
use std::fs::File;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct Message {
    cookies: String,
    text: String,
    version: String
}

#[derive(Serialize, Deserialize)]
struct ReturnMessage {
    stdout: String,
    code: i64,
    version: String
}

fn write_cookies(mut cookies: String) -> PathBuf {
    let mut path = PathBuf::new();

    path.push(env::temp_dir());
    path.push("cookies.txt");

    {
        let display = path.display();

        let mut file = match File::create(&path) {
            Ok(file) => file,
            Err(err) => panic!("Unable to create {}: {}", display, err.description()),
        };

        cookies.push_str("\n");

        match file.write_all(cookies.as_bytes()) {
            Ok(_) => println!("Wrote the cookies file to {}", display),
            Err(err) => panic!("Unable to write to {}: {}", display, err.description())
        }
    }

    return path
}

fn get_code_from_line(line: String) -> i64 {
    return if
        line.contains("ERROR: Unsupported URL") ||
        line.contains("No protocol handler found to open URL") ||
        line.contains("No such file or directory") {
        1
    } else if line.contains("youtube-dl failed") {
        2
    } else {
        0
    };
}

fn send_return_message(stdout: String, code: i64, exit: i32) {
    let return_msg = ReturnMessage {
        stdout: stdout,
        code: code,
        version: env!("CARGO_PKG_VERSION").to_string(),
    };

    match serde_json::to_string(&return_msg) {
        Ok(json) => println!("{}", json),
        Err(err) => panic!("Unable to convert json: {}", err)
    }

    process::exit(exit);
}

fn main() {
    let version = env!("CARGO_PKG_VERSION").to_string();

    let input = io::stdin();
    let handle = input.lock();

    let mut lines = Vec::new();

    for line in handle.lines() {
        match line {
            Ok(line) => lines.push(line.to_string()),
            Err(err) => panic!("IO error: {}", err),
        }
    }

    let joined_lines = lines.join("\n");

    let msg: Message = match serde_json::from_str(&joined_lines) {
        Ok(json) => json,
        Err(err) => {
            eprintln!("Invalid JSON provided: {}", err);
            process::exit(1);
        },
    };

    eprintln!("test");

    if msg.version != version {
        send_return_message("Outdated version.".to_string(), 3, 0);
    }

    let cookies_path = write_cookies(msg.cookies.clone()).to_string_lossy().into_owned();

    let mpv = match Command::new("mpv")
        .arg("--msg-level=all=info")
        .arg("--cookies")
        .arg("--cookies-path=".to_owned() + cookies_path.as_str())
        .arg("--ytdl-raw-options=cookies=".to_owned() + cookies_path.as_str())
        .arg(msg.text.clone())
        .stdout(Stdio::piped())
        .spawn() {
        Ok(mpv) => mpv,
        Err(err) => panic!("Couldn't spawn mpv: {}", err.description()),
    };

    let mut line = String::new();

    match mpv.stdout.unwrap().read_to_string(&mut line) {
        Ok(_) => {
            send_return_message(line.clone(), get_code_from_line(line.clone()), 0);
        },
        Err(err) => panic!("Unable to read mpv stdout: {}", err.description()),
    }
}
