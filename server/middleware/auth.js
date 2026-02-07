import { clerkClient } from '@clerk/express';

const protectAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();

    if (!auth || !auth.userId) {
      return res.json({ success: false, message: 'User not authenticated' });
    }

    
    const user = await clerkClient.users.getUser(auth.userId);

    if (user.privateMetadata.role !== "admin") {
      return res.json({ success: false, message: "not authorized" });
    }

    next();
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

export default protectAdmin;
