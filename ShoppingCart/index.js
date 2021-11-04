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

    const db_service = await registry.getDBComponent();

    if (!db_service)
    {
        res.json(new Response({
            status: false,
            content: "Could not reach database service."
        }));
        next();
    }

    try {
        const response = await db_service.get(`/checkStock?productName=${name}`);

        if (response.status == 200)
        {
            const product = response.data.product;

            if (!product)
            {
                res.json(new Response({
                    status: true,
                    content: "The product does not exist."
                }));
                next();
                return;
            }

            if (product.stock != 0 &&
                memory.shoppingCart.getProductAmount(product.name) < product.stock)
            {
                memory.shoppingCart.addProduct(response.data.product);
                res.json(new Response({
                    status: true,
                    content: "Product successfully added."
                }));
                next();
                return;
            }
            else
            {
                res.json(new Response({
                    status: true,
                    content: "Insuficient stock."
                }));
                next();
                return;
            }
        }

    } catch (error) {
        console.error(error);
    }
    
    res.json(new Response({
        status: false,
        content: "The product could not be added"
    }));
    next();
});

app.delete("/:name", (req, res, next) => {
    const { name } = req.params;

    memory.shoppingCart.removeProduct(name);

    res.json(new Response({
        status:true,
        content: "Product successfully removed from shopping cart."
    }));

    next();
});

app.listen(PORT, () =>{
    console.log(`Shopping cart component is running in port ${PORT}`);
});

registry.register();