import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage:{
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
        // use để th ch đến ObjectId  MongoDB
        type: mongoose.Schema.Types.ObjectId, 
        // dung de tc
        ref: "User",
    }],
}, {timestamps: true})
    userSchema.pre("save", async function(next) {
        if(!this.isModified("password")) {
            return next();
        }
        try{
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
        }catch(error) {
            next(error)
        }
    })
// Hàm để so password
    userSchema.methods.matchPassword = async function(enteredPassword){
        const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password)
            return isPasswordCorrect
    }

const User = mongoose.model("User", userSchema)


export default User;