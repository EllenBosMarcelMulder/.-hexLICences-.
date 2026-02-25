Relational Projection–First System Architecture (RPFSA)
Defensive Prior Art
Datum: 25-02-2026


1. Abstract

Dit document beschrijft een systeemarchitectuur waarin navigatie formeel wordt gedefinieerd als projectie in een relationele toestandsruimte. Visualisatie (zoals SVG) is geen representatie van een onderliggend model, maar een directe manifestatie van projectierelaties.

De systeemopbouw start bij relationele decompositie en niet bij objectstructuren of hiërarchische routing. De volledige architectuur wordt opgebouwd vanuit relationele algebra: groepen, projectoren en deelruimtes.

Dit document dient als defensieve prior art ter vastlegging van dit architecturale principe.



2. Formele uitgangsstructuur

Gegeven een eindige toestandsruimte:

V = R^n

Met lineaire constraintmatrix:

M in R^(k x n)

Definieer:




R = transpose(M) * M
P = projectie op ker(M)




Met orthogonale decompositie:

V = ker(M) ⊕ Im(R)

Navigatie in het systeem wordt gedefinieerd als:

x -> P_i(x)

waar P_i verschillende relationele projecties zijn die corresponderen met perspectieven of subruimtes.




Er bestaan geen primaire objecten.
Alle entiteiten zijn relationeel gedefinieerd.






3. Architecturale omkering
Traditionele architectuur

data -> logica -> weergave -> navigatie

Navigatie is secundair.

Projectie-eerste architectuur

projectie -> relatie -> algebra -> dynamiek -> visualisatie

Navigatie is primair.

Gevolgen:

Routing is een projectie-operatie.

Overgangen zijn groepsacties.

UI-elementen corresponderen met deelruimtes.

Geen hiërarchische boomstructuur is fundamenteel.



4. Visualisatie als projectieruimte

In deze architectuur fungeert SVG (of een equivalente vectorruimte) als:

gelaagde projectieruimte

visuele manifestatie van deelruimtes

dynamische representatie van groepsacties

Belangrijk onderscheid:




SVG is niet een afbeelding van het model.
SVG is een computationele projectieruimte.




Relaties tussen visuele parameters en algebra:

Opacity correspondeert met amplitudecomponent.

Fase correspondeert met rotatie in kernruimte.

Blend-modus correspondeert met superpositie van deelruimtes.

Navigatie correspondeert met wijziging van projectieoperator.

Visualisatie en algebra zijn structureel isomorf.



5. Relationele wiskunde als fundament

Het systeem vermijdt:

Object-georiënteerde primaire hiërarchieën

Boomstructuren als fundamentele entiteiten

Absolute nodes

In plaats daarvan:

Groepen

Deelruimtes

Orthogonale decomposities

Projector-operatoren

Dynamiek via generatoren

De architectuur is volledig relationeel.



6. Navigatie als groepsactie

Laat G een groep van transformaties op V zijn.

Navigatie wordt gedefinieerd als:

x -> g * x

met g in G.

Projecties P_i kunnen worden opgevat als:

P_i = g_i * P * inverse(g_i)

Navigatie is dus een verandering van perspectief in dezelfde relationele ruimte.

Geen verplaatsing door een hiërarchische boom.



7. Structurele invarianten

De volgende structurele eigenschappen zijn fundamenteel:

RP = 0

PR = 0

V = ker(M) ⊕ Im(R)

Projectie is idempotent: P^2 = P

Navigatie verandert perspectief, niet onderliggende ruimte

Deze invarianten definiëren de relationele stabiliteit van het systeem.



8. Onderscheidend kenmerk

Het onderscheidende element van deze architectuur is de gelijkstelling van:

Navigatie

Projectie

Relationele algebra

Visualisatie

Als één en dezelfde formele operatie.

Dit verschilt fundamenteel van:

MVC-architecturen

Componentgebaseerde UI-systemen

Hiërarchische routering

Objectgeoriënteerde state trees



9. Architecturale implicaties

