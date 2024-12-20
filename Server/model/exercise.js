/** @type {{ exercises: Exercise[] }} */
const data = require("../data/exercises.json");
const { getConnection } = require("./supabase");
const conn = getConnection();

/**
 * @template T
 * @typedef {import("../../Client/src/models/dataEnvelope").DataEnvelope} DataEnvelope
 * @typedef {import("../../Client/src/models/dataEnvelope").DataListEnvelope} DataListEnvelope
 */

/**
 * @typedef {import("../../Client/src/models/exercise").Exercise} Exercise
 */

/**
 * Get all exercises
 * @returns {Promise<DataListEnvelope<Exercise>>}
 */
async function getAll() {
    const { data, error, count } = await conn
        .from("exercises")
        .select("*", { count: "estimated" }) //* means get all the data in that field
        .order('id', { ascending: true }); // Ensure the exercises are sorted by id in ascending order
    return {
        isSuccess: !error,
        message: error?.message,
        data: data,
        total: count,
    };
}

/**
 * Get an exercise by id
 * @param {number} id
 * @returns {Promise<DataEnvelope<Exercise>>}
 */
async function get(id) {
    const { data, error } = await conn
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();
    return {
      isSuccess: !error,
      message: error?.message,
      data: data,
    };
  }



async function search(query){
    const { data, error, count } = await conn
      .from("exercises")
      .select("*", { count: "estimated" })
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%`
      );
    return {
        isSuccess: !error,
        message: error?.message,
        data: data,
        total: count,
    };
}



async function add(exercise) {
    try {
        const { data, error } = await conn
          .from('exercises')
          .insert([exercise])
          .select();  // Ensure the inserted data is returned
    
        if (error) {
          console.error("Error adding exercise:", error.message);
          throw error;
        }
    
        if (!data || data.length === 0) {
          const errorMessage = "No data returned from insert operation";
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
    
        return {
          isSuccess: true,
          data: data[0],
        };
      } catch (err) {
        console.error("Unexpected error in add function:", err);
        throw err;
      }
}

/**
 * Update an exercise
 * @param {number} id
 * @param {Exercise} exercise
 * @returns {Promise<DataEnvelope<Exercise>>}
 */
async function update(id, exercise) {
    try {
        // Check if the record exists
        const { data: getData, error: getError } = await conn
            
            .from('exercises')
            .select('*')
            .eq('id', id)
            .single();

        if (getError) {
            console.error('Error fetching exercise:', getError);
            throw new Error('Exercise not found');
        }

        // Perform the update
        const { data, error } = await conn
            .from('exercises')
            .update(exercise)
            .eq('id', id)
            .select(); // Ensure the updated data is returned

        if (error) {
            console.error('Error updating exercise:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            const errorMessage = 'Update failed or no data returned';
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        return {
            isSuccess: true,
            data: data[0],
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
}

/**
 * Remove an exercise
 * @param {number} id
 * @returns {Promise<DataEnvelope<number>>}
 */
async function remove(id) {
    const { data, error } = await conn
        .from('exercises')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }

    return {
        isSuccess: true,
        message: "Exercise deleted",
        data: id,
    };
}

module.exports = {
    getAll,
    get,
    add,
    update,
    remove,
    search,
};