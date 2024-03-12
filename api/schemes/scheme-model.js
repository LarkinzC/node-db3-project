const db = require('../../data/db-config')

function find() { // EXERCISE A
 return db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
  .select('sc.*')
  .count('st.step_id as number_of_steps')
  .groupBy('sc.scheme_id')
}

async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
  */
      const rows = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .select('st.*', 'sc.scheme_name', 'sc.scheme_id')
      .orderBy('st.step_number')
      

      const result = {
        scheme_id: rows[0].scheme_id,
        scheme_name: rows[0].scheme_name,
        steps: []
      }


      rows.forEach(row => {
        if(row.step_id) {
          result.steps.push(
            {
              step_id: row.step_id,
              step_number: row.step_number,
              instructions: row.instructions

            }
          )
        }
      })
      return result
}

async function findSteps(scheme_id) { // EXERCISE C
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'instructions', 'scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')

  
    if(!rows[0].step_id) return []
  return rows

}
function add(scheme) { // EXERCISE D
  return db('schemes')
    .insert(scheme)
      .then(([scheme_id]) => {
        return db('schemes').where('scheme_id', scheme_id).first()
      })
}

function addStep(scheme_id, step) { // EXERCISE E
  
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