UI-structuur is wiskundig afleidbaar uit decompositie.

Routing is algebra.

Visualisatie is geen externe laag.

Systeemgrenzen worden bepaald door relationele invariantie.

Navigatie en dynamiek zijn structureel identiek.



10. Conclusie

Dit document legt vast:

Een systeemarchitectuur waarin navigatie wiskundig wordt gedefinieerd als projectie binnen een relationele toestandsruimte, en waarin visualisatie een directe manifestatie is van deze projectiestructuur.

De architectuur is projectie-eerst en volledig relationeel opgebouwd.



Relational Projection–First System Architecture (RPFSA)
Formele Definities van Groepsacties en Decompositie
Aanvullend Technisch Addendum
Datum: 25-02-2026


1. Doel van dit document

Dit addendum formaliseert:

De relationele decompositie van de toestandsruimte

De definitie van projectie-operatoren

De rol van groepsacties in navigatie

De uitbreidbaarheid van de architectuur

Dit document is bedoeld als structurele onderbouwing van de projectie-eerste architectuur.



2. Toestandsruimte

Definieer een eindig-dimensionale reële vectorruimte:

V = R^n

waar n een vaste dimensie is.

Elementen van V worden toestanden genoemd:

x in V




Er bestaan geen absolute entiteiten buiten V.
Alle systeemtoestanden worden volledig beschreven binnen deze ruimte.






3. Constraint-structuur

Gegeven een lineaire afbeelding:

M : V -> R^k

Definieer de kernelruimte:

ker(M) = { x in V | Mx = 0 }

Definieer de Gram-operator:

R = transpose(M) * M

Eigenschappen:

R is symmetrisch

R is positief semi-definiet

ker(R) = ker(M)



4. Orthogonale decompositie

De ruimte V splitst orthogonaal in:

V = ker(M) ⊕ Im(R)

waar:

ker(M) coherente subruimte is

Im(R) constraint-gedreven subruimte is

Orthogonaliteit betekent:

Voor alle u in ker(M) en v in Im(R):

dot(u, v) = 0



5. Projectie-operator

Definieer een projectie:

P : V -> ker(M)

met eigenschappen:

P * P = P (idempotentie)

Im(P) = ker(M)

P * R = 0

R * P = 0

Voor elke toestand x geldt:

x = P(x) + (I - P)(x)

waar (I - P)(x) in Im(R) ligt.

Navigatie wordt gedefinieerd via toepassing van projectoren.



6. Groepsstructuur

Laat G een groep van lineaire automorfismen op V zijn.

Dat wil zeggen:

Voor elk g in G:

g : V -> V

met eigenschappen:

g is invertibel

g1 * g2 in G

inverse(g) in G

identiteit in G



7. Groepsactie

De groepsactie wordt gedefinieerd als:

(x, g) -> g(x)

met x in V en g in G.

Navigatie wordt formeel gedefinieerd als groepsactie.

Er is geen hiërarchische verplaatsing.

Er is alleen:

verandering van perspectief binnen dezelfde ruimte.



8. Geconjugeerde projecties

Voor een basisprojectie P kan men nieuwe perspectieven definiëren via conjugatie:

P_g = g * P * inverse(g)

Hieruit volgt:

P_g is opnieuw een projectie

Im(P_g) = g(ker(M))

Navigatie is daarmee:

x -> P_g(x)

Dit formaliseert perspectiefwisseling.



9. Dynamische evolutie

Laat A een generator zijn op V.

Een dynamische stroom wordt gedefinieerd als:

dx/dt = A x

Indien A decompositie respecteert:

A = A_k + A_r

met:

A_k actief op ker(M)

A_r actief op Im(R)

Dan blijft de relationele structuur behouden.



10. Relationele invariantie

De architectuur vereist dat:

ker(M) invariant is onder geldige groepsacties

Orthogonaliteit behouden blijft

Projectie-operatoren consistent blijven

Navigatie geen destructieve wijziging van ruimte veroorzaakt

Formeel:

