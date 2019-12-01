exports.navbar = (req,res,next) => {
    if(res.locals.userAuthed){
        //Return html with profile link
        res.send();
    }else{
        //Return html with login link
        res.send();
    }
}