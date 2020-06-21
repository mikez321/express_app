// setup only

const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Express Yourself';
app.use(express.json());

// startup message
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

// get route for all papers
app.get('/api/v1/papers', async (request, response) => {
  try {
    const papers = await database('papers').select();
    response.status(200).json(papers);
  } catch(error) {
    response.status(500).json({ error });
  }
});

// get route for all footnotes
app.get('/api/v1/footnotes', async (request, response) => {
  try {
    const footnotes = await database('footnotes').select();
    response.status(200).json(footnotes);
  } catch(error) {
    response.status(500).json({ error });
  }
});

// create a new paper
app.post('/api/v1/papers', async (request, response) => {
  const paper = request.body;

  for (let requiredParameter of ['title', 'author']) {
    if (!paper[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  try {
    const id = await database('papers').insert(paper, 'id');
    response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({ error });
  }
});

// create new footnotes for an existing paper
app.post('/api/v1/footnotes', async (request, response) => {
  const footnote = request.body;

  for (let requiredParameter of ['note', 'paper_id']) {
    if (!footnote[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { note: <String>, paper_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  try {
    const id = await database('footnotes').insert(footnote, 'id');
    response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({ error });
  }
});

// look up paper by paper id
app.get('/api/v1/papers/:id', async (request, response) => {
  try {
    const papers = await database('papers').where('id', request.params.id).select();
    if (papers.length) {
      response.status(200).json(papers);
    } else {
      response.status(404).json({
        error: `Could not find paper with id ${request.params.id}`
      });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});

// look up footnotes by footnote id
app.get('/api/v1/footnotes/:id', async (request, response) => {
  try {
    const footnotes = await database('footnotes').where('id', request.params.id).select();
    if (footnotes.length) {
      response.status(200).json(footnotes);
    } else {
      response.status(404).json({
        error: `Could not find footnotes with id ${request.params.id}`
      });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
});
