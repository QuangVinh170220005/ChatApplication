import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers,
    getMyFriends, 
    sendFriendRequest, 
    acceptFriendRequest, 
    getFriendRequests,
    getOutgoingFriendReq, 
    declineFriendRequest,
    cancleFriendRequest} 
    from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute); // Apply protectRoute middleware to all routes 

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendReq)

router.put("/friend-request/:id/decline", declineFriendRequest)
router.delete("frined-request/:id/cancle", cancleFriendRequest)

router.delete("friends/:friendId")



export default router;