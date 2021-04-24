const homeContoller= require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController');
const cartController= require('../app/http/controller/customers/cartController');
const { fileLoader } = require('ejs');
// here we are using factory pattern so instead of using // (req, res) => {
//     //     res.render("home");
//     //   } 
// we are using this structure of file.
function initRoutes(app){
app.get("/", homeContoller().index)
app.get('/cart' ,cartController().index);
app.get('/login' , authController().login)
app.get('/register' ,authController().register);
}


module.exports= initRoutes;