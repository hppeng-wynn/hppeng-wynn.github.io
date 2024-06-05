/** Vanilla JS does not allow dynamically fetching files in a local directory. We have to hard code the list to loop over. 
 *  Each entry is the name of a subfolder in /docs/.
 */
const docs_post_titles = [
    "items_adv_help",
    "damage_calc"
]

/** Populates the HTML element with the id 'post-list'
 * 
 */
function populate_post_previews() {
    post_list_parent = document.getElementById('post-list');

    docs_post_titles.forEach((post_title) => {
        post = document.createElement('article');

        title = document.createElement('h2');
        title.innerHTML = post_title;
        post.appendChild(title);

        summary = document.createElement('p');
        summary.innerHTML = 'temporary content'
        post.appendChild(summary);

        link = document.createElement("a");
        link.setAttribute('href', `/docs/${post_title}/`);
        post.appendChild(link);

        post_list_parent.appendChild(post);
      });
}