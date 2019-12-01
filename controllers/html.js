exports.navbar = (req,res,next) => {
    if(req.user){
        //Return html with profile link
        res.send(req.user);
    }else{
        //Return html with login link
        res.send();
    }
}