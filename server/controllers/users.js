import User from "../models/User";


export const getUser = async (req,res) => {
    try {
        const { id } = req.params ;
        const user = await User.findById(id) ;
        res.status(200).json(user) ; 
    } catch (err) {
        res.status(404).json({error : err.message}) ;
    }
};


export const getUserFriends = async (req,res) => {
    try {
        const { id } = req.params ; // we will be requiring multiple calls to the DBs
        const user = User.findById(id) ;

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
           ({ _id , firstName , lastName , occupation , location , picturePath }) => {
            return {_id , firstName , lastName , occupation , location , picturePath };
           }
        )

        res.status(200).json(formattedFriends) ;

    } catch (err) {
        res.status(404).json({error : err.message}) ;
    }
};

// Updates 

export const addRemoveFriend = async (req,res) => {
    try {
        const { id , friendID } = req.params ;
        const user = User.findById(id) ;
        const friend = User.findById(friendID) ;

        if(user.friends.includes(friendID)) {
           user.friends = user.friends.filter((id) => id !== friendID) ;
           friend.friends = friend.friends.filter((id) => id !== id) 
        }
        else {
            user.friends.push(friendID) ;
            friend.friends.push(id) ;
        }

        await user.save() ;
        await friend.save() ;

        // now we again need to format it so that front end can use it --> vv important 

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
           ({ _id , firstName , lastName , occupation , location , picturePath }) => {
            return {_id , firstName , lastName , occupation , location , picturePath };
           }
        )

        res.status(200).json(formattedFriends) ;

    } catch (err) {
        res.status(404).json({error : err.message}) ;
    }
};