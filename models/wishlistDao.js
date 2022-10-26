const appDataSource = require('./dataSource');

const createWishlist = async (userId, productId) => {
  const insertWishlist = await appDataSource.query(`
    INSERT INTO wishlists 
    (
      user_id,
      product_id
    ) 
    SELECT ${userId}, ${productId}
    WHERE NOT EXISTS
    (
      SELECT id FROM wishlists
      WHERE user_id=${userId} AND product_id=${productId}
    )`,
  );

  if (insertWishlist.affectedRows === 0) {
    const error =new Error('FAILED');
    error.statusCode = 400;
    throw error;
  }
  return insertWishlist;
}

const getWishlistByUserId = async (userId) => {
  const result = await appDataSource.query(`
    SELECT
      w.user_id AS userId,
      p.id AS productId,
      p.name,
      p.price,
      p.thumbnail_image_url AS thumbnailUrl
    FROM wishlists AS w
    JOIN users AS u ON w.user_id = u.id
    JOIN products AS p ON w.product_id = p.id
    WHERE w.user_id = ?`, 
    [userId]
  );
  return result;
}

const deleteWishlist = async (userId, productId) => {
  const deleteRows = await appDataSource.query(`
    DELETE FROM wishlists
    WHERE user_id=? AND product_id=?`,
    [userId, productId]
  );

  return deleteRows;
}

module.exports = {
  createWishlist,
  getWishlistByUserId,
  deleteWishlist
}