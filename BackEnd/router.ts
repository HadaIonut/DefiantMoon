import {Router} from "https://deno.land/x/oak@v11.1.0/router.ts";

export const router = new Router();

const books = new Map<string, any>();
books.set("1", {
    id: "1",
    title: "The Hound of the Baskervilles",
    author: "Conan Doyle, Arthur",
});

router
    .get("/", (context) => {
        context.response.body = "Hello world!";
    })
    .get("/book", (context) => {
        context.response.body = Array.from(books.values());
    })
    .get("/book/:id", (context) => {
        if (books.has(context?.params?.id)) {
            context.response.body = books.get(context.params.id);
        }
    });

router.get
