# internUp
InternUp eshte nje platforme online qe lidh studentet me kompanite dhe institucionet qe ofrojne mundesi per praktika profesionale. Platforma u mundeson studenteve te kerkojne, te gjejne dhe te aplikojne per praktika, te zhvillojne aftesite e tyre profesionale dhe te fitojne pervojen e pare ne tregun e punes.

Qika kom marr import tailwind edhe kaniher css nfiles
kqyrni paktetat te package.json qka kom marr (tjerat i kam pas prej lab1 gati)

Projekti ndjek Hexagonal Architecture. Varësitë drejtohen nga jashtë brenda: `domain` nuk varet nga asgjë, kurse UI thërret vetëm raste përdorimi.
| `src/domain/internship` | Entitetet dhe rregullat e kërkimit |
| `src/application` | Rastet e përdorimit dhe portet (`ports/`) |
| `src/adapters/outbound/mock` | Implementimi demonstrativ i porteve |
| `src/infrastructure/container.js` | Composition root: lidh adapter-ët me rastet e përdorimit |
| `src/features/home` | Faqja Home: komponentët, hooks dhe përmbajtja statike |
| `src/app` | Nisja e aplikacionit |
kur te bojm apis ne vazhdim i bojm add te ports 

05.11.26 kom punu front 
me qet e keni http://localhost:5173/ (i boni npm run dev ne terminal)