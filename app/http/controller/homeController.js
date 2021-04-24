const Menu= require('../../models/menu');
function homeController(){
    //factory pattern
    return{
        async index(req,res) {

            //second Method
            const pizzas=await Menu.find();
            return res.render('home', {pizza: pizzas});

        //    first method // menu.find().then((pizzas) =>{
        //     //     res.render('home', {pizza: pizzas});
        //     // });
        }
    }
}
module.exports= homeController;