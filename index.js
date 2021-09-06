//Llamamos a puppeteer a nuestro archivo index.js -- Calling puppeteer to our file index.js
const puppeteer = require('puppeteer');
//Creamos una función, la cual va a ser llamada al final del codigo, y dentro pondremos el parametro a buscar --
//We create a function that will be called at the end of the code and inside we will put the parameter to search
function search(prod){
(async() => {
    const browser = await puppeteer.launch({headless: true}); // asignar a "false" para ejecutarlo con chromium -- assign to "false" to launch with chromium
    const page = await browser.newPage();
    //Captura de pantalla de la pagina de inicio de mercadolibre -- Screenshot of the homepage of mercadolibre
    await page.goto("https://www.mercadolibre.com.ar")
    await page.screenshot({ path: "mlMainPage.jpg" })
    //Captura de pantalla de la barra de busqueda-- Screenshot of the searchbar
    await page.type(".nav-search-input", prod)
    await page.screenshot({ path: "mlSearchBar.jpg" })
    //Captura de pantalla de la barra de busqueda-- Screenshot of the searchbar
    await page.click(".nav-search-btn")
    await page.waitForSelector("li.ui-search-layout__item")
    //Captura de pantalla de lista de productos-- Screenshot of the product list
    await page.screenshot({ path: "mlProducts.jpg" })
    
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll(".ui-search-item__group--title a.ui-search-item__group__element")
        
        const links = [];
        
        for (let element of elements) {
            links.push(element.href)
        }
        return links
        });
        const articles = []
        const product = []
        
        for (let enlace of enlaces) {
            await page.goto(enlace)
            await page.waitForSelector(".ui-pdp-title")

            const article = await page.evaluate(() => {
                const tmp = {};
                tmp.title = document.querySelector(".ui-pdp-title").innerText
                tmp.price = document.querySelector(".price-tag-fraction").innerText

                
                    
                    return tmp
                
            });
            article.link = enlace
            articles.push(article)
        }  
        //filtramos titulo por cada producto // filter for each product
                articles.forEach((e) => {
                if (e.title.includes(prod)){
                product.push(e)
                }
            })
    console.log(articles);
    await browser.close();
})();
}

search("playstation 5");
// Aqui ponemos lo que se quiere buscar
// Here put what we want to search
