var locations = [2, 3, 4, 5, 6];

locations.forEach(function (num) {

});

for (var i = 0; i <= 10; i++) {
    (function (ind) {
        setTimeout(function () { 
            console.log(ind); 
        }, 1000 + (3000 * ind));
    })(i);
}