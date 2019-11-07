# InvoiceWave

## სარჩევი
  * [Scripts](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#scripts)
  * [Docker](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#docker)
  * [GraphQL](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#graphql-api-endpoints--interface)
  * [REST interface & Swagger](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#api-endpoints--swagger-interface)
  * [Data flow](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#data-flow)
  * [სამუშაო პროცესის გაიდლაინები. დეველოპმეტნის გარემო](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#%E1%83%A1%E1%83%90%E1%83%9B%E1%83%A3%E1%83%A8%E1%83%90%E1%83%9D-%E1%83%9E%E1%83%A0%E1%83%9D%E1%83%AA%E1%83%94%E1%83%A1%E1%83%98%E1%83%A1-%E1%83%92%E1%83%90%E1%83%98%E1%83%93%E1%83%9A%E1%83%90%E1%83%9C%E1%83%94%E1%83%91%E1%83%98-%E1%83%9B%E1%83%98%E1%83%97%E1%83%98%E1%83%97%E1%83%94%E1%83%91%E1%83%94%E1%83%91%E1%83%98)
  * [Git flow გიტთან მუშაობის გაიდლაინი](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#git-guidlines)
  * [CI - Continuous Integration ](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#continuous-integration)
  * [მოდულები & არქიტექტურა](https://github.com/btomashvili/invoicewave-back/blob/develop/docs/READMEALL.md#architecture--models)



#### Scripts
``` npm run start:local``` უშვებს ლოკალურ ბაზაზე დეველოპმენტის პარამეტრებით აპლიკაციას

``` npm run start:testing``` უშვებს ლოკალურ ბაზაზე სატესტო პარამეტრებით აპლიკაციას

``` npm run socket``` უშვებს ლოკალურად სოკეტის სერვერს

``` npm run start:devDocker``` პროექტის დოკერით დასტარტვა

``` npm run agenda:local``` უშვებს ლოკალურად აჯენდას სერვის, რომელიც პირობების მიხედვით უშვებს სხვადასხვა ლოგიკებს

#### Generate API documentation
``` npm run apidoc``` აპის დოკუმენტაციის რედაქტირება

``` npm run swagger``` აპის დოკუმენტაციის რედაქტირება (swagger)


##### Other commands:
``` npm run lint``` Eslint error check

``` npm run seed:users``` სატესტო იუზერების შევსება ბაზაში

``` npm run seed:plans``` სატესტო პლენების შევსება ბაზაში

## Docker
``` docker-compose -f docker-compose.app.yml up --build``` მხოლოდ სერვერის გაშვება (ვორკერის და სოკეტის გარეშე) debugger-თან ერთად (ბილდის შემდეგ ვუშვებთ --build ფლაგის გარეშე)

``` docker-compose up --build ``` პირველი გაშვების დროს ვწერთ ამ კომანდს (იგივე დირექტორიაში სადაც არის docker-compose.yml)

``` docker-compose up ``` პროექტის დასტარტვა

## GrapHQL API endpoints & Interface

GraphQL ინტერფესი ```https://api-dev.invoicewave.com/graphql```
თითოეული მოდელის, მუტაციებს და "Query" -ს გააჩნია თავისი აღწერები თითოეული
ფილდის დონეზე.
იხილეთ სქრინი:

<img src="https://www.dropbox.com/s/zuiyj0y3tokwkv7/graphql.png?raw=1">

## API endpoints & Swagger Interface

პლატფორმას გააჩნია როგორც GraphQL ის მხარდაჭერა ასევე REST ინტერფეისი.
რესტის ინტერფეისის როუტები შეგიძლია იხილოთ შემდეგ მისამართზე. https://api-dev.invoicewave.com/api-docs/
ამ ეტაპზე swagger api გენერირდება ავტომატურად პროექტის ენდპოინტების მიხედვით.
თუმცა არ არის დასრულებული დოკუმენტაცია და სვაგერის ვებ ინტერფეისიდან პარამეტრების გადაცემა ამ ეტაპზე არ მუშაობს.

<img src="https://www.dropbox.com/s/hlxc0nc18mno6ma/swagger.png?raw=1">


## Google infostructure, Scalability & Data flow

<img src="https://www.dropbox.com/s/9awsykzfpbpoijn/inwoicewavearhictecture.png?raw=1">


# სამუშაო პროცესის გაიდლანები (მითითებები)

### ბექენდი invoicewave-back
================================

ბექის გასაშვებად ვიყნებთ ```node.js v10.15.2``` ვერსიას.
node.js ვერსიის მენეჯმენტი განისზაღვრება ```NVM (Node Version Manager)``` - ის მეშვეობით

node.js ვერსიის განსზაღვრა ხდება ```.nvmrc``` ფაილში რომელიც მდებაროებს პროექტის ```invoicewave-back``` რუთ დირექტორიაში

პროექტის გასაშვებად საჭიროა თავდაპირევლად დავაყენოთ NVM

https://github.com/nvm-sh/nvm

ინსტალაცია : ```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash```

ლოკალურ გარემოში მუშაობის დროს რადგან შესაძლებელია გვყენოს 2 ან მეტის ნოდის ვერსია
და ჩვენც რომ დავრწმუნდეთ რომ პროექტში დევლეოპმენტის დროს ვიმყოფებით სასრუველ ნოდის ვერსიაზე აუცილებელია მოვახდინოთ [Deeper Shell Integration](https://github.com/nvm-sh/nvm#deeper-shell-integration)


### წინასწარ შეთანხმებული კოდის ფორმატი და სტილი .EditorConfig

იმისათვის რომ გუნდმა შეინარჩუნოს საერთოდ სტილი რომელიც დამოკიდებული არ იქნება
რომელიმე კონკრეტულ IDE ზე ან კოდის ედიტორზე. შემოგვაქვს .editorConfig
ფაილი რაც უზრნველყოფს საერთო განსაზღვრულ სტილზე შეთანხმებას.
   * მეტის სიცხადისთვის რა არის .editorConfig სტილი https://editorconfig.org/

.editorConfig ასევე გვაქვს რუთ დირექტორიაში

```
# http://editorconfig.org

# top-most EditorConfig file
root = true

[*]
charset = utf-8
indent_style = spaces
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

```

## გარემოს პარამეტრები და სტანდარტები .ESLint

პროექტში სამუშაოდ მკაცრად ვიყენებთ .eslint-ის წესებს და მითითებებს რომელიც განკუთვნილია
აღმოფხვრას და აღმოაჩინოს კოდში გარკვეული დეფექტები ასევე მიგვითითოს პრობლემურ კოდის ფრაგმენტებზე.
უფრო ვრცლად eslint ის შესახებ იხილეთ https://eslint.org/docs/about/

სრული ბედნიერებისთვის და ავტომატიზაციისთვის საჭიროა დავაყენოთ .eslint გაფართოება
VS Code ში ეს არის https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

პროექტის (Workspace) სეტინგების ფაილში აუცილებელია ჩართული იყოს ```  "eslint.enable" : true ```
პროექტში გამოყენებულია სტანდარტული .eslint წესები. წესების კონფიგურირება და პარამეტრების გადაფარვა ხდება
```.eslint``` ფაილიდან.

შენიშვნა: ``` .eslintignore ``` ფაილში ჩამოწერილი დირექტორიებზე არ ვრცელდება .eslint წესები


# Git Guidlines

- New feature branches ```feature/new-feature```
- Hotfix branch ```hotfix/bug-name```
- Release branch ``` release/new_release_name```

- მუშაობა SourceTree მეშვეობით https://zellwk.com/blog/git-flow/

### Semantic commits

კომიტების მესიჯებისთვის ვიყენებთ სემანტიკურ კომიტებს იხილეთ მაგალითები:

```
chore: add Oyster build script
docs: explain hat wobble
feat: add beta sequence
fix: remove broken confirmation message
refactor: share logic between 4d3d3d3 and flarhgunnstow
style: convert tabs to spaces
test: ensure Tayne retains clothing
```


- [Git flight rules](https://github.com/vobi-io/git-flight-rules)

#### პროცესის აღწერა დიაგრამა

<img src="https://www.dropbox.com/s/216vn3hhfxszxge/gitflow.png?raw=1">


# Continuous Integration

CI-ისთვის ვიყენებთ სრულად გუგლის სერვისებს კერძოდ
Google cloud build-ს https://cloud.google.com/cloud-build/
რომელიც ატრიგერებს ბრენჩის მიხედვით კოდ კომიტს და უშვებს ბილდის პროცესს.

თუმცა სანამ რეპოზიტორიზე რაიმე დაკომიტტდება მანამდე ლოკალურად დეველოპერებთან
ეშვება პრე კომიტების ჩეკი husky -ის გამოყენებით https://github.com/typicode/husky


პროცესი გამოიყურება შემდეგნაირად:

### CI flow
<img src="https://www.dropbox.com/s/xce249w60yihi4i/ci.png?raw=1">


## Architecture & Models

მონაცემთა ბაზის მოდელები (მონგოს სქემები) შეგიძლიათ იხოლოთ შემდეგ დირექტორიაში ფაილების სახით
```src/modules/<ModelName.js>```
თვითოეულ მოდულის დირექტორიას გააჩნია მისთვის განკუთვნილი სქემა

#### UML სქემა

<img src="https://www.dropbox.com/s/9l1dhvsnxy54t3g/models.png?raw=1">

