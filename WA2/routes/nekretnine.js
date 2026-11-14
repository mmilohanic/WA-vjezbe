import express from "express";
import {
    checkArray,
    valueIsInteger,
    objectsOfSameSize,
    allKeysIncluded,
    sameKeysTypes,
    allNumDataPositive,
} from "../utils/validations.js";
import { nekretninaBaseObject, nekretnine } from "../data/nekretnineData.js";

const router = express.Router();

// dohvati sve nekretnine
router.get("/", (req, res) => {
    if (!checkArray(nekretnine)) {
        return res
            .status(500)
            .json({ greska: "Podacima se nemože pristupiti." });
    }

    return res.status(200).json(nekretnine);
});

// dohvati nekretninu po ID-u
router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!valueIsInteger(id)) {
        return res.status(400).json({ greska: "Uneseni ID nije cijeli broj." });
    }

    let nekretnina = nekretnine.find((n) => n.id === parseInt(id));
    if (!nekretnina) {
        return res
            .status(404)
            .json({ greska: "Ne postoji nekretnina za uneseni ID." });
    }

    return res.status(200).json(nekretnina);
});

// dodaj novu nekretninu
router.post("/", (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ greska: "HTTP body je prazan." });
    }

    if (!objectsOfSameSize(data, nekretninaBaseObject)) {
        return res
            .status(400)
            .json({ greska: "Poslan neispravan broj podataka." });
    }

    if (!allKeysIncluded(nekretninaBaseObject, data)) {
        return res
            .status(400)
            .json({ greska: "Nisu poslani svi potrebni podaci." });
    }

    if (!sameKeysTypes(nekretninaBaseObject, data)) {
        return res.status(400).json({
            greska: "Poslani podaci nepodržanog tipa.",
        });
    }

    if (!valueIsInteger(data.broj_soba)) {
        return res
            .status(400)
            .json({ greska: "Uneseni broj soba mora biti cijeli broj." });
    }

    if (!allNumDataPositive(data)) {
        return res.status(400).json({
            greska: "Numerički podaci moraju biti pozitivne vrijednosti.",
        });
    }

    const id = Math.max(0, ...nekretnine.map((n) => n.id)) + 1;
    nekretnine.push({ id, ...data });

    return res.status(201).json(nekretnine);
});

// ažuriraj nekretninu potpuno
router.put("/:id", (req, res) => {
    const id = req.params.id;
    if (!valueIsInteger(id)) {
        return res.status(400).json({ greska: "Uneseni ID nije cijeli broj." });
    }

    const position = nekretnine.findIndex((n) => n.id === parseInt(id));
    if (position === -1) {
        return res
            .status(404)
            .json({ greska: "Ne postoji nekretnina za uneseni ID." });
    }

    const data = req.body;
    if (!data) {
        return res.status(400).json({ greska: "HTTP body je prazan." });
    }

    if (!objectsOfSameSize(data, nekretninaBaseObject)) {
        return res
            .status(400)
            .json({ greska: "Poslan neispravan broj podataka." });
    }

    if (!allKeysIncluded(nekretninaBaseObject, data)) {
        return res
            .status(400)
            .json({ greska: "Nisu poslani svi potrebni podaci." });
    }

    if (!sameKeysTypes(nekretninaBaseObject, data)) {
        return res.status(400).json({
            greska: "Poslani podaci nepodržanog tipa.",
        });
    }

    if (!valueIsInteger(data.broj_soba)) {
        return res
            .status(400)
            .json({ greska: "Uneseni broj soba mora biti cijeli broj." });
    }

    if (!allNumDataPositive(data)) {
        return res.status(400).json({
            greska: "Numerički podaci moraju biti pozitivne vrijednosti.",
        });
    }

    nekretnine.splice(position, 1, { id, ...data });

    return res.status(200).json(nekretnine);
});

// ažuriraj nekretninu djelomično
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    if (!valueIsInteger(id)) {
        return res.status(400).json({ greska: "Uneseni ID nije cijeli broj." });
    }

    const position = nekretnine.findIndex((n) => n.id === parseInt(id));
    if (position === -1) {
        return res
            .status(404)
            .json({ greska: "Ne postoji nekretnina za uneseni ID." });
    }

    const data = req.body;
    if (!data) {
        return res.status(400).json({ greska: "HTTP body je prazan." });
    }

    if (!allKeysIncluded(data, nekretninaBaseObject)) {
        return res
            .status(400)
            .json({ greska: "Poslani neispravni podaci (ključevi)." });
    }

    if (!sameKeysTypes(data, nekretninaBaseObject)) {
        return res.status(400).json({
            greska: "Poslani podaci nepodržanog tipa.",
        });
    }

    if (
        Object.keys(data).includes("broj_soba") &&
        !valueIsInteger(data.broj_soba)
    ) {
        return res
            .status(400)
            .json({ greska: "Uneseni broj soba mora biti cijeli broj." });
    }

    if (!allNumDataPositive(data)) {
        return res.status(400).json({
            greska: "Numerički podaci moraju biti pozitivne vrijednosti.",
        });
    }

    Object.assign(nekretnine[position], data);

    return res.status(200).json(nekretnine[position]);
});

// obriši nekretninu
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    if (!valueIsInteger(id)) {
        return res.status(400).json({ greska: "Uneseni ID nije cijeli broj." });
    }

    let position = nekretnine.findIndex((n) => n.id === parseInt(id));
    if (position === -1) {
        return res
            .status(404)
            .json({ greska: "Ne postoji nekretnina za uneseni ID." });
    }

    nekretnine.splice(position, 1);

    return res.status(204).json(nekretnine);
});

export default router;
