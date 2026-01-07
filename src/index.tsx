import { Hono } from 'hono'
import { games } from './routes/games'
import { movies } from './routes/movies'

const app = new Hono()

// Root route to prevent 404
app.get('/', (c) => c.text('Hono Worker is running!'))

// Mount routes
app.route('/games', games)
app.route('/movies', movies)

// Optional: handle favicon
app.get('/favicon.ico', (c) => c.text(''))

export default app
