# ტესტები

## Basic example

გვაქვს მოცემული ტესტის მარტივი მაგალითი.

მაგალითი :

    describe('Todo', () => {
      before(async function () {
        await db.TodoModel.deleteOne({ title: todo.title })
      })

      describe('Create Todo', () => {
        /**
        * @method mutation
        * @path createTodo
        */
        it('Should create todo', done => {
          generateGraphql({
            done,
            gql: 'createTodo',
            method: 'mutation',
            params: { title: todo.title },
            token: state.get('token')
          })
        })
    })

- ტესტის აღწერა <code>describe('Todo')</code>
- სანამ გაეშვება ტესტი ეშვება <code>before()</code> მაგალითის შემთხვევაში ვშლით უკვე არსებულ Todo - ს
- შემდეგი აღვწერთ <code>describe('Create Todo')</code> - რომელშიც ვათავსებთ ტესტს <code>it('Should create todo')</code>
- <code>generateGraphql()</code> - ში ვწერთ ყველა იმ პარამეტრს და კონფიგურაციას რაც გვჭირდება კონკრეტული ქმედების გასატესტად.

როგორც <code>before()</code>  ასევე გვაქვს <code>after()</code> - მეთოდი, რომლებიც შეიძლება იქნას მოთავსებული, ტესტის Top Level - ზე <code>describe('Todo')</code> - ში.
ქმედების აღწერაში <code>describe('Create Todo')</code> 

ჩვენს მაგალითში ვადოკუმენტირებთ ტესტის მეთოდს:

<code>@method mutation</code> 

და graphql - ის ფაილის დასახელებას :

<code>@path createTodo</code> 

    /**
    * @method mutation
    * @path createTodo
    */

### generateGraphql() - მეთოდის პარამეტრების აღწერა:

- gql: 'createTodo' - Graphql ფაილის დასახელება.
- method: 'mutation' - მეთოდი mutation / query - ამით ვუთითებთ რომელ ფოლდერიდან წამოიღოს ფაილი mutation / query
- params: { title: todo.title } - record - პარამეტრები.
- auth: false - Default მნიშვნელობა არის true, ამით ვეუბნებით ავტორიზაცია უნდა იყოს თუ არა გავლილი.
- shouldError: true - ველოდებით თუ არა რამე შეცდომას
- status: 500 - რა სტატუს კოდს ველოდებით, ასევე შეგვიძლია გადავაწოდოთ array [400, 404] - რომელიც გვეუბნებ ან 400 ან 404 სტატუსი უნდა დაბრუნდეს
- state: { token: 'accessToken } - ვინახავთ დაბრუნებულ მონაცემს state - ში, რომლის გამოყენება შეიძლება state.get('token') ის მეშვეობით, ასევე state.set('token') - დასეტვა.
- debug: true - Default მნიშვნელობა არის false, true - შემთხვევაში ირთვება კონკრეტულ ტესტზე debug mode.
- end: (result) => {} - ტესტის დასრულების შემდეგ სხვა ოპერაციის განსახორციელებლად გამოიყენება end - პარამეტრი <code>end: (result) => {}</code>  რომელიც აბრუნებს კონკრეტული ტესტის result - ს

      /**
        * @method mutation
        * @path createTodo
        */
        it('Should create todo', done => {
          generateGraphql({
            done,
            gql: 'createTodo',
            method: 'mutation',
            params: { title: todo.title },
            token: state.get('token'),
            end: async (result) => {
              <!-- Any action -->
              done()
            }
          })
        })

გასათვალისწინებელია ის, რომ done() მეთოდი აუცილებლად უნდა იქნას გამოძახებული <code>end: (result) => { done() }</code> - ში, იმისთვის, რომ იქნას დასრულებული ტესტი.

ტესტის დასრულების შემდეგ update - ის შემთხვევაში შემოწმება ხდება

- check: {} - პარამეტრი, რომელიც შეიცავს ობიექტს, რომლის key არის დაბრუნებული data, მაგალითის შემთხვევაში data.updateTodo და მნიშვნელობა data.updateTodo.title type - რა ტიპის მნიშვნელობაა value დაბრუნებული data.updateTodo.title თუ უდრის state - ში, ჩასეტილ მნიშვნელობას state.get('title')

      check: {
        'data.updateTodo.title': { 
          type: 'String', // მნიშვნელობის ტიპი
          value: state.get('title')  // მნიშვნელობა
        }
      }

### REST API Test

მაგალითი :

    describe('Todo', () => {
      before(async function () {
        await db.TodoModel.deleteOne({ title: todo.title })
      })

      describe('Create Todo', () => {
        /**
        * @method post
        * @route /api/v1/todos/create-todo
        */
        it('Should create todo', done => {
          generate({
            done,
            route: '/api/v1/todos/create-todo',
            method: 'post',
            params: { title: todo.title },
            token: state.get('token')
          })
        })
    })

GraphQL - ის და REST API - ის შორის 3 სხვაობაა

- generateGraphql: GraphQL - ის ტესტი, generate: REST API - ის ტესტი,
- method: GraphQL ( query / mutation ), REST ( post / get )
- GraphQL: gql: createTodo, REST: route: '/api/v1/todos/create-todo'
