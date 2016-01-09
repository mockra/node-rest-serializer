## Node Rest Serializer

#### Install

```
  npm install rest-serializer --save
```

#### Usage

Here's a basic example of serializing an array of post objects with their
comments included.

```
  serialize('posts', { sideload: [{ name: 'comments' }] })

  // output
  { posts: [ { title: 'test post', comments: [24] } ],
    comments: [ { id: 24, content: 'hello world' } ] }
```

You can also specify to delete specific attributes from your objects. Here's an
example with users.

```
  var users = [{email: 'test@example.com', password: 'foobar'}]
  serialize('users', { without: 'password' })
  serialize('users', { without: ['password', 'token'] })

  //output
  {users: [{email: 'test@example.com']}
```

If you're side loading a singular association, such as a user that belongs to a
post, then you need to specify the plural version. Here's an example:

```
  var user = {id: 2, email: 'test@example.com'}
  var post = {title: 'test post', user: user}
  serialize('post', post, { sideload: 'user', plural: 'users' })

  //output
  { post: { title: 'test post', user: 2 },
    users: [{id: 2, email: 'test@example.com'}] }
  
```

#### Advanced Usage

Here's an example with a more complex use case.

```
  serialize('users', { without: 'password',
    sideload: [{name: 'posts', key: 'pid', without: 'author',
    sideload: [{name: 'comments', key: 'cid', without: 'author'}] }] })

  //output
  { users: [{email: 'test@example.com', posts: [1, 2]}],
    posts: [{pid: 1, comments: [1]}, {pid: 2, comments: [1, 2]}],
    comments: [{cid: 1}, {cid: 2}] }
```

In this example, we're serializing a users array, but including the related
posts and post comments. Since the primary key for these records isn't `id`, we
specify a key. This key is used to generate the id array that ties the
side loaded posts and comments to their parent.
