//Llamamos a puppeteer
const puppeteer = require('puppeteer');
//Creamos una función, la cual va a ser llamada al final del codigo, y dentro de ella pondremos el parametro a buscar
function search(prod){
(async() => {
    const browser = await puppeteer.launch({headless:true}); // asignar a "false" para ejecutarlo con chromium
    const page = await browser.newPage();
    //Screenshot de la pagina de inicio de mercadolibre
    await page.goto("https://www.mercadolibre.com.ar")
    await page.screenshot({ path: "mlMainPage.jpg" })
    //Screenshot de la barra de busqueda junto a lo que se quiere buscar
    await page.type(".nav-search-input", prod)
    await page.screenshot({ path: "mlSearchBar.jpg" })

    await page.click(".nav-search-btn")
    await page.waitForSelector("li.ui-search-layout__item")
    //Screenshot de la lista del producto buscado
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
            articles.push(article)
        }  
        //filtramos por nombre de producto desado
                articles.forEach((e) => {
                if (e.title.includes(prod)){
                product.push(e)
                }
            })
        
    console.log(articles);
    await browser.close();
})();
}

search("xbox one")
