import axios from "axios";

const registry = axios.create({
    baseURL: 'http://localhost:3000',
});

const productNames = [
    "naranja",
    "mosto",
    "helado",
    "tomate",
    "macarrones",
    "pollo",
    "judia",
  ];

async function findShoppingCartComponent() {
    try {
        const response =  await registry.get("/find/shopping-cart/1.0.0");

        if (response.data instanceof Object)
        {
            return axios.create({
                baseURL: `http://${response.data.ip}:${response.data.port}`,
            });
        }
        
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function run()
{
    const SCComponent = await findShoppingCartComponent();

    if (!SCComponent)
    {
        console.log('Shopping Cart Component could not be found.');
        return;
    }

    for (let i = 0; i < productNames.length; i++) {
        const resp = await SCComponent.post(`/${productNames[i]}`);
        console.log(`Adding ${productNames[i]}: ${resp.data.content}`);
    }

    let strShoppingCart = (await SCComponent.get("/")).data.content;
    console.log(strShoppingCart);

    for (let i = 0; i < productNames.length; i++) {
        const resp = await SCComponent.delete(`/${productNames[i]}`);
        console.log(`Removing ${productNames[i]}: ${resp.data.content}`);
    }

    strShoppingCart = (await SCComponent.get("/")).data.content;
    console.log(strShoppingCart);
}

function main()
{
    run();
}

main();