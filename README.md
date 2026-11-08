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

### Student Blog (`/blog`)
| Shtresa | Skedarët |
| `src/domain/blog` | `Story.js` (entiteti + validimi), `storyTaxonomy.js` (kategoritë, fushat), `storyFilters.js` |
| `src/application` | `blogUseCases.js`, porti `StoryRepository` |
| `src/adapters/outbound/mock` | `MockStoryRepository`, `storyData.js` (demo data) |
| `src/features/blog` | faqet `BlogPage`, `StoryDetailsPage`, `ShareStoryPage` + komponentët |

Rrugët: `/blog`, `/blog/:storyId`, `/blog/shkruaj` (vetëm për studentë – `student@internup.test` / `Student123!`).
Për backend: krijo p.sh. `HttpStoryRepository` me metodat `findAll`, `findById`, `save` dhe zëvendësoje te `container.js`.

05.11.26 kom punu front 
me qet e keni http://localhost:5173/ (i boni npm run dev ne terminal)
### Company Workspace (`/kompani`) dhe RBAC
| Shtresa | Skedarët |
| `src/domain/auth/accessControl.js` | Rolet, lejet (RBAC), `assertCan`, `assertOwnsCompany` |
| `src/domain/internship` | `candidateApplication.js` (statuset + kalimet), `internshipDraft.js`, `companyProfile.js` |
| `src/application` | `companyWorkspaceUseCases.js`, `studentApplicationUseCases.js`, porti `CandidateApplicationRepository` |
| `src/adapters/outbound/mock` | `MockCandidateApplicationRepository`, ruajtja në localStorage për pozitat/kompanitë |
| `src/features/company-workspace` | Paneli, Profili i kompanisë, Manage Internships, Aplikimet |
| `src/features/auth/RequireRole.jsx` | Mbrojtja e rrugëve sipas rolit |

Llogaria demo e kompanisë: `kompani@internup.test` / `Kompani123!` (menaxhon Kodra Labs).
Kompanitë e reja krijojnë profilin automatikisht pas regjistrimit. Çdo use case kontrollon rolin dhe pronësinë, jo vetëm UI.

08.11.26 edhe 09.11.26 kom punu te universitetet
### Universitetet (`/universitetet`) edhe paneli i universitetit (`/universitet`)
| Shtresa | Skedarët |
| `src/domain/university` | `University.js`, `studentVerification.js`, `universityFilters.js` |
| `src/application` | `universityUseCases.js`, `universityWorkspaceUseCases.js`, portet `UniversityRepository` edhe `StudentVerificationRepository` |
| `src/adapters/outbound/mock` | `MockUniversityRepository`, `MockStudentVerificationRepository`, `universityData.js` (krejt universitetet) |
| `src/features/universities` | faqja e universiteteve edhe profili i secilit |
| `src/features/university-workspace` | paneli, verifikimi, studentet, profili |

Llogaria demo: `universitet@internup.test` / `Universitet123!` (osht e UP-se).
Studenti e kerkon verifikimin prej dashboardit, perfaqesuesi e pranon ose e refuzon prej panelit. Emrat e studenteve i sheh veq perfaqesuesi.
Per universitet tjeter regjistrohu me email te atij universiteti (psh `@ubt-uni.net`), me gmail nuk t'lejon.
Logot edhe fotot jon te `public/images/universities/`.
Kur te bojm backend i bojm `HttpUniversityRepository` edhe `HttpStudentVerificationRepository` edhe i ndrrojm te `container.js`.
