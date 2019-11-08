

## სამუშაო პროცესის გაიდლანები (მითითებები)

# ბექენდი appDomain-back
================================

ბექის გასაშვებად ვიყნებთ ```node.js v10.15.2``` ვერსიას. 
node.js ვერსიის მენეჯმენტი განისზაღვრება ```NVM (Node Version Manager)``` - ის მეშვეობით

node.js ვერსიის განსზაღვრა ხდება ```.nvmrc``` ფაილში რომელიც მდებაროებს პროექტის ```appDomain-back``` რუთ დირექტორიაში

პროექტის გასაშვებად საჭიროა თავდაპირევლად დავაყენოთ NVM 

https://github.com/nvm-sh/nvm

ინსტალაცია : ```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash```

ლოკალურ გარემოში მუშაობის დროს რადგან შესაძლებელია გვყენოს 2 ან მეტის ნოდის ვერსია 
და ჩვენც რომ დავრწმუნდეთ რომ პროექტში დევლეოპმენტის დროს ვიმყოფებით სასრუველ ნოდის ვერსიაზე აუცილებელია მოვახდინოთ [Deeper Shell Integration](https://github.com/nvm-sh/nvm#deeper-shell-integration)


## წინასწარ შეთანხმებული კოდის ფორმატი და სტილი .EditorConfig 

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





