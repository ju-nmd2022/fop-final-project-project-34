let scale = window.innerHeight / 800;

let scaledWidth = 600 * scale;

if (scaledWidth > window.innerWidth) scale = window.innerWidth / scaledWidth;

document.querySelector("#gameWindow").style.transform = "scale(" + scale + ")";
