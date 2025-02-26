/*
* Small script to prevent clients from accidentally using the forked versions of wynnbuilder
* instead of the upstream official site.
*
* when developing est REDIRECT_DEV_OVERRIDE to false to prevent the alert from popping up.
*
* This script should be loaded at the beginning of every html file.
*/
const REDIRECT_DEV_OVERRIDE = false;
const HOST = "wynnbuilder.github.io";

const CONFIRMATION_MESSAGE = 
`WARNING: You're using an unofficial version of WynnBuilder which might not be fully updated.

To migrate the link to the official updated site, please press OK. 
NOTE: In the builder, Upon redirecting the ability tree may break.

If you're reviewing an older build or the official site is not caught up with changes, please press CANCEL.

To override the alert temporarily for development purposes, locate the file 'redirect_fork.js' and change REDIRECT_DEV_OVERRIDE to true.
`

if (!REDIRECT_DEV_OVERRIDE && window.location.host != HOST && confirm(CONFIRMATION_MESSAGE)) {
    const page = window.location.pathname;
    const version = window.location.search;
    const hash = window.location.hash;
    console.log("Redirecting...");
    window.location.replace(`https://${HOST}${page}${version}${hash}`)
}
