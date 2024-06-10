/** Vanilla JS does not allow dynamically fetching files in a local directory. We have to hard code the list to loop over. 
 *  Each entry is the name of a subfolder in /docs/.
 */
const docs_post_names = [
    "items_adv_help",
    "damage_calc",
    "powders"
]

/** Map of 
 * Key: post_name - the subdirectory name also present in docs_post_names
 * Value: [Title, Summary, Author(s)]
 */
docs_post_thumbnails = new Map();
docs_post_thumbnails.set("items_adv_help", ["Advanced Item Search Help", "A practical guide on how to use WynnBuilder's advanced item search feature.", "Phanta"]);
docs_post_thumbnails.set("damage_calc", ["Damage Calculation", "All the ins and outs of Wynncraft damage calculation. Includes spells, powder specials, abilities, and major IDs!", "hppeng, ferricles"]);
docs_post_thumbnails.set("powders", ["Weapon Powder Application", "Read this to learn the mechanics of powder application on weapons!", "ferricles, hppeng"]);

/** Populates the HTML element with the id 'post-list'
 * 
 */
function populate_post_previews() {
    post_list_parent = document.getElementById('post-list');

    docs_post_names.forEach((post_name) => {
        post = document.createElement('article');
        post_info = docs_post_thumbnails.get(post_name);
        console.log(post_info);
        if (post_info == undefined) {
            return; 
        }

        title = document.createElement('h2');
        title.innerHTML = post_info[0];
        post.appendChild(title);

        summary = document.createElement('p');
        summary.innerHTML = post_info[1];
        post.appendChild(summary);

        authors = document.createElement('p');
        authors.innerHTML = "Author(s): " + post_info[2];
        post.appendChild(authors);

        link = document.createElement("a");
        link.setAttribute('href', `/wynnfo/${post_name}/`);
        post.appendChild(link);

        post_list_parent.appendChild(post);
      });
}

function initDropdownSections() {
    dropdowns = document.querySelectorAll('span.dropdown');
    for (const dropdown of dropdowns) {
        let inner_content = dropdown.children[0]

        dropdown.classList.add("up", "row");
        let title = document.createElement("div");
        title.classList.add("col-10", "item-title", "text-start", "dropdown-title")
        title.style.margin = "0 0 0";
        title.style.fontWeight = "bold";
        title.style.fontSize = 18;
        title.style.textDecoration = "underline";
        title.textContent = dropdown.title;
        dropdown.textContent = "";
        let indicator = document.createElement("div");
        indicator.classList.add("col-auto", "fw-bold", "box-title");
        indicator.textContent = "+";
        dropdown.prepend(indicator);
        dropdown.prepend(title);
        dropdown.appendChild(inner_content);
        inner_content.style.display = "none";

        title.addEventListener("click", function(){
            if (dropdown.classList.contains("up")) {
                dropdown.classList.remove("up");
                dropdown.classList.add("down");
                indicator.textContent = "-";

                inner_content.style.display = "";
            } else {
                dropdown.classList.remove("down");
                dropdown.classList.add("up");
                indicator.textContent = "+";

                inner_content.style.display = "none";
            }
        });
        title.addEventListener("mouseover", function(){
            title.style.color = "#ddd";
            // title.style.fontWeight = "bold";
            indicator.style.color = "#ddd";
            // indicator.style.fontWeight = "bold";
        });
        title.addEventListener("mouseleave", function(){
            title.style.color = "";
            // title.style.fontWeight = "normal";
            indicator.style.color = "";
            // indicator.style.fontWeight = "normal";
        });
        

    }
}