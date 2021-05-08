const express = require('express');
const router = express.Router();

module.exports = router;


router.get('/', (req, res) => {
    var data = {
        title :'Admin',
        slug : '',
        content: '',
    }

    res.render('_layouts/adminpages/index',data);
})
  