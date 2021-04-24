// ['Title', ["type of paper","file name"]]
const pdfs = new Map([
    ["Wynncraft Damage Calculation",["mechanics", "Damage_calculation", "hppeng, ferricles, et al.", "A complete guide to Wynncraft's damage calculations. Includes formulas, tested game values, and worked examples."]],
    ["Crafted Weapon Powder Mechanics",["mechanics", "Crafted_Weapon_Powder_Mechanics", "ferricles", "A short guide to the mechanics of powder application on crafted weapons. Includes formulas and a worked example."]],
    
    //[title ,[genre, filename, author(s), abstract/desc]]
]);

const sections = ["mechanics", "documentation", "history"]

function init() {
    initSections();

    for ([title, pdf] of pdfs) {
        let sec = document.getElementById(pdf[0]+"-section");
        if (sec) {
            let pre = document.createElement("pre");
            let firstline = document.createElement("div");
            firstline.style.display = "flex";
            firstline.style.justifyContent = "space-between";

            let titleElem = document.createElement("p");
            titleElem.textContent = title;

            let a = document.createElement("a");
            a.href = "./pdfs/" + pdf[1] + ".pdf";
            a.target = "_blank";
            a.textContent = pdf[1] + ".pdf";
            a.classList.add("link");
            a.style.display = "flex-end";

            let secondline = document.createElement("div");
            secondline.style.dipslay = "flex";
            let ul = document.createElement("ul");
            ul.style.wordBreak = "break-word";
            let li = document.createElement("li");
            let div = document.createElement("div");
            if (pdf[2]) {
                li.textContent = "Author(s): "  + pdf[2];
            } else {
                li.textContent = "Author(s): Unknown";
            }
            ul.appendChild(li);
            li = document.createElement("li");
            div = document.createElement("div");
            if (pdf[3]) {
                div.textContent = "Description: "  + pdf[3];
            } else {
                div.textContent = "Description: None";
            }
            ul.appendChild(li);
            li.appendChild(div);
            pre.appendChild(firstline);
            firstline.appendChild(titleElem);
            firstline.appendChild(a);
            pre.appendChild(secondline);
            secondline.appendChild(ul);

            sec.appendChild(document.createElement("br"));
            sec.appendChild(pre);
        } else {
            console.log("Invalid paper type for " + title + ": " + pdf[0]);
        }
    }
}

function initSections() {
    let main = document.getElementById("main");
    for (const sec of sections) {
        let div = document.createElement("div");
        div.classList.add(["section"]);
        div.id = sec;

        let secspan = document.createElement("span");
        secspan.classList.add("span-flex", "up");
        div.appendChild(secspan);
        let title = document.createElement("h2");
        title.classList.add("indicator-title")
        title.style.margin = "0 0 0";
        title.textContent = "Section: " + sec;
        let indicator = document.createElement("img");
        indicator.classList.add("indicator-img");
        indicator.src = "./media/indicator-down.png";
        secspan.appendChild(title);
        secspan.appendChild(indicator);


        let section = document.createElement("section");
        section.classList.add(["toggle-section"]);
        section.id = sec + "-section";
        section.style.display = "none";
        div.appendChild(section);
        main.appendChild(div);
        
        secspan.addEventListener("click", function(){
            if (secspan.classList.contains("up")) {
                secspan.classList.remove("up");
                secspan.classList.add("down");
                indicator.src = "./media/indicator-up.png";
                section.style.display = "";
            } else {
                secspan.classList.remove("down");
                secspan.classList.add("up");
                indicator.src = "./media/indicator-down.png";
                section.style.display = "none";
            }
        });
        
        
    }
}



init();