## InvoiceWave

## სარჩევი
  * [სამუშაო პროცესის გაიდლაინები. დეველოპმეტნის გარემო](docs/WorkingGuidlines.md)
  * [Git flow გიტთან მუშაობის გაიდლაინი](docs/git.md)
  * [CI - Continuous Integration ](docs/ci.md)
  * [მოდულები & არქიტექტურა](docs/architecture.md)
  * [ინვოისები](docs/INVOICES.md)
  * [ტესტები](docs/TESTS.md)


#### Scripts
``` npm run start:local``` უშვებს ლოკალურ ბაზაზე დეველოპმენტის პარამეტრებით აპლიკაციას

``` npm run start:testing``` უშვებს ლოკალურ ბაზაზე სატესტო პარამეტრებით აპლიკაციას

``` npm run socket``` უშვებს ლოკალურად სოკეტის სერვერს

``` npm run start:devDocker``` პროექტის დოკერით დასტარტვა

``` npm run agenda:local``` უშვებს ლოკალურად აჯენდას სერვის, რომელიც პირობების მიხედვით უშვებს სხვადასხვა ლოგიკებს

#### Generate API documentation
``` npm run apidoc``` აპის დოკუმენტაციის რედაქტირება

``` npm run swagger``` აპის დოკუმენტაციის რედაქტირება (swagger)

##### TBC Commands:
``` npm run tbc:import-transactions``` თბს_იდან სატესტო ტრანზაქციების იმპორტი

``` npm run tbc:create-batch-payments``` თბს_იდან სატესტო ტრანზაქციების იმპორტი

``` npm run tbc:renew-invoices-status``` თბს_იდან დაიპორტებული ტრანქციქციების და ინვოისის სტატუსების მეჩინგის სერვისის გაშვება

``` npm run ufc:service``` Ufc სერვისის გაშვება

##### RS:Ge Commands:
``` npm run rs:service``` თბს_იდან სატესტო ტრანზაქციების იმპორტი

``` npm run rs:import-error-codes``` თბს_იდან სატესტო ტრანზაქციების იმპორტი

``` npm run rs:save-waybill``` თბს_იდან სატესტო ტრანზაქციების იმპორტი

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


## Data flow

<img src="https://www.dropbox.com/s/9awsykzfpbpoijn/inwoicewavearhictecture.png?raw=1">
