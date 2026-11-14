const nekretninaBaseObject = {
    naziv: String(),
    opis: String(),
    cijena: Number(),
    lokacija: String(),
    broj_soba: Number(),
    povrsina: Number(),
};

let nekretnine = [
    {
        id: 1,
        naziv: "Stan Pećine",
        opis: "Stan s pogledom na more.",
        cijena: 245000,
        lokacija: "Rijeka",
        broj_soba: 3,
        povrsina: 78,
    },
    {
        id: 2,
        naziv: "Kuća Kastav",
        opis: "Kuća s vrtom i garažom.",
        cijena: 389000,
        lokacija: "Kastav",
        broj_soba: 5,
        povrsina: 165,
    },
];

export { nekretninaBaseObject, nekretnine };
