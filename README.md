# DiskusijuForumas


Saityno taikomųjų programų projektavimas
Projekto tikslas – sukurti svetainę, kuri suteiktų patogų formatą dideliems kiekiams žmonių bendrauti norimomis temomis.

Norint pasileisti projektą reikia atsisiųsti programą "node.js" (nuoroda: https://nodejs.org/en )

Atsisiuntus programą reikia pakeisti Enviromental variable taip, kad jama būtų ir node.js aplankas
Nuoroda kaip tai padaryti pavyzdys:
https://www.youtube.com/watch?v=pg4t48BPmh8



Projektas paleidžiamas atsidarius terminalą, nueinant į /DiskusijuForumas/backend/ aplanką
Pirmą kartą parsisiuntus projektą ir esant šiame aplanke, terminale parašykite " npm install " , tai instaliuos visas dependencies, kurių reikia projektui.

Norint susigeneruoti duomenų bazę pirmiausia reikia atlikti prieš tai išvardytus žingsnius.
Pirmiausia susikurkite tuščią duomenų bazę su pavadinimo "saityno", aš tam naudojau phpmyadmin DBVS. Tada reikia kompiuteryje suteikti leidimą "enable
running scripts on computer". Tam padaryti reikia, atsidaryti windows power shell su administratoriaus teisėmis , parašyti
" Set-ExecutionPolicy -ExecutionPolicy Unrestricted ", spausti enter, parašyti " A ", ir vėl spausti enter Jei viskas buvo padaryta teisingai, parašius " Get-ExecutionPolicy ", gaunamas resultatas turėtu būti " Unrestricted ". Tada per terminalą reikia būti backend aplanke ir parašyti 
" npx sequelize-cli db:migrate ", tai turėtų sugeneruoti duomenų bazę. Po to galite grįžti į windows powershell, kuri pasileidote su administratoriaus
teisėmis, parašyti " Set-ExecutionPolicy -ExecutionPolicy Restricted ", kad atstatyti scripts paleidimo prieigą atgal kaip buvo, parašius
" Get-ExecutionPolicy " patikrinti, gaunamas rezultats turėtu būti "Restricted".

Norint pasileisti projektą po to reikia parašyti " npm run dev ", tai paleis nodemon dev serverį ir nuo tada galima su Postman pasitikrinti Api veikimą
