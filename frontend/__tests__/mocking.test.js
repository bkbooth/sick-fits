function Person(name, foods) {
  this.name = name
  this.foods = foods
}
Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve) => {
    // simulate an API
    setTimeout(() => resolve(this.foods), 2000)
  })
}

describe('mocking learning', () => {
  it('mocks a regular function', () => {
    const fetchDogs = jest.fn()
    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snickers')
    fetchDogs('hugo')
    expect(fetchDogs).toHaveBeenCalledTimes(2)
  })

  it('can create a person', () => {
    const me = new Person('Fred', ['pizza', 'donuts'])
    expect(me.name).toEqual('Fred')
  })

  it('can fetch a Persons fav foods', async () => {
    const me = new Person('Fred', ['pizza', 'donuts'])
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen'])
    const favFoods = await me.fetchFavFoods()
    expect(favFoods).toContain('sushi')
  })
})
