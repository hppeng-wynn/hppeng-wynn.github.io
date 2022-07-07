function setTitle() {
    let text = "ATLAS???";
    document.getElementById("header").classList.add("funnynumber");
    document.getElementById("header").classList.add("title");
    document.getElementById("header").textContent = text;
}

setTitle();
const flavortexts = [
    "JALA?? \n ATLAS?? \n ANYONE??", 
    "this really do be a bruh moment.", 
    "OH, LOOK AT YOU. YOU FOUND THE FUNNY BUILDER GUILDER MEME PAGE. AREN'T YOU PROUD OF YOURSELF?", 
    "Downloading Atlas Inc Virus 2.0...",
    "Any WynnBuilders in the chat?",
    ":sunglaso:",    
    "This says a lot about our society.",
    "WynnCraft is overrated. Stay on this page forever!",
    "Now trading Smash invite letters for Atlas Inc invites!",
    "You have reached the customer support page of Wynnbuilder. Please call [REDACTED] to get your problems solved!",
    "Mom, what does 'hppeng' mean?",
    "hpgbegg",
    "|  |I  ||  |_",
    "Wynn was so good they made Wynn 2",
    "Join Monumenta today!",
    "do NOT look up the 25th largest island of Greece",
    "whatever you do, don't search for lego piece 26047.",
    "guys what does perbromic acid look like",
    "Hello Chat",
    "Goodbye Chat",
    "Look up. Now look down. Now look up again. Spin your head 3 times clockwise. You look real silly.",
    "There\'s \'guillble\' written on the ceiling",
    "when the pretender is conspicuous...", 
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"];
const dt = 10; //millis
const PIX_PER_SEC = 1337;
const EPSILON = 1E-7 * dt; 
let atli = [];


function atlasClick() {
    let atlas = document.createElement("div");
    let atlas_img = document.createElement("img");
    atlas.style.maxWidth = "64px";
    atlas.style.maxHeight = "64px";
    atlas_img.src = "../atlas/favicon.png";
    atlas_img.style.width = "100%";
    atlas_img.style.height = "100%";
    atlas_img.style.maxWidth = "64px";
    atlas_img.style.maxHeight = "64px";
    atlas_img.style.zIndex = 1;
    atlas.classList.add("atlas");
    let roll = Math.random();
    let rollchance = 0.0069;
    let rollList = ["lmoa","doom","agony","enraged","sunglaso","thonk","unglaso"];
    for (let i = rollList.length-1; i > -1; i--) {
        if (roll < (i+1) * rollchance) {
            atlas_img.src = "../media/memes/" + rollList[i] + ".png";
        }
    }
    atlas.appendChild(atlas_img);
    atlas.style = "background-image: radial-gradient(closest-side, #" + Math.round(255*Math.random()).toString(16)+Math.round(255*Math.random()).toString(16)+Math.round(255*Math.random()).toString(16) + " 0%," + "#121516 120%);";
    
    atlas.style.position = "absolute";
    rect = document.getElementById("bodydiv").getBoundingClientRect(); //use rect.top, rect.left, rect.bottom, and rect.top
    console.log(rect)

    atlasrect = atlas.getBoundingClientRect();
    atlas.style.left = Math.floor((rect.right - rect.left - 2*(atlasrect.right - atlasrect.left) ) * Math.random() + rect.left + (atlasrect.right - atlasrect.left) )+ "px";
    atlas.style.top = Math.floor((rect.bottom - rect.top - 2*(atlasrect.bottom - atlasrect.top) ) * Math.random() + rect.top + (atlasrect.bottom - atlasrect.top) ) + "px";
    //atlas.style.border = "3px solid white";

    atlas.vx = (dt / 1000 * PIX_PER_SEC * Math.random()) - (dt / 2000 * PIX_PER_SEC);
    atlas.vy = (dt / 1000 * PIX_PER_SEC * Math.random()) - (dt / 2000 * PIX_PER_SEC);

    let temp = 2*Math.random()-1;
    let sign = Math.round(temp/Math.abs(temp));
    atlas.wx = sign*(150 + 60*Math.random())/dt;//using w for omega
    atlas.theta = Math.random()*360;

    atli.push(atlas);

    document.getElementById("bodydiv").appendChild(atlas);
    document.getElementById("flavortext").textContent = flavortexts[Math.floor(flavortexts.length*Math.random())];
}

function runAtlas() {
    let rect = document.getElementById("bodydiv").getBoundingClientRect(); //use rect.top, rect.left, rect.bottom, and rect.top
    
    //bounce off the walls - average slight damping
    for (const atlas of atli) {
        let atlasrect = atlas.getBoundingClientRect();
        if(atlasrect.left + atlas.vx < rect.left || atlasrect.right + atlas.vx > rect.right) {
            atlas.vx *= -1 + (.01 * Math.random() - .004)*dt;
            if(Math.abs(atlas.vx) < EPSILON) {
                atlas.vx += (.001 * Math.random() - .0005)*dt;
            }
        }
        if(atlasrect.top + atlas.vy < rect.top || atlasrect.bottom + atlas.vy > rect.bottom) {
            atlas.vy *= -1 + (.01 * Math.random() - .004)*dt;
            if(Math.abs(atlas.vy) < EPSILON) {
                atlas.vy += (.001 * Math.random() - .0005)*dt;
            }
        }   
    }
    
    for(let i = 0; i < atli.length; i++) {
        for(let j = 0; j < atli.length; j++) {
            if(i != j) {
                let temp;
                let atlas1 = atli[i];
                let atlas2 = atli[j];
                let rect1 = atlas1.getBoundingClientRect(); //The bounding rects of both divs. 
                let rect2 = atlas2.getBoundingClientRect();
                let at1 = [(rect1.left+rect1.right)/2, (rect1.top+rect1.bottom)/2]; //The center x,y coords of both divs
                let at2 = [(rect2.left+rect2.right)/2, (rect2.top+rect2.bottom)/2];
                let r = (rect2.bottom - rect2.top)/2; //The radius of the incircle of a div. 
                let dx = at2[0] - at1[0];
                let dy = at2[1] - at1[1];
                let center = [(at1[0]+at2[0])/2, (at1[1]+at2[1])/2 ];

                if (Math.sqrt(((at2[1]+atlas2.vy) - (at1[1]+atlas1.vy))**2 + ((at2[0]+atlas2.vx) - (at1[0]+atlas1.vx))**2) < 2*r) {
                    //Play bruh sound effect
                    document.getElementById('bruh_sound_effect').play();
                    document.getElementById('bruh_sound_effect').currentTime = 0;
                   
                    if(Math.sqrt( (at2[1]-at1[1])**2 + (at2[0]-at1[0])**2 ) < 2*r ) {//check for collision
                        //Move both away slightly - correct alg this time :)
                        atlas1.style.left = parseFloat(atlas1.style.left.replace("px","")) + (at1[0]-center[0]) * 2 * r / Math.sqrt(dx**2 + dy**2) + "px";
                        atlas1.style.top = parseFloat(atlas1.style.top.replace("px","")) + (at1[1]-center[1]) * 2 * r / Math.sqrt(dx**2 + dy**2) + "px";
                        atlas2.style.left = parseFloat(atlas2.style.left.replace("px","")) + (at2[0]-center[0]) * 2 * r / Math.sqrt(dx**2 + dy**2) + "px";
                        atlas2.style.top = parseFloat(atlas2.style.top.replace("px","")) + (at2[1]-center[1]) * 2 * r / Math.sqrt(dx**2 + dy**2) + "px";
                    }
                    //Do conservation of momentum with an elastic collision. Masses are equal.
                    temp = atlas1.vy;
                    atlas1.vy = atlas2.vy;
                    atlas2.vy = temp;
                    temp = atlas1.vx;
                    atlas1.vx = atlas2.vx;
                    atlas2.vx = temp;
                }
            }
        }
    }


    for(const atlas of atli) {
        //move the atlas
        atlas.style.left = parseFloat(atlas.style.left.replace("px",""))+atlas.vx+"px";
        atlas.style.top = parseFloat(atlas.style.top.replace("px",""))+atlas.vy+"px"; 

        //rotate the atlas - this is causing trouble with teleporting atli; probably has to do with messing with the corners of the bounding rects.
        atlas.childNodes[0].style.transform = 'rotate(' + (atlas.theta)%360 + 'deg)';
        atlas.theta = (atlas.theta+atlas.wx/dt)%360

        //make sure the atlas is in bounds!!
        let atlasrect = atlas.getBoundingClientRect();
        if(atlasrect.right > rect.right || atlasrect.left < rect.left || atlasrect.top < rect.top || atlasrect.bottom > rect.bottom) {
            atlas.style.left = Math.floor((rect.right - rect.left - 2*(atlasrect.right - atlasrect.left) ) * Math.random() + rect.left + (atlasrect.right - atlasrect.left) )+ "px";
            atlas.style.top = Math.floor((rect.bottom - rect.top - 2*(atlasrect.bottom - atlasrect.top) ) * Math.random() + rect.top + (atlasrect.bottom - atlasrect.top) ) + "px";
        }
    }

}

setInterval(runAtlas, dt);