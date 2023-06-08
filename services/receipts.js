const db = require('./db');
const helper = require('../helpers/main.js');
const uiConfig = require('../config/ui')

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, uiConfig.listPerPage);
  const rows = await db.query(
    `SELECT id, title, ingredients, text, img_url 
    FROM receipts LIMIT ${offset},${uiConfig.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(receipt){
  const result = await db.query('INSERT INTO receipts (title, ingredients, text, img_url) VALUES (:title, :ingredients, :text, :img_url)', receipt);

  let message = 'Error in creating receipt';

  if (result.affectedRows) {
    message = 'Receipt created successfully';
  }

  return {message};
}

async function update(id, receipt){
  const result = await db.query(
    `UPDATE receipts 
    SET title="${receipt.title}", ingredients=${receipt.ingredients}, text=${receipt.text}
    WHERE id=${id}`
  );

  let message = 'Error in updating receipt';

  if (result.affectedRows) {
    message = 'Receipt updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM receipts WHERE id=${id}`
  );

  let message = 'Error in deleting receipt';

  if (result.affectedRows) {
    message = 'Receipt deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple, create, update, remove
}