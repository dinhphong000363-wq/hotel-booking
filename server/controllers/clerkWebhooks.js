import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        // verifying headers
        await whook.verify(JSON.stringify(req.body),headers)
        // getting data from request body
        const {data, type} = req.body
        const userData = {
            _id: data.id,
            email:data.email.address[0].email_adress,
            username:data.first_name + " "+ data.last_name,
            image: data.image_url,

        }
        switch (type) {
            case "user.create":{
                await User.create(userData)
                break;
            }
            case "user.update":{
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }
            case "user.delete":{
                await User.findByIdAndDelete(data.id)
                break;
            }
            default:
                break;
        }
        req.JSON({success: true, message: "Webhook Recieved"})
    } catch (error) {
        console.log(error.message);
        req.JSON({success: false, message:error.message})
        
    }
}
export default clerkWebhooks;