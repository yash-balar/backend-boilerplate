export const authMiddlewere = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader::::::::::", authHeader);
  const token = authHeader.split(" ")[1];
  console.log(token);
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;

  next();
};

// ----------------------------------------------------------------------------
// export const authMiddlewere = async (req, res, next) =>{
//     try {
//         const authHeader = req.headers.authorization
//         if(!authHeader){
//             return res.status(404).json({message: "Token is missing"})
//         }
//         const token = authHeader.split(" ")[1]
//         if(!token){
//             return res.status(404).json({message: "Token is missing"})
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decoded

//         console.log("decoded::::::::::::",decoded)

//         const role = decoded.role
//         if(!role){
//             return res.status(403).json({message: "User role is missing"})
//         }

//         const permissions = ROLE_PERMISSIONS[role] || []
//         console.log('permissions::::::::::',permissions)
//         if(!permissions){
//             return res.status(403).json({message: "you don't have this permission"})
//         }

//         req.user.permissions = permissions
//         next()

//     } catch (error) {
//         return res.status(401).json({message: "Invalid or expired token"})
//     }
// }

// // Middleware to check if user has specific permission
// export const requirePermission = (requiredPermission) => {
//     console.log('requiredPermission::::::::',requiredPermission)
//     return (req, res, next) => {
//         if(!req.user.permissions.includes(requiredPermission)) {
//             return res.status(403).json({
//                 message: `You don't have permission to access this. Required: ${requiredPermission}`
//             })
//         }
//         next()
//     }
// }

// -----------------------------------------------------------------------------------
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const rolePermissions = require("../constants/rolePermissions");

// const authenticate = async (req, res, next) => {
//   const authorization = req.get("authorization") || "";
//   const [scheme, token, extra] = authorization.split(" ");
//   if (scheme !== "Bearer" || !token || extra) {
//     return res.status(401).json({
//       success: false,
//       message: "Authentication token is required.",
//     });
//   }

//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return res.status(401).json({
//       success: false,
//       message: "Authentication token is invalid or expired. Please log in again.",
//     });
//   }

//   try {
//     const user = await User.findById(decoded.id).select("+token +tokenExpiresAt");
//     if (!user || user.token !== token || !user.tokenExpiresAt || user.tokenExpiresAt <= new Date()) {
//       return res.status(401).json({
//         success: false,
//         message: "Session expired. Please log in again.",
//       });
//     }
//     req.user = user;
//     req.permissions = rolePermissions[user.role] || [];
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const requirePermission = (requiredPermission) => {
//   return (req, res, next) => {
//     if (!req.permissions?.includes(requiredPermission)) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not have permission to perform this action.",
//       });
//     }
//     next();
//   };
// };

// module.exports = { authenticate, requirePermission };
