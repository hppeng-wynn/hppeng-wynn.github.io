

let item_nodes = [];

document.addEventListener('DOMContentLoaded', function() {
    for (const [eq, none_item] of zip(equipment_fields, none_items)) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        // let item_dropdown

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-display', input_field, item_image).link_to(item_input);
        new PrintNode(eq+'-debug').link_to(item_input);
        //document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip');"); //toggle_plus_minus('" + eq + "-pm'); 

    }
    let weapon_image = document.getElementById("weapon-img");
    new WeaponDisplayNode('weapon-type', weapon_image).link_to(item_nodes[8]);
    console.log("Set up graph");

});
