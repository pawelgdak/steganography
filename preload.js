const remote = require('electron').remote;
const dialog = remote.dialog;
const app = remote.app;
const fs = require('fs');
const path = require("path");
const helpers = require("./helpers");
const Jimp = require("jimp");

let imageSet = false;
let imageModifiedSet = false;
let unsavedImage = false;

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

  // Decoding process
  document.getElementById("decode").onclick = async () => {

    let imageElement = document.getElementById("original-photo");
    let imagePath = imageElement.src.split("file:///")[1];

    if(!imageSet) {
      alert("Image has not been set.");
      return;
    }

    if(!confirm("Are you sure you want to decode the text?")) {
      return;
    }

    let image = await Jimp.read(imagePath);
    let string = "";
    let endingZeros = 0;

    let r, g, b, rBinary, gBinary, bBinary;
    let rNumberOfBits = document.getElementById("bit_R").value;
    let gNumberOfBits = document.getElementById("bit_G").value;
    let bNumberOfBits = document.getElementById("bit_B").value;

    for(let x = 0; x < image.bitmap.data.length; x+=4) {

      if(endingZeros == 8) break;

      r = image.bitmap.data[x];
      g = image.bitmap.data[x + 1];
      b = image.bitmap.data[x + 2];

      // RGB manipulation
      rBinary = helpers.decToBits(r);
      gBinary = helpers.decToBits(g);
      bBinary = helpers.decToBits(b);

      // Red channel decoding
      for(let rIterator = 7; rIterator > 7 - rNumberOfBits; rIterator--) {

        if(endingZeros == 8) break;

        if(parseInt(rBinary[rIterator]) == 0) {
          endingZeros++;
        } else endingZeros = 0;

        string += rBinary[rIterator];

      }

      // Green channel decoding
      for(let gIterator = 7; gIterator > 7 - gNumberOfBits; gIterator--) {

        if(endingZeros == 8) break;

        if(parseInt(gBinary[gIterator]) == 0) {
          endingZeros++;
        } else endingZeros = 0;

        string += gBinary[gIterator];

      }

      // Blue channel decoding
      for(let bIterator = 7; bIterator > 7 - bNumberOfBits; bIterator--) {

        if(endingZeros == 8) break;

        if(parseInt(bBinary[bIterator]) == 0) {
          endingZeros++;
        } else endingZeros = 0;

        string += bBinary[bIterator];

      }

    }

    if(endingZeros != 8) {
      alert("Image has no encoded text");
    } else {
      document.getElementById("text").value = helpers.chainOfBitsToString(string);
    }

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

    if(unsavedImage) {
      if(!confirm("You have unsaved image. Do you want to continue?")) return;
    }

    let tempImagePath = `${tempPath}\\steganography-temp-image`;

    try {
      await fs.copyFileSync(imagePath, tempImagePath);
    } catch(err) {
      console.error(err);
    }

    // Steganography encoding part
    let image = await Jimp.read(tempImagePath);
    let text = document.getElementById("text").value;
    let textInBinary = helpers.stringToChainOfBits(text);
    let textIterator = 0;

    let r, g, b, rBinary, gBinary, bBinary;
    let rNumberOfBits = document.getElementById("bit_R").value;
    let gNumberOfBits = document.getElementById("bit_G").value;
    let bNumberOfBits = document.getElementById("bit_B").value;

    for(let x = 0; x < image.bitmap.data.length; x+=4) {

      if(textIterator == textInBinary.length - 1) {
        break;
      }

      r = image.bitmap.data[x];
      g = image.bitmap.data[x + 1];
      b = image.bitmap.data[x + 2];

      // RGB manipulation

      rBinary = helpers.decToBits(r);
      gBinary = helpers.decToBits(g);
      bBinary = helpers.decToBits(b);

      // Red channel encoding
      for(let rIterator = 7; rIterator > 7 - rNumberOfBits; rIterator--) {

        if(textIterator == textInBinary.length - 1) {
          break;
        }

        rBinary = helpers.replaceStringCharacter(rBinary, rIterator, textInBinary[textIterator]);
        textIterator++;

      }

      // Green channel encoding
      for(let gIterator = 7; gIterator > 7 - gNumberOfBits; gIterator--) {

        if(textIterator == textInBinary.length - 1) {
          break;
        }

        gBinary = helpers.replaceStringCharacter(gBinary, gIterator, textInBinary[textIterator]);
        textIterator++;

      }

      // Blue channel encoding
      for(let bIterator = 7; bIterator > 7 - bNumberOfBits; bIterator--) {

        if(textIterator == textInBinary.length - 1) {
          break;
        }

        bBinary = helpers.replaceStringCharacter(bBinary, bIterator, textInBinary[textIterator]);
        textIterator++;

      }

      r = parseInt(rBinary, 2);
      g = parseInt(gBinary, 2);
      b = parseInt(bBinary, 2);

      image.bitmap.data[x] = r;
      image.bitmap.data[x + 1] = g;
      image.bitmap.data[x + 2] = b;

    }

    await image.writeAsync(tempImagePath);

    let modifiedImageElement = document.getElementById("modified-photo");
    modifiedImageElement.src = tempImagePath;
    imageModifiedSet = true;
    unsavedImage = true;

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
        unsavedImage = false;

      } catch(err) {
        console.error(err);
      }

    }
  })
}