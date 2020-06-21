exports.seed = async function (knex) {
  try {
    await knex('footnotes').del() // delete all footnotes first
    await knex('papers').del() // delete all papers

    // Now that we have a clean slate, we can re-insert our paper data
    // Insert a single paper, return the paper ID, insert 2 footnotes
    const paperId = await knex('papers').insert({
      title: 'Fooo', author: 'Bob', publisher: 'Minnesota'
    }, 'id')
    return knex('footnotes').insert([
      { note: 'Lorem', paper_id: paperId[0] },
      { note: 'Dolor', paper_id: paperId[0] }
    ])
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
  }
}
