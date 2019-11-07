## Continuous Integration

CI-ისთვის ვიყენებთ სრულად გუგლის სერვისებს კერძოდ
Google cloud build-ს https://cloud.google.com/cloud-build/
რომელიც ატრიგერებს ბრენჩის მიხედვით კოდ კომიტს და უშვებს ბილდის პროცესს.

თუმცა სანამ რეპოზიტორიზე რაიმე დაკომიტტდება მანამდე ლოკალურად დეველოპერებთან 
ეშვება პრე კომიტების ჩეკი husky -ის გამოყენებით https://github.com/typicode/husky


პროცესი გამოიყურება შემდეგნაირად:

### CI flow 
<img src="https://www.dropbox.com/s/xce249w60yihi4i/ci.png?raw=1">