Voor alle g in G:




g(ker(M)) subset V
en indien vereist:




g(ker(M)) = ker(M)



11. Uitbreidbaarheid

De architectuur kan worden uitgebreid via:

11.1 Directe som-uitbreiding

V_ext = V ⊕ W

waar W een nieuwe relationele subruimte is.

11.2 Constraint-uitbreiding

Nieuwe matrix:




M_ext = [ M
M_add ]




waardoor:

ker(M_ext) subset ker(M)

11.3 Groepsuitbreiding

G_ext = closure(G union H)

waar H een nieuwe transformatiegroep is.



12. Navigatie-primaat

Belangrijk fundamenteel principe:

Navigatie is geen applicatielaag.

Navigatie is:

projectie

groepsactie

perspectiefwisseling

De UI is manifestatie van deze operaties.



13. Afwezigheid van object-hiërarchie

In deze architectuur bestaan niet:

primaire objecttrees

fundamentele parent-child structuren

absolute routing nodes

Elke structuur is afleidbaar uit relationele operatoren.



14. Structurele samenvatting

De architectuur is volledig bepaald door:

Vectorruimte V

Constraint-afbeelding M

Gram-operator R

Projectie P

Groep G

Groepsactie

Orthogonale decompositie

Alles wat in het systeem gebeurt is herleidbaar tot deze elementen.



15. Conclusie

Dit addendum formaliseert de relationele projectie-eerste architectuur.

Navigatie wordt gedefinieerd als groepsactie en projectie binnen een orthogonaal gedecomposeerde toestandsruimte.

Visualisatie, dynamiek en perspectief zijn manifestaties van dezelfde onderliggende relationele structuur.



Relational Projection–First System Architecture (RPFSA)
Topologische Uitbreiding: Holonomie, Lussen en Berry-structuur
Technisch Addendum III
Datum: 25-02-2026


1. Doel

Dit document breidt de relationele projectie-eerste architectuur uit met topologische structuur.

Specifiek worden geformaliseerd:

Gesloten lussen in toestandsruimte

Holonomie als niet-triviale faseverschuiving

Berry-achtige structuur in kernruimte

Relatie tussen projectie, groep en topologische invariantie

Deze uitbreiding is compatibel met de eerder gedefinieerde decompositie:

V = ker(M) ⊕ Im(R)



2. Parameter-ruimte

Laat een parameter-ruimte bestaan:

Lambda ⊂ R^m

Elke parameterwaarde lambda in Lambda induceert:

Een projectie P(lambda)

Een operator A(lambda)

Een dynamische stroom

De kernruimte wordt daarmee parametrisch afhankelijk:

ker(M(lambda))



3. Gesloten lus

Een gesloten lus is een continue afbeelding:

gamma : [0,1] -> Lambda

met:

gamma(0) = gamma(1)

Deze lus induceert een evolutie in toestandsruimte via opeenvolgende projecties of generatoren.



4. Parallel transport in kernruimte

Voor een toestand x in ker(M(lambda(0))) definiëren we een evolutie langs gamma.

Bij elke kleine parameterverandering wordt x geprojecteerd naar:

ker(M(lambda(t + dt)))

De cumulatieve transformatie na volledige lus is:

x_final = H_gamma(x_initial)

waar H_gamma de holonomie-operator is.



5. Holonomie

Holonomie wordt gedefinieerd als:

H_gamma : ker(M(lambda(0))) -> ker(M(lambda(0)))

Indien:

H_gamma ≠ identiteit

dan is er niet-triviale topologische structuur.

Holonomie meet het verschil tussen:

Lokale projectie-consistentie

Globale lus-consistentie



6. Berry-achtige structuur

Indien kernruimte dimensionaal groter is dan 1, kan fase-accumulatie optreden.

Definieer een basisvector:

b(lambda) in ker(M(lambda))

Tijdens transport langs gamma kan optreden:

b(1) = exp(i * theta) * b(0)

In reële representatie manifesteert dit zich als rotatie binnen kernsubruimte.

