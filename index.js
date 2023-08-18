var vid;
var w, h, tow, toh;
var x, y, tox, toy;
var zoom = .01; //zoom step per mouse tick 
let gameStarted = false;
let song
let zoomCount = 1
let zoomChange = zoom/10
let lowPass, highPass
// Global vars to cache event state
const evCache = [];
let prevDiff = -1;
let textstatus = "nozoom"

function preload() {
    soundFormats('mp3')
    song = loadSound("s/NikoPhilippElenaKat.mp3")
    vid = createVideo(
        ['s/NikoPhilippElenaKath264.mp4'], vidLoad
      )
  }
  

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    w = tow = windowWidth;
    h = toh = windowHeight * 9 / 16;
    x = tox = w / 2;
    y = toy = h / 2;
    initialx = x
    initialy = y
    

}

function draw() {
    background(0);
 if (gameStarted){

       //tween/smooth motion
  x = lerp(x, tox, .1);
  y = lerp(y, toy, .1);
  w = lerp(w, tow, .1); 
  h = lerp(h, toh, .1);


  image(vid, x-w/2, y-h/2, w, h);
  vid.speed(zoomCount)
  song.rate(zoomCount)
  console.log(x - initialx)
  textSize(64);
  text(textstatus, 160, 160);

  // if ((x - initialx) < 0){
  //   let hpf = 20 + -8*(x - initialx)
  //   hpf = constrain(hpf, 120, 13000)
  //   highPass.freq(hpf)
  //   // console.log(hpf)
  //   lowPass.freq(13000)
  // }
  // else {
  //   highPass.freq(120)
  //   let lpf = 5000 - 8*(x - initialx)
  //   lpf = constrain(lpf, 120, 13000)
  //   lowPass.freq(lpf)
  //   // console.log(lpf)
  // }
}
}
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  function vidLoad() {
    vid.hide()
    button = createButton("Start performance");
    button.position(windowWidth/2, windowWidth/2);
    button.mousePressed(() => {
        button.remove(); 
                            gameStarted = true; 
                            document.body.setAttribute("style","-ms-touch-action: none;")
                            document.body.style.pointerEvents = "none";
                            vid.loop(1); 
                            vid.volume(0)
                            lowPass = new p5.LowPass();
                            highPass = new p5.HighPass();
                            song.connect(lowPass)
                            song.connect(highPass)
                            song.play()

                        })
    // vid.loop();
    // vid.volume(0);
    
  }

  function mouseDragged() {
    tox += mouseX-pmouseX;
    toy += mouseY-pmouseY;
  }
  
  function mouseWheel(event) {
    var e = -event.delta;
  
    if (e>0) { //zoom in
      for (var i=0; i<e; i++) {
        if (tow>30*width) return; //max zoom
        tox -= zoom * (mouseX - tox);
        toy -= zoom * (mouseY - toy);
        tow *= zoom+1;
        toh *= zoom+1;
        zoomCount -= zoomChange
      }
    }
    
    if (e<0) { //zoom out
      for (var i=0; i<-e; i++) {
        if (tow<width) return; //min zoom
        tox += zoom/(zoom+1) * (mouseX - tox); 
        toy += zoom/(zoom+1) * (mouseY - toy);
        toh /= zoom+1;
        tow /= zoom+1;
        zoomCount += zoomChange
      }
    }

    return false
  }

  // deal with pointer

  function initmouse() {
    // Install event handlers for the pointer target
    const el = document.body;
    el.onpointerdown = pointerdownHandler;
    el.onpointermove = pointermoveHandler;
  
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.onpointerup = pointerupHandler;
    el.onpointercancel = pointerupHandler;
    el.onpointerout = pointerupHandler;
    el.onpointerleave = pointerupHandler;
  }  

  function pointermoveHandler(ev) {
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    log("pointerMove", ev);
    ev.target.style.border = "dashed";
  
    // Find this event in the cache and update its record with this event
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    evCache[index] = ev;
  
    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Calculate the distance between the two pointers
      const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
  
      if (prevDiff > 0) {
        if (curDiff > prevDiff) {
          // The distance between the two pointers has increased
          tox -= zoom * (mouseX - tox);
          toy -= zoom * (mouseY - toy);
          tow *= zoom+1;
          toh *= zoom+1;
          zoomCount -= zoomChange
          textstatus = "zoom-in"

        }
        if (curDiff < prevDiff) {
          // The distance between the two pointers has decreased
          tox += zoom/(zoom+1) * (mouseX - tox); 
          toy += zoom/(zoom+1) * (mouseY - toy);
          toh /= zoom+1;
          tow /= zoom+1;
          zoomCount += zoomChange
          textstatus = "zoom-out"

        }
      }
  
      // Cache the distance for the next move event
      prevDiff = curDiff;
    }
  }

  function pointerdownHandler(ev) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
    log("pointerDown", ev);
  }
  

  function pointerupHandler(ev) {
    log(ev.type, ev);
    // Remove this pointer from the cache and reset the target's
    // background and border
    removeEvent(ev);
    ev.target.style.background = "white";
    ev.target.style.border = "1px solid black";
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
    }
  }
  
  function removeEvent(ev) {
    // Remove this event from the target's cache
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    evCache.splice(index, 1);
  }

  // Log events flag
let logEvents = false;

// Logging/debugging functions
function enableLog(ev) {
  logEvents = !logEvents;
}

function log(prefix, ev) {
  if (!logEvents) return;
  const o = document.getElementsByTagName("output")[0];
  const s =
    `${prefix}:<br>` +
    `  pointerID   = ${ev.pointerId}<br>` +
    `  pointerType = ${ev.pointerType}<br>` +
    `  isPrimary   = ${ev.isPrimary}`;
  o.innerHTML += `${s}<br>`;
}

function clearLog(event) {
  const o = document.getElementsByTagName("output")[0];
  o.innerHTML = "";
}
  