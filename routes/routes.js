// const express = require("express");
// const router = express.Router();
// const receipts = require("../services/receipts");

// console.log('test')
// router.get("/published", receipts.findAllPublished);
//
// /* GET programming languages. */
// router.get('/', async function(req, res, next) {
//   try {
//     res.json(await receipts.getMultiple(req.query.page));
//   } catch (err) {
//     console.error(`Error while getting programming languages `, err.message);
//     next(err);
//   }
// });
//
// /* POST programming language */
// router.post('/', async function(req, res, next) {
//   try {
//     res.json(await receipts.create(req.body));
//   } catch (err) {
//     console.error(`Error while creating receipts`, err.message);
//     next(err);
//   }
// });
//
// /* PUT programming language */
// router.put('/:id', async function(req, res, next) {
//   try {
//     res.json(await receipts.update(req.params.id, req.body));
//   } catch (err) {
//     console.error(`Error while updating receipt`, err.message);
//     next(err);
//   }
// });
//
// /* DELETE programming language */
// router.delete('/:id', async function(req, res, next) {
//   try {
//     res.json(await receipts.remove(req.params.id));
//   } catch (err) {
//     console.error(`Error while deleting receipt`, err.message);
//     next(err);
//   }
// });

// module.exports = router;
