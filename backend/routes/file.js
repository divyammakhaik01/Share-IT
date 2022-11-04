const router = require('express').Router();
const {upload_file ,downlode_page ,  downlode_file} = require('../controller/handle_files')

router.post('/' , upload_file)
router.get('/:id' , downlode_page)
router.get('/download/:id' , downlode_file)


module.exports = router;