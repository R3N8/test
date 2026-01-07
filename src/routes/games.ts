import { Hono } from 'hono'
import type { Game } from '../types/game'
import { gameList } from '../data/games.data'

export const games = new Hono()

// GET /games with query params
games.get('/', (c) => {
  let result: Game[] = [...gameList]

  const genre = c.req.query('genre')
  const maxPrice = c.req.query('maxPrice')
  const year = c.req.query('year')
  const sort = c.req.query('sort')

  if (genre) result = result.filter(g => g.genre === genre)
  if (maxPrice) {
    const price = Number(maxPrice)
    if (isNaN(price)) return c.json({ error: 'maxPrice must be a number' }, 400)
    result = result.filter(g => g.price <= price)
  }
  if (year) {
    const y = Number(year)
    if (isNaN(y) || y < 1900 || y > 2024)
      return c.json({ error: 'Invalid year' }, 400)
    result = result.filter(g => g.releaseYear === y)
  }
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)

  return c.json(result)
})

// GET /games/:id
games.get('/:id', (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

  const game = gameList.find(g => g.id === id)
  if (!game) return c.json({ error: 'Game not found' }, 404)

  return c.json(game)
})

// GET /games/genre/:genre
games.get('/genre/:genre', (c) => {
  const genre = c.req.param('genre')
  const filtered = gameList.filter(g => g.genre === genre)
  return c.json(filtered)
})