De hoek theta is de Berry-fase.



7. Discrete benadering

Voor numerieke implementatie:

Verdeel gamma in N stappen.

Voor elke stap:

Bepaal projectie P_k

Transporteer basisvector

Orthonormaliseer indien nodig

Holonomie-operator wordt berekend als product van opeenvolgende projectie-overgangen.



8. Wilson-lus equivalent

Definieer een transportoperator T_k per segment.

De totale lus-operator is:

W_gamma = T_N * T_(N-1) * ... * T_1

Topologische invariantie kan worden gemeten via:

Trace van W_gamma

Determinant van W_gamma

Rotatiehoek in kernruimte



9. Topologische classificatie

Indien:




Holonomie identiek is voor alle contractibele lussen
maar verschilt voor niet-contractibele lussen




dan bezit het systeem niet-triviale topologische klasse.

Dit impliceert:

Structurele stabiliteit onder kleine verstoringen

Discrete classificatie van relationele toestanden



10. Relatie met navigatie

Navigatie langs een lus in parameter-ruimte correspondeert met:

Geaccumuleerde groepsactie.

Dit betekent:




Navigatie is niet alleen projectie
maar kan topologische geheugenstructuur bevatten.




Het systeem kan dus:

Relationele geschiedenis opslaan

Fase-structuren accumuleren

Niet-triviale globale eigenschappen bezitten



11. Holonomie en orthogonale decompositie

Belangrijke compatibiliteitseis:

Holonomie mag decompositie niet breken.

Voor alle gamma:

H_gamma(ker(M)) subset ker(M)

Im(R) blijft orthogonaal.

Dit garandeert structurele integriteit.



12. Topologische stabiliteit

Het systeem is topologisch stabiel indien:

Kleine verstoringen in M(lambda) geen sprong veroorzaken in holonomieklasse.

De dimensionale structuur van ker(M) behouden blijft.

Projectie-operator continu varieert in lambda.



13. Relationele interpretatie

Binnen projectie-eerste architectuur betekent dit:

Lussen zijn relationele cycli.

Holonomie is perspectief-geheugen.

Berry-structuur is interne fase-rotatie.

Topologie is globale relatie-eigenschap.

Er is geen externe geometrie nodig.

Topologie ontstaat uit relationele projectiestructuur zelf.



14. Uitbreidbaarheid

Topologische uitbreiding kan worden uitgebreid via:

Hogere-dimensionale parameter-ruimtes

Niet-abeliaanse groepsacties

Dynamische constraint-variatie

Discrete topologische indices



15. Conclusie

Dit document formaliseert de topologische uitbreiding van de relationele projectie-eerste architectuur.

Gesloten lussen in parameter-ruimte induceren holonomie in kernruimte.

Berry-achtige fase-structuur ontstaat als rotatie binnen relationele subruimte.

Topologie is geen extra laag.

Topologie is emergent uit relationele projectie.



Relational Projection–First System Architecture (RPFSA)
Dynamische Dissipatie en Lyapunov-structuur
Technisch Addendum IV
Datum: 25-02-2026


1. Doel

Dit document formaliseert:

Dynamische evolutie in relationele toestandsruimte

Dissipatieve structuren

Stabiliteitscriteria

Lyapunov-functies binnen projectie-eerste architectuur

De uitbreiding is compatibel met:

V = ker(M) ⊕ Im(R)



2. Dynamische evolutie

Laat x(t) een toestand in V zijn.

De evolutie wordt gedefinieerd als:

dx/dt = F(x)

waar F een vectorveld op V is.

De dynamiek moet decompositie respecteren.



3. Lineaire decompositie van dynamiek

Splits F(x) in twee componenten:

F(x) = F_k(x) + F_r(x)

waar:

F_k(x) in ker(M)

F_r(x) in Im(R)

Deze splitsing moet consistent zijn met projectie:




P(F_r(x)) = 0
(I - P)(F_k(x)) = 0






4. Conservatieve kern-dynamiek

