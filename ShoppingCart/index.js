import express from "express";
import registry from "./registry.js";
import config from "./config.js";
import memory from "./memory.js";
import { Response } from "./Response.js";

const PORT = process.env.PORT || config.defaultPort;

const app = express();

app.get("/", (_, res, next) => {
    res.json(new Response({
        status: true,
        content: memory.shoppingCart.toString(),
    }));

    next();
});

app.post("/:name", async (req, res, next) => {
    const { name } = req.params;

    const response = await registry.getDBComponent().get(`/checkStock?productName=${name}`);

    if (response.status == 200)
    {
        const product = response.data.product;

        if (product.stock != 0 &&
            shoppingCart.getProductAmount(product.name) < product.stock)
        {
            memory.shoppingCart.addProduct(response.data.product);
            res.json(new Response({
                status: true,
                content: ""
            }));
            next();
        }
    }

    res.json(new Response({
        status: false,
        content: ""
    }));
    next();
});

app.delete("/:name", (req, res, next) => {
    const { name } = req.params;

    memory.shoppingCart.removeProduct(name);

    res.json(new Response({
        status:true,
        content: ""
    }));

    next();
});

app.listen(PORT, () =>{
    console.log(`Shopping cart component is running in port ${PORT}`);
});

registry.register();