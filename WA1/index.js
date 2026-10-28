import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    let filePath = path.resolve(path.join("public", "index.html"));

    res.sendFile(filePath);
}); // curl -X GET http://localhost:3000

app.get("/about", (req, res) => {
    let filePath = path.resolve(path.join("public", "about.html"));

    res.sendFile(filePath);
}); // curl -X GET http://localhost:3000/about

app.get("/users", (req, res) => {
    let users = [
        {
            id: 1,
            ime: "Pero",
            prezime: "Perić",
        },
        {
            id: 2,
            ime: "Ivo",
            prezime: "Ivić",
        },
        {
            id: 3,
            ime: "Miro",
            prezime: "Mirić",
        },
    ];

    res.json(users);
}); // curl -X GET http://localhost:3000/users

app.listen(PORT, (error) => {
    if (error) {
        console.error(
            `Greška prilikom pokretanja poslužitelja: ${error.message}`,
        );
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});
