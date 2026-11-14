# InternUp Backend
Node.js + Express 5 Prisma ORM MySQL (XAMPP)
(porta 3306).

npm run dev               # http://localhost:4000/api

Databaza shihet te phpMyAdmin → `internup`  Adresa o http://localhost/phpmyadmin(p.sh. http://localhost:8888/phpmyadmin).


## Endpoints
Baza: `http://localhost:4000/api`
| GET | `/health` 
| GET | `/home` 
| GET | `/home/stats` | `homeUseCases.getPlatformStats` |
| GET | `/home/partner-companies?limit=6` | `homeUseCases.getPartnerCompanies` |
| GET | `/home/search-options`  | `homeUseCases.getSearchOptions` |
| GET | `/home/internships?position=&location=`  | `homeUseCases.searchInternships` |
| GET | `/home/universities?limit=6` |  | `universityUseCases.listUniversities` |
| GET | `/home/stories?limit=3` |

