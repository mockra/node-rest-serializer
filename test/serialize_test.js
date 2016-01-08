var serialize = require('..')
var chai = require('chai')
var expect = chai.expect

describe('serialize', function () {
  beforeEach(function () {
    this.comments = [{tp: 3, content: 'test comment', author: 'Winter'},
      {tp: 78, content: 'test'}]
    this.posts = [{id: 1, title: 'test post', comments: this.comments}]
    this.users = [{name: 'Winter', password: 'foobar', posts: this.posts},
      {name: 'Max', password: 'test'}]
  })

  it('deletes unwanted keys', function (done) {
    var output = serialize('users', this.users, { without: ['password'] })
    expect(output.users).to.have.length(2)
    expect(output.users[0].password).to.not.exist
    expect(output.users[0].name).to.eq('Winter')
    expect(output.users[1].password).to.not.exist
    done()
  })

  it('sideloads data', function (done) {
    var output = serialize('users', this.users, { sideload: [{name: 'posts'}] })
    expect(output.users).to.have.length(2)
    expect(output.posts).to.have.length(1)
    expect(output.users[0].posts[0]).to.eq(1)
    expect(output.posts[0].title).to.eq('test post')
    done()
  })

  it('handles without for sideloaded data', function (done) {
    var output = serialize('users', this.users, {
      sideload: [{name: 'posts', without: 'title'}] })
    expect(output.posts).to.have.length(1)
    expect(output.posts[0].title).to.not.exist
    done()
  })

  it('handles nested sideloaded data', function (done) {
    var output = serialize('users', this.users, {
      sideload: [{name: 'posts', without: 'title',
        sideload: [{name: 'comments', without: 'content', key: 'tp'}]}] })
    expect(output.posts).to.have.length(1)
    expect(output.posts[0].comments[0]).to.eq(3)
    expect(output.posts[0].comments[1]).to.eq(78)
    expect(output.comments).to.have.length(2)
    expect(output.comments[0].content).to.not.exist
    expect(output.comments[0].author).to.eq('Winter')
    done()
  })
})
