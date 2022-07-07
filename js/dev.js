function init_dev() {
    let sections = document.getElementsByClassName("section");

    for (const section of sections) {
        //so clicking works
        section.classList.add("down");

        //add title and toggle character
        let title_row = document.createElement("div");
        title_row.classList.add("row", "section-title");
        let title = document.createElement("div");
        title.classList.add("col");
        title.textContent = section.title ? section.title : "";
        title_row.appendChild(title);
        section.insertBefore(title_row, section.firstChild);

        let toggle_char = document.createElement("div");
        toggle_char.classList.add("col-auto", "arrow");
        toggle_char.textContent = "V";
        title_row.appendChild(toggle_char);
        title_row.addEventListener("click", (event) => 
        {
            toggleSection(section);
        }, false);

        for (const child of section.children) {
            if (!child.classList.contains("section-title")) {
                child.style.display = "none";
            }
        }

    }
}

/*
    Toggles section content as well as up and down arrow
    @params:
*/
function toggleSection(section) {
    //has down arrow (default state)
    let down = section.classList.contains("down");
    let arrow_elem = section.getElementsByClassName("arrow")[0];

    if (down) {
        section.classList.remove("down");
        section.classList.add("up");
        arrow_elem.style.transform = 'rotate(180deg)';

        for (const elem of section.children) {
            if (!elem.classList.contains("section-title")) {
                elem.style.display = "";
            }
        }
    } else {
        section.classList.remove("up");
        section.classList.add("down");
        arrow_elem.style.transform = 'rotate(0deg)';
        for (const elem of section.children) {
            if (!elem.classList.contains("section-title")) {
                elem.style.display = "none";
            }
        }
    }
    
}

init_dev();
