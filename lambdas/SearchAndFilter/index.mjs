import { createPool, checkToken } from '/opt/nodejs/db/pool.mjs'; 

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
        ((b.store_page_rating >= ? AND b.store_page_rating <= ?) OR 
        b.store_page_rating = 0)`
    ;
    let search = async (search, filters, page, email, context) => {
        let countQuery = 
        `SELECT COUNT(*) as total 
        FROM BoardGame b ${filterQuery}`; 

        let joinClause = '';
        let extraSelects = 'FALSE AS owned, 0 AS quantity';
        let searchFilterParams = [
            `%${search || ''}%`, `%${search || ''}%`,
            filters.minAge, filters.maxAge,
            filters.minPlayers, filters.maxPlayers,
            filters.minYear, filters.maxYear,
            filters.minPlaytime, filters.maxPlaytime,
            filters.minBGGScore, filters.maxBGGScore,
            filters.minStoreScore, filters.maxStoreScore
        ];
        let params = [...searchFilterParams];

        if (email) {
            // Include LEFT JOIN to mark owned games
            joinClause = `
                LEFT JOIN Owned o 
                    ON b.id = o.fk_board_game_id 
                    AND o.fk_email = ?
                LEFT JOIN (
                    SELECT 
                        tl.fk_board_game_id, 
                        SUM(tl.quantity) AS quantity
                    FROM BG_Transaction t
                    JOIN TransLines tl ON t.id = tl.fk_transaction_id
                    WHERE t.fk_account_email = ?
                    GROUP BY tl.fk_board_game_id
                ) t2 ON b.id = t2.fk_board_game_id
            `;
            extraSelects = `
                (o.fk_email IS NOT NULL) AS owned,
                COALESCE(t2.quantity, 0) AS quantity
            `;
            params.unshift(email, email); // add email at start for join
        }
        let libraryWhere = '';
        if (context === 'library') {
            libraryWhere = 'HAVING owned = 1 OR quantity > 0';
        }

        let searchQuery = `
            SELECT b.*, ${extraSelects} FROM BoardGame b
            ${joinClause}
            ${filterQuery} 
            ${context === "store" ? 'LIMIT 12 OFFSET ?' : ''}
            ${libraryWhere}`; 
            
        params.push((page - 1) * 12);
        try { // Run both queries in parallel 
            const [searchResults, countResults] = await Promise.all([ 
                new Promise((resolve, reject) => { 
                    pool.query(searchQuery, params, (err, rows) => {
                        if (err) return reject(err); resolve(rows); 
                    }); 
                }), 
                new Promise((resolve, reject) => { 
                    pool.query(countQuery, searchFilterParams, (err, rows) => { 
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
        let account = null;
        if (event.token) {
            try {
                account = await checkToken(event.token);
            } catch (err) {
                console.warn("Invalid or missing token, treating as guest:", err);
                account = null; // guest user
            }
        }

        // Pass email if account exists
        const email = account?.email || null;

        let gameResults = await search(event.search, event.filters, event.page, email, event.context); 
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
