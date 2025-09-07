async function loadHeader() {
    const resp = await fetch("header.html"); // busca header.html
    const html = await resp.text();          // lo lee como texto
            document.getElementById("header").innerHTML = html; // lo inserta
        }
async function loadFooter() {
    const resp = await fetch("footer.html");
    const html = await resp.text();
    document.getElementById("footer").innerHTML = html;
        }        
    loadHeader();
    loadFooter();