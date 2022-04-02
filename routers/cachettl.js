import express from "express";
import { isAdminMiddleware }  from "../middlewares/validators.js"

const router = express.Router();
export let cachettl = 15000;

/**
 *  Set new cache ttl time
 *  (requires admin privilege - Autohrization: x-admin-key)
**/
router.post("/" ,isAdminMiddleware,async (req, res) => {  
  let oldCacheValue = cachettl;
  try {
    cachettl = req.body.ttl;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.status(201).json({ oldValue: oldCacheValue, newValue: cachettl });
});

export default router;
