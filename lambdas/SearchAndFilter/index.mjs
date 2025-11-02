import { createPool } from '/opt/nodejs/db/pool.mjs'; 

export const handler = async (event) => { 
    let pool; 
    try { pool = await createPool(); } 
    catch (error) { 
        console.error("Failed to create MySQL Pool. Error: " + JSON.stringify(error)); 
        return { statusCode: 500, error: "Could not make database connection" }; 
    } 
    let filterQuery = 
        `WHERE (LOWER(b.name) LIKE LOWER(?) OR 
        LOWER(b.description) LIKE LOWER(?)) AND 
        b.min_age >= ? AND b.min_age <= ? AND 
        b.min_players >= ? AND b.max_players <= ? AND 
        b.year_published >= ? AND b.year_published <= ? AND 
        b.min_play_time >= ? AND b.max_play_time <= ? AND 
        b.bayes_average_user_score >= ? AND b.bayes_average_user_score <= ? AND 
        (b.store_page_rating >= ? AND b.store_page_rating <= ? OR 
        b.store_page_rating = 0)`
    ;
    let search = async (search, filters, page) => {
        let searchQuery = `
            SELECT * FROM BoardGame b 
            ${filterQuery} 
            LIMIT 10 OFFSET ?`; 
            
        let countQuery = 
            `SELECT COUNT(*) as total 
            FROM BoardGame b ${filterQuery}`; 
        
        const searchTerm = `%${search || ''}%`; 
        const params = [ searchTerm, searchTerm, // name and description 
            filters.minAge, filters.maxAge, 
            filters.minPlayers, filters.maxPlayers, 
            filters.minYear, filters.maxYear, 
            filters.minPlaytime, filters.maxPlaytime, 
            filters.minBGGScore, filters.maxBGGScore, 
            filters.minStoreScore, filters.maxStoreScore, 
            (page - 1) * 10 // OFFSET 
        ];
        try { // Run both queries in parallel 
            const [searchResults, countResults] = await Promise.all([ 
                new Promise((resolve, reject) => { 
                    pool.query(searchQuery, params, (err, rows) => {
                        if (err) return reject(err); resolve(rows); 
                    }); 
                }), 
                new Promise((resolve, reject) => { 
                    pool.query(countQuery, params.slice(0, -1), (err, rows) => { 
                        if (err) return reject(err); resolve(rows); 
                    });
                }) 
            ]); 
            return { searchResults, totalCount: countResults[0].total }; 
        } 
        catch (error) { 
            console.error("Search error:", error); 
            return { searchResults: [], totalCount: 0 }; 
        } 
    };

    let response; 
    try { 
        let gameResults = await search(event.search, event.filters, event.page); 
        console.log(gameResults.searchResults.map(item => item.name)); 
        console.log(gameResults.searchResults.length); 
        response = { 
            statusCode: 200, 
            body: { 
                total_games: gameResults.totalCount, 
                games: gameResults.searchResults
            }, 
        } 
    } catch (err) { 
        response = { statusCode: 400, error: err }; 
    } finally { pool.end(); } 
    return response; 
};