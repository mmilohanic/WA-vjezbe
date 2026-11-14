import express from "express";
import {
    checkArray,
    objectsOfSameSize,
    allKeysIncluded,
    sameKeysTypes,
    allNumDataPositive,
} from "../utils/validations.js";
import { ponudaBaseObject, ponude } from "../data/ponudeData.js";
import { nekretnine } from "../data/nekretnineData.js";

const router = express.Router();

// dohvati sve ponude
router.get("/", (req, res) => {
    if (!checkArray(ponude)) {
        return res
            .status(500)
            .json({ greska: "Podacima se nemože pristupiti." });
    }

    return res.status(200).json(ponude);
});

// pošalji novu ponudu
router.post("/", (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).json({ greska: "HTTP body je prazan." });
    }

    if (!objectsOfSameSize(data, ponudaBaseObject)) {
        return res
            .status(400)
            .json({ greska: "Poslan neispravan broj podataka." });
    }

    if (!allKeysIncluded(ponudaBaseObject, data)) {
        return res
            .status(400)
            .json({ greska: "Nisu poslani svi potrebni podaci." });
    }

    if (!sameKeysTypes(ponudaBaseObject, data)) {
        return res.status(400).json({
            greska: "Poslani podaci nepodržanog tipa.",
        });
    }

    if (!allNumDataPositive(data)) {
        return res.status(400).json({
            greska: "Numerički podaci moraju biti pozitivne vrijednosti.",
        });
    }

    if (!nekretnine.find((n) => n.id === parseInt(data.id_nekretnine))) {
        return res
            .status(404)
            .json({
                greska: "Ne postoji nekretnina za uneseni ID nekretnine.",
            });
    }

    const id = Math.max(0, ...ponude.map((n) => n.id)) + 1;
    ponude.push({ id, ...data });

    return res.status(201).json(ponude);
});

export default router;
