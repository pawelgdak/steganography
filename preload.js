const remote = require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = require('fs');
const path = require("path");

let imageSet = false;
let imageModifiedSet = false;

window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 

  // Load image
  document.getElementById("load-image").onclick = () => {
    dialog.showOpenDialog((fileName) => {

      if(fileName.length != 0) {

        let extension = path.extname(fileName[0]);

        let availableExtensions = ['.jpg', '.jpeg', '.png']

        if(!availableExtensions.includes(extension)) {
          alert("Filetype is unsupported. Supported filetypes: jpg, jpeg, png.");
          return;
        }

        let image = document.getElementById("original-photo");
        image.src = fileName[0];

        imageSet = true;

      }

    })
  } 

  // Load text from file
  document.getElementById("load-text-file").onclick = () => {
    dialog.showOpenDialog((fileName) => {

      if(fileName.length != 0) {

        fs.readFile(fileName[0], 'utf-8', (err, data) => {
          if(err) {
            alert(err);
            return;
          }

          let textarea = document.getElementById("text");
          textarea.value = data;

        })

      }

    })
  }

  // Hiding process
  document.getElementById("hide").onclick = async () => {

    let tempPath = app.getPath("temp");
    let imageElement = document.getElementById("original-photo");
    let imagePath = imageElement.src.split("file:///")[1];

    if(!imageSet) {
      alert("Image has not been set.");
      return;
    }

    let tempImagePath = `${tempPath}\\steganography-temp-image`;

    try {
      await fs.copyFileSync(imagePath, tempImagePath);
    } catch(err) {
      console.err(err);
    }

    let image = await fs.readFileSync(tempImagePath);

    // TODO steganography process here

    let modifiedImageElement = document.getElementById("modified-photo");
    modifiedImageElement.src = tempImagePath;
    imageModifiedSet = true;

  }

    // Save modified file
    document.getElementById("save-image").onclick = () => {
      saveModifiedFile();
    }
})

let saveModifiedFile = () => {

  if(!imageModifiedSet) {
    alert("There is nothing to save.");
    return;
  }

  let tempPath = app.getPath("temp");
  let imageElement = document.getElementById("original-photo");
  let imagePath = imageElement.src.split("file:///")[1];
  let tempImagePath = `${tempPath}\\steganography-temp-image`;

  dialog.showSaveDialog({
    title: "Save modified file",
    defaultPath: imagePath.split(path.extname(imagePath))[0] + "-modified" + path.extname(imagePath)
  }, async (fileName) => {
    if(fileName !== undefined) {

      try {

        await fs.copyFileSync(tempImagePath, fileName);

      } catch(err) {
        console.error(err);
      }

    }
  })
}