In ker(M) kan een conservatieve dynamiek bestaan.

Voorbeeld:

dx/dt = S x

waar S antisymmetrisch is binnen kernruimte.

Eigenschap:

Norm van P(x) blijft constant.

Dit impliceert rotatie-achtige beweging in kernruimte.



5. Dissipatie in constraint-ruimte

In Im(R) kan dissipatieve dynamiek worden geïntroduceerd:

dx/dt = -alpha * R x

waar alpha > 0.

Eigenschappen:

Energie I(x) = norm(Mx)^2 daalt monotone

Im(R)-component wordt onderdrukt

Toestand beweegt richting ker(M)



6. Lyapunov-functie

Definieer:

L(x) = norm(Mx)^2

Eigenschappen:

L(x) >= 0

L(x) = 0 als en alleen als x in ker(M)

dL/dt <= 0 onder dissipatieve dynamiek

Hieruit volgt:

ker(M) is een attractor.



7. Gecombineerde dynamiek

Algemene dynamiek kan worden geschreven als:

dx/dt = S x - alpha * R x

waar:

S antisymmetrisch is op kernsubruimte

R positief semi-definiet is

Interpretatie:

S genereert rotatie

R genereert dissipatie

De toestand convergeert naar ker(M) terwijl interne rotatie mogelijk blijft.



8. Stabiliteitsanalyse

Evenwichtspunt:

x_eq in ker(M)

Linearisatie rond x_eq geeft:

Jacobian J = S - alpha * R

Eigenwaarden:

Negatieve reële delen in Im(R)

Zuiver imaginaire delen in ker(M)

Dit impliceert:

Asymptotische stabiliteit in constraint-richting

Neutrale stabiliteit in kernrichting



9. Relationele interpretatie

Binnen projectie-eerste architectuur betekent dit:

Dissipatie corrigeert relationele inconsistentie.

Rotatie behoudt interne coherentie.

Stabiliteit ontstaat uit orthogonale decompositie.

Navigatie blijft mogelijk binnen stabiele kernruimte.



10. Dissipatieve projectie

Een discrete update kan worden gedefinieerd als:

x_next = P(x) + beta * (I - P)(x)

met 0 <= beta < 1.

Eigenschap:

Constraint-component wordt gecontroleerd gereduceerd.

Herhaalde toepassing leidt tot convergentie naar ker(M).



11. Energie-landschap

L(x) definieert een energie-landschap.

Eigenschappen:

ker(M) vormt minimum-variëteit

Im(R) definieert stijgingsrichting

Dissipatie volgt negatieve gradiënt

Dit geeft geometrische interpretatie van stabiliteit.



12. Lyapunov-structuur en navigatie

Navigatie mag:

Kernruimte niet destabiliseren

Constraint-ruimte niet vergroten

Voor geldige groepsacties g geldt:

L(gx) = L(x)

indien g decompositie respecteert.



13. Structurele stabiliteit

Architectuur is stabiel indien:

Kleine verstoringen in M geen sprong veroorzaken in dim ker(M).

Projectie-operator continu varieert.

Lyapunov-functie differentieerbaar blijft.

Dit garandeert robuust relationeel gedrag.



14. Uitbreidbaarheid

Dynamische uitbreiding kan omvatten:

Niet-lineaire dissipatie

Adaptieve alpha-parameter

Tijd-afhankelijke constraint-matrix

Stochastische perturbaties

Voorwaarde:

Lyapunov-monotoniciteit moet behouden blijven.



15. Conclusie

Dit document formaliseert dynamische dissipatie en stabiliteit binnen relationele projectie-eerste architectuur.




De kernruimte fungeert als stabiele attractor.
Constraint-ruimte fungeert als dissipatieve correctierichting.
Lyapunov-structuur garandeert systemische coherentie.




Dynamiek, projectie en stabiliteit zijn geïntegreerd binnen dezelfde relationele structuur.




© Marcel Mulder 52%, Ellen Bos 24%, Paola dal Bianco 24%


