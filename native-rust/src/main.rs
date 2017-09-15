extern crate serde_json;

use std::process;
use std::error::Error;
use std::io::{self, BufRead};
use std::io::prelude::*;
use std::fs::File;
use std::path::Path;
use serde_json::{Value, Error as SerdeError};

fn parse_message(msg: String) {
    /*let path = Path::new("out.txt");
    let display = path.display();

    let mut file = match File::create(&path) {
        Ok(file) => file,
        Err(err) => panic!("unable to create {}: {}", display, err.description()),
    };

    match file.write_all(msg.as_bytes()) {
        Ok(_) => println!("wrote to {}", display),
        Err(err) => panic!("unable to write to {}: {}", display, err.description())
    }*/
}

fn main() {
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

    let json: Value = match serde_json::from_str(&joined_lines) {
        Ok(json) => json,
        Err(err) => {
            eprintln!("Invalid JSON provided: {}", err);
            process::exit(1);
        },
    };
}
