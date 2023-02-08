const router = require('express').Router();
const {upload_file ,downlode_page ,  downlode_file , send_Mail} = require('../controller/handle_files')

router.post('/' , upload_file)
router.get('/:id' , downlode_page)
router.get('/download/:id' , downlode_file)
router.post('/sendEmail' , send_Mail);


module.exports = router;