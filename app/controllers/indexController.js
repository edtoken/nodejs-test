'use strict';

exports.home = function (req, res) {

    res.render('pages/home', {
        title: 'Index Page'
    });

}
