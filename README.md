# matematica

Despre aplicație
-----------------

`matematica` este un loc de joacă educațional pentru copii: exerciții scurte și interactive pentru antrenarea calculului mental (adunare, scădere, înmulțire). Scopul este să ofere sesiuni de practică rapide, utile în clasă sau acasă.

- Fiecare "test fulger" generează 5 întrebări care acoperă variate niveluri de dificultate.
- Interfața permite selectarea unei limite pentru numere (1..10 sau 11..20) potrivită pentru clasa elevului.
- Generatorul de scădere evită rezultate negative și încearcă să ofere probleme variate (de ex. `x - sel` și `sel - y`) în funcție de valoarea selectată.

Cum folosești aplicația
-----------------------

1. Deschide pagina principală și alege operația: adunare, scădere sau înmulțire.
2. Selectează limita numerelor (buton 1..10 sau 11..20 pentru clasa a 2-a).
3. Apasă "Începe testul" pentru a primi 5 întrebări; răspunde și treci la următoarea.
4. La final vezi scorul și istoricul răspunsurilor.

Beneficii pentru elevi
---------------------

- Sesiuni scurte care păstrează concentrarea.
- Probleme variate pentru consolidarea abilităților.
- Feedback imediat (corect/greșit) și cronometru pentru măsurarea progresului.

Pentru dezvoltatori
-------------------

Această secțiune conține informații tehnice despre proiect și cum să rulezi aplicația local.

Instalare și rulare locală
--------------------------

1. Instalează dependențele:

```bash
npm install
```

2. Rulează în modul dezvoltare:

```bash
npm run dev
```

3. Build pentru producție și pornire:

```bash
npm run build
npm run start
```

Structura proiectului
---------------------

- `app/` — pagini Next.js (App Router)
- `app/components/` — componente UI reutilizabile: `Calculator.tsx`, `QuickTest.tsx`, `TestFulger.tsx`, `Table.tsx` etc.
- `public/` — resurse statice (imagini, favicon, etc.)

Detalii importante de implementare
---------------------------------

- `TestFulger.tsx` generează întrebările la start: 5 întrebări deterministe/aleatorii, evitând rezultate negative la scădere.
- Pentru scădere, logica preferă distribuții diferite în funcție de valoarea selectată (ex: mai multe întrebări de tip `x - sel` pentru valori mici, evită `x - sel` pentru valori mari) pentru a păstra sensul problemei.
- Componentele client folosesc `"use client"` când este necesar și păstrează starea locală în componentă.

Contribuții
-----------

- Deschide issue-uri pentru propuneri sau bug-uri.
- Trimite pull request-uri mici, testabile și documentate.
- Rulează `npm run lint` înainte de commit pentru a menține stilul.

Descriere sugerată pentru GitHub
--------------------------------

"Loc de joacă matematic interactiv pentru copii — exerciții rapide și teste mini." 

Topic-uri recomandate
---------------------

`math`, `education`, `kids`, `arithmetic`, `learning`

Licență
-------

Proiectul este licențiat sub MIT License. Vezi fișierul `LICENSE` pentru textul complet și condițiile de utilizare.


