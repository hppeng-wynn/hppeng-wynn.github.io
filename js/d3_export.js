// http://bl.ocks.org/rokotyan/0556f8facbaf344507cdc45dc3622177

// Set-up the export button
function set_export_button(svg, button_id, output_id) {
    d3.select('#'+button_id).on('click', function(){
        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg.node());
        console.log(source);

        source = source.replace(/^<g/, '<svg');
        source = source.replace(/<\/g>$/, '</svg>');
        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        //set url value to a element's href attribute.
        document.getElementById(output_id).href = url;
    });
}